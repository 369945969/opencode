mod cli;

use cli::{install_cli, sync_cli};
use futures::FutureExt;
use futures::future;
use std::{
    collections::VecDeque,
    net::TcpListener,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use tauri::{AppHandle, Manager, RunEvent, State, WebviewWindowBuilder, LogicalSize};
#[cfg(any(target_os = "linux", all(debug_assertions, windows)))]
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogResult};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_store::StoreExt;
use tokio::sync::oneshot;

const SETTINGS_STORE: &str = "opencode.settings.dat";
const DEFAULT_SERVER_URL_KEY: &str = "defaultServerUrl";

#[derive(Clone, serde::Serialize)]
struct ServerReadyData {
    url: String,
    password: Option<String>,
}

#[derive(Clone)]
struct ServerState {
    child: Arc<Mutex<Option<CommandChild>>>,
    status: future::Shared<oneshot::Receiver<Result<ServerReadyData, String>>>,
}

impl ServerState {
    pub fn new(
        child: Option<CommandChild>,
        status: oneshot::Receiver<Result<ServerReadyData, String>>,
    ) -> Self {
        Self {
            child: Arc::new(Mutex::new(child)),
            status: status.shared(),
        }
    }

    pub fn set_child(&self, child: Option<CommandChild>) {
        *self.child.lock().unwrap() = child;
    }
}

#[derive(Clone)]
struct LogState(Arc<Mutex<VecDeque<String>>>);

const MAX_LOG_ENTRIES: usize = 200;

#[tauri::command]
fn kill_sidecar(app: AppHandle) {
    let Some(server_state) = app.try_state::<ServerState>() else {
        println!("Server not running");
        return;
    };

    let Some(server_state) = server_state
        .child
        .lock()
        .expect("Failed to acquire mutex lock")
        .take()
    else {
        println!("Server state missing");
        return;
    };

    let _ = server_state.kill();

    println!("Killed server");
}

async fn get_logs(app: AppHandle) -> Result<String, String> {
    let log_state = app.try_state::<LogState>().ok_or("Log state not found")?;

    let logs = log_state
        .0
        .lock()
        .map_err(|_| "Failed to acquire log lock")?;

    Ok(logs.iter().cloned().collect::<Vec<_>>().join(""))
}

#[tauri::command]
async fn ensure_server_ready(state: State<'_, ServerState>) -> Result<ServerReadyData, String> {
    state
        .status
        .clone()
        .await
        .map_err(|_| "Failed to get server status".to_string())?
}

#[tauri::command]
fn get_default_server_url(app: AppHandle) -> Result<Option<String>, String> {
    let store = app
        .store(SETTINGS_STORE)
        .map_err(|e| format!("Failed to open settings store: {}", e))?;

    let value = store.get(DEFAULT_SERVER_URL_KEY);
    match value {
        Some(v) => Ok(v.as_str().map(String::from)),
        None => Ok(None),
    }
}

#[tauri::command]
async fn set_default_server_url(app: AppHandle, url: Option<String>) -> Result<(), String> {
    let store = app
        .store(SETTINGS_STORE)
        .map_err(|e| format!("Failed to open settings store: {}", e))?;

    match url {
        Some(u) => {
            store.set(DEFAULT_SERVER_URL_KEY, serde_json::Value::String(u));
        }
        None => {
            store.delete(DEFAULT_SERVER_URL_KEY);
        }
    }

    store
        .save()
        .map_err(|e| format!("Failed to save settings: {}", e))?;

    Ok(())
}

fn get_sidecar_port() -> u32 {
    54320
}

fn spawn_sidecar(app: &AppHandle, hostname: &str, port: u32, password: &str) -> CommandChild {
    let log_state = app.state::<LogState>();
    let log_state_clone = log_state.0.clone();

    println!("spawning sidecar on port {port}");

    let (mut rx, child) = cli::create_command(
        app,
        format!("serve --hostname {hostname} --port {port}").as_str(),
    )
    .env("OPENCODE_SERVER_USERNAME", "opencode")
    .env("OPENCODE_SERVER_PASSWORD", password)
    .spawn()
    .expect("Failed to spawn opencode");

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes);
                    print!("{line}");

                    // Store log in shared state
                    if let Ok(mut logs) = log_state_clone.lock() {
                        logs.push_back(format!("[STDOUT] {}", line));
                        // Keep only the last MAX_LOG_ENTRIES
                        while logs.len() > MAX_LOG_ENTRIES {
                            logs.pop_front();
                        }
                    }
                }
                CommandEvent::Stderr(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes);
                    eprint!("{line}");

                    // Store log in shared state
                    if let Ok(mut logs) = log_state_clone.lock() {
                        logs.push_back(format!("[STDERR] {}", line));
                        // Keep only the last MAX_LOG_ENTRIES
                        while logs.len() > MAX_LOG_ENTRIES {
                            logs.pop_front();
                        }
                    }
                }
                _ => {}
            }
        }
    });

    child
}

fn url_is_localhost(url: &reqwest::Url) -> bool {
    url.host_str().is_some_and(|host| {
        host.eq_ignore_ascii_case("localhost")
            || host
                .parse::<std::net::IpAddr>()
                .is_ok_and(|ip| ip.is_loopback())
    })
}

async fn check_server_health(url: &str, password: Option<&str>) -> bool {
    let Ok(url) = reqwest::Url::parse(url) else {
        return false;
    };

    let mut builder = reqwest::Client::builder().timeout(Duration::from_secs(3));

    if url_is_localhost(&url) {
        builder = builder.no_proxy();
    };

    let Ok(client) = builder.build() else {
        return false;
    };
    let Ok(health_url) = url.join("/global/health") else {
        return false;
    };

    let mut req = client.get(health_url);

    if let Some(password) = password {
        req = req.basic_auth("opencode", Some(password));
    }

    req.send()
        .await
        .map(|r| r.status().is_success())
        .unwrap_or(false)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let updater_enabled = option_env!("TAURI_SIGNING_PRIVATE_KEY").is_some();

    #[cfg(all(target_os = "macos", not(debug_assertions)))]
    let _ = std::process::Command::new("killall")
        .arg("opencode-cli")
        .output();

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            kill_sidecar,
            install_cli,
            ensure_server_ready,
            get_default_server_url,
            set_default_server_url,
        ])
        .setup(move |app| {
            let app = app.handle().clone();

            // Initialize log state
            app.manage(LogState(Arc::new(Mutex::new(VecDeque::new()))));

            let (tx, rx) = oneshot::channel();
            app.manage(ServerState::new(None, rx));

            {
                let app = app.clone();
                tauri::async_runtime::spawn(async move {
                    let mut custom_url = None;

                    if let Some(url) = get_default_server_url(app.clone()).ok().flatten() {
                        println!("Using desktop-specific custom URL: {url}");
                        custom_url = Some(url);
                    }

                    if custom_url.is_none() {
                        if let Some(cli_config) = cli::get_config(&app).await {
                             if let Some(url) = get_server_url_from_config(&cli_config) {
                                println!("Using custom server URL from config: {url}");
                                custom_url = Some(url);
                             }
                        }
                    }

                    let res = match setup_server_connection(&app, custom_url).await {
                        Ok((child, url)) => {
                            app.state::<ServerState>().set_child(child);
                            Ok(url)
                        }
                        Err(e) => Err(e),
                    };

                    let _ = tx.send(res);
                });
            }

            {
                let app = app.clone();
                tauri::async_runtime::spawn(async move {
                    if let Err(e) = sync_cli(app) {
                        eprintln!("Failed to sync CLI: {e}");
                    }
                });
            }

             if cfg!(debug_assertions) {
                app.plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
                )?;
            }

            Ok(())
        });

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn normalize_hostname_for_url(hostname: &str) -> String {
    if hostname == "0.0.0.0" {
        return "127.0.0.1".to_string();
    }
    if hostname == "::" {
        return "[::1]".to_string();
    }
    if hostname.contains(':') && !hostname.starts_with('[') {
        return format!("[{}]", hostname);
    }
    hostname.to_string()
}

fn get_server_url_from_config(config: &cli::Config) -> Option<String> {
    let server = config.server.as_ref()?;
    let port = server.port?;
    println!("server.port found in OC config: {port}");
    let hostname = server
        .hostname
        .as_ref()
        .map(|v| normalize_hostname_for_url(v))
        .unwrap_or_else(|| "127.0.0.1".to_string());

    Some(format!("http://{}:{}", hostname, port))
}

async fn setup_server_connection(
    app: &AppHandle,
    custom_url: Option<String>,
) -> Result<(Option<CommandChild>, ServerReadyData), String> {
    if let Some(url) = custom_url {
        loop {
            if check_server_health(&url, None).await {
                println!("Connected to custom server: {}", url);
                return Ok((
                    None,
                    ServerReadyData {
                        url: url.clone(),
                        password: None,
                    },
                ));
            }

            const RETRY: &str = "Retry";

            let res = app.dialog()
              .message(format!("Could not connect to configured server:\n{}\n\nWould you like to retry or start a local server instead?", url))
              .title("Connection Failed")
              .buttons(MessageDialogButtons::OkCancelCustom(RETRY.to_string(), "Start Local".to_string()))
              .blocking_show_with_result();

            match res {
                MessageDialogResult::Custom(name) if name == RETRY => {
                    continue;
                }
                _ => {
                    break;
                }
            }
        }
    }

    let local_port = get_sidecar_port();
    let hostname = "127.0.0.1";
    let local_url = format!("http://{hostname}:{local_port}");

    if !check_server_health(&local_url, None).await {
        let password = uuid::Uuid::new_v4().to_string();

        match spawn_local_server(app, hostname, local_port, &password).await {
            Ok(child) => Ok((
                Some(child),
                ServerReadyData {
                    url: local_url,
                    password: Some(password),
                },
            )),
            Err(err) => Err(err),
        }
    } else {
        Ok((
            None,
            ServerReadyData {
                url: local_url,
                password: None,
            },
        ))
    }
}

async fn spawn_local_server(
    app: &AppHandle,
    hostname: &str,
    port: u32,
    password: &str,
) -> Result<CommandChild, String> {
    let child = spawn_sidecar(app, hostname, port, password);
    let url = format!("http://{hostname}:{port}");

    let timestamp = Instant::now();
    loop {
        if timestamp.elapsed() > Duration::from_secs(30) {
            break Err(format!(
                "Failed to spawn OpenCode Server. Logs:\n{}",
                get_logs(app.clone()).await.unwrap()
            ));
        }

        tokio::time::sleep(Duration::from_millis(10)).await;

        if check_server_health(&url, Some(password)).await {
            println!("Server ready after {:?}", timestamp.elapsed());
            break Ok(child);
        }
    }
}
