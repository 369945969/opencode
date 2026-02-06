import path from "node:path"
import fs from "node:fs/promises"
import type { Dirent } from "node:fs"
import { Database } from "bun:sqlite"

export type ProxyConfig = {
  baseUrl?: string
  host?: string
  port?: number
  username?: string
  password?: string
  pmRoot?: string
  pmDepth?: number
  pmMaxBytes?: number
}

type TreeFile = {
  path: string
  name: string
  type: "file"
  size: number
  updatedAt: number
  content?: string
}

type TreeDir = {
  path: string
  name: string
  type: "dir"
  children: TreeItem[]
}

type TreeItem = TreeFile | TreeDir

type AppItem = {
  uuid: string
  sessionId: string
  appName: string
  path: string
}

type UserRow = {
  id: string
  root: string
  current_uuid: string | null
}

const defaults = {
  baseUrl: process.env.OPENCODE_BASE_URL ?? "http://127.0.0.1:4096",
  host: process.env.PROXY_HOST ?? "0.0.0.0",
  port: Number(process.env.PROXY_PORT ?? "4097"),
  username: process.env.OPENCODE_SERVER_USERNAME ?? "",
  password: process.env.OPENCODE_SERVER_PASSWORD ?? "",
  pmRoot: process.env.PM_ROOT ?? process.cwd(),
  pmDepth: Number(process.env.PM_DEPTH ?? "3"),
  pmMaxBytes: Number(process.env.PM_MAX_BYTES ?? "1048576"),
}

const text = new TextEncoder()
const dbPath = path.join(process.cwd(), "src-proxy", "store.sqlite")
const appsBase = path.join(process.cwd(), "apps")
const db = new Database(dbPath, { create: true })

db.exec(
  "create table if not exists users (id text primary key, root text not null, current_uuid text)",
)
db.exec(
  "create table if not exists apps (uuid text primary key, user_id text not null, session_id text not null, app_name text not null, path text not null, created_at integer not null)",
)

const readTree = async (root: string, depth: number, maxDepth: number, maxBytes: number) => {
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => [])
  const list = await Promise.all(
    entries.map(async (entry: Dirent) => {
      const full = path.join(root, entry.name)
      const rel = path.relative(process.cwd(), full)
      const stat = await fs.stat(full).catch(() => null)
      if (!stat) return null
      if (entry.isDirectory()) {
        if (depth >= maxDepth) {
          const item: TreeDir = { path: rel, name: entry.name, type: "dir", children: [] }
          return item
        }
        const children = await readTree(full, depth + 1, maxDepth, maxBytes)
        const item: TreeDir = { path: rel, name: entry.name, type: "dir", children }
        return item
      }
      const file = Bun.file(full)
      const size = file.size
      const ext = path.extname(entry.name).toLowerCase()
      const isText = [".md", ".txt", ".json", ".yaml", ".yml", ".js", ".ts", ".tsx", ".css", ".html"].includes(ext)
      const content = isText && size <= maxBytes ? await file.text() : undefined
      const item: TreeFile = { path: rel, name: entry.name, type: "file", size, updatedAt: stat.mtimeMs, content }
      return item
    }),
  )
  return list.filter((item): item is TreeItem => Boolean(item))
}

const normalizeRoot = (root: string) => {
  if (path.isAbsolute(root)) return root
  return path.join(process.cwd(), root)
}

const ensureUser = async (user: string) => {
  const row = db
    .query("select id, root, current_uuid from users where id = ?")
    .get(user) as UserRow | undefined
  if (row) {
    const root = normalizeRoot(row.root)
    if (root !== row.root) {
      db.query("update users set root = ? where id = ?").run(root, user)
    }
    await fs.mkdir(root, { recursive: true })
    return { id: row.id, root, current: row.current_uuid ?? "" }
  }
  const root = path.join(appsBase, user)
  db.query("insert into users (id, root, current_uuid) values (?, ?, '')").run(user, root)
  await fs.mkdir(root, { recursive: true })
  return { id: user, root, current: "" }
}

const parseCookies = (value: string) => {
  const map: Record<string, string> = {}
  if (!value) return map
  value.split(";").forEach((part) => {
    const index = part.indexOf("=")
    if (index < 0) return
    const key = part.slice(0, index).trim()
    const val = part.slice(index + 1).trim()
    if (!key) return
    map[key] = decodeURIComponent(val)
  })
  return map
}

const setCookie = (headers: Headers, key: string, value: string) => {
  const line = `${key}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`
  headers.append("Set-Cookie", line)
}

const createAuth = (username: string, password: string) => {
  if (!username || !password) return ""
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
}

const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
}

export const createProxy = (input: ProxyConfig = {}) => {
  const config = { ...defaults, ...input }
  const clients = new Set<ReadableStreamDefaultController<Uint8Array>>()
  const auth = createAuth(config.username, config.password)
  let backendConnected = false

  const broadcast = (data: string) => {
    const payload = text.encode(data)
    clients.forEach((client) => {
      try {
        client.enqueue(payload)
      } catch {
        clients.delete(client)
      }
    })
  }

  const sendStatus = () => {
    broadcast(
      `data: ${JSON.stringify({ type: "proxy.status", connected: backendConnected, ts: Date.now() })}\n\n`,
    )
  }

  const setBackendConnected = (value: boolean) => {
    if (backendConnected === value) return
    backendConnected = value
    sendStatus()
  }

  const connectEvents = async () => {
    const headers = new Headers({ Accept: "text/event-stream" })
    if (auth) headers.set("Authorization", auth)
    try {
      const res = await fetch(`${config.baseUrl}/event`, { headers })
      if (!res.ok || !res.body) {
        setBackendConnected(false)
        setTimeout(connectEvents, 2000)
        return
      }
      setBackendConnected(true)
      const reader = res.body.getReader()
      for (;;) {
        const result = await reader.read().catch(() => null)
        if (!result || result.done) {
          setBackendConnected(false)
          setTimeout(connectEvents, 2000)
          return
        }
        const chunk = new TextDecoder().decode(result.value)
        broadcast(chunk)
      }
    } catch {
      setBackendConnected(false)
      setTimeout(connectEvents, 2000)
    }
  }

  const sseResponse = () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        clients.add(controller)
        try {
          controller.enqueue(text.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`))
          controller.enqueue(
            text.encode(
              `data: ${JSON.stringify({ type: "proxy.status", connected: backendConnected, ts: Date.now() })}\n\n`,
            ),
          )
        } catch {
          clients.delete(controller)
          return
        }
        const timer = setInterval(() => {
          try {
            controller.enqueue(text.encode(":\n\n"))
          } catch {
            clearInterval(timer)
            clients.delete(controller)
          }
        }, 15000)
        return () => {
          clearInterval(timer)
          clients.delete(controller)
        }
      },
      cancel() {},
    })
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        ...baseHeaders,
      },
    })
  }

  const pmResponse = async () => {
    const roots = [
      "01-Global-Context",
      "02-Feature-Plan",
      "03-Style-Guide",
      "04-Screen-Prototype",
    ]
    const data = await Promise.all(
      roots.map(async (name) => {
        const full = path.join(config.pmRoot, name)
        const exists = await fs.stat(full).then(() => true).catch(() => false)
        if (!exists) return { name, path: full, exists, items: [] as TreeItem[] }
        const items = await readTree(full, 0, config.pmDepth, config.pmMaxBytes)
        return { name, path: full, exists, items }
      }),
    )
    return Response.json({ root: config.pmRoot, folders: data }, { headers: baseHeaders })
  }

  const appsList = async (req: Request) => {
    const cookies = parseCookies(req.headers.get("cookie") ?? "")
    const user = cookies.user ?? "default"
    const userRow = await ensureUser(user)
    const rows = db
      .query(
        "select uuid, session_id as sessionId, app_name as appName, path from apps where user_id = ? order by created_at desc",
      )
      .all(user) as AppItem[]
    const cookieUuid = cookies.app_uuid ?? ""
    const cookieApp = rows.find((item) => item.uuid === cookieUuid)
    const current = cookieApp?.uuid ?? userRow.current ?? rows[0]?.uuid ?? ""
    if (current !== userRow.current) {
      db.query("update users set current_uuid = ? where id = ?").run(current, user)
    }
    const headers = new Headers(baseHeaders)
    if (current) {
      const active = rows.find((item) => item.uuid === current)
      if (active) {
        setCookie(headers, "app_uuid", active.uuid)
        setCookie(headers, "app_session", active.sessionId)
        setCookie(headers, "app_name", active.appName)
      }
    }
    return Response.json(
      {
        user,
        root: userRow.root,
        apps: rows,
        current,
      },
      { headers },
    )
  }

  const appsCreate = async (req: Request) => {
    const body = await req.json().catch(() => null)
    const appName =
      typeof body?.appName === "string"
        ? body.appName
        : typeof body?.name === "string"
          ? body.name
          : ""
    if (!appName) {
      return Response.json({ error: "appName required" }, { status: 400, headers: baseHeaders })
    }
    const cookies = parseCookies(req.headers.get("cookie") ?? "")
    const user = cookies.user ?? "default"
    const userRow = await ensureUser(user)
    const uuid = crypto.randomUUID()
    const seed = `ses_${uuid}`
    const perm = [
      { permission: "edit", pattern: "*", action: "allow" },
      { permission: "bash", pattern: "*", action: "allow" },
      { permission: "read", pattern: "*", action: "allow" },
    ]
    const headers = new Headers({ "Content-Type": "application/json" })
    if (auth) headers.set("Authorization", auth)
    const res = await fetch(`${config.baseUrl}/session`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title: `${appName} (${seed})`, permission: perm }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.id) {
      return Response.json({ error: "session create failed" }, { status: 500, headers: baseHeaders })
    }
    const appPath = path.join(userRow.root, uuid)
    await fs.mkdir(appPath, { recursive: true })
    const app: AppItem = {
      uuid,
      sessionId: data.id,
      appName,
      path: appPath,
    }
    db.query(
      "insert into apps (uuid, user_id, session_id, app_name, path, created_at) values (?, ?, ?, ?, ?, ?)",
    ).run(app.uuid, user, app.sessionId, app.appName, app.path, Date.now())
    db.query("update users set current_uuid = ? where id = ?").run(app.uuid, user)
    const out = new Headers(baseHeaders)
    setCookie(out, "app_uuid", app.uuid)
    setCookie(out, "app_session", app.sessionId)
    setCookie(out, "app_name", app.appName)
    return Response.json(app, { headers: out })
  }

  const proxyFetch = async (req: Request) => {
    const url = new URL(req.url)
    const target = new URL(url.pathname + url.search, config.baseUrl)
    const headers = new Headers(req.headers)
    headers.delete("host")
    headers.delete("connection")
    if (auth && !headers.get("authorization")) headers.set("authorization", auth)
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : req.body
    const res = await fetch(target, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    })
    const out = new Headers(res.headers)
    out.set("Access-Control-Allow-Origin", "*")
    out.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    out.set("Access-Control-Allow-Headers", "*")
    return new Response(res.body, { status: res.status, headers: out })
  }

  const fetchHandler = async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: baseHeaders })
    const url = new URL(req.url)
    if (url.pathname === "/events") return sseResponse()
    if (url.pathname === "/pm/dirs") return pmResponse()
    if (url.pathname === "/apps" && req.method === "GET") return appsList(req)
    if (url.pathname === "/apps" && req.method === "POST") return appsCreate(req)
    return proxyFetch(req)
  }

  const start = () => {
    connectEvents()
    return Bun.serve({
      port: config.port,
      hostname: config.host,
      idleTimeout: 0,
      fetch: fetchHandler,
    })
  }

  const request = (pathValue: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers)
    if (auth && !headers.get("authorization")) headers.set("authorization", auth)
    const target = new URL(pathValue, config.baseUrl)
    return fetch(target, { ...init, headers })
  }

  const eventStream = () => {
    const headers = new Headers({ Accept: "text/event-stream" })
    if (auth) headers.set("Authorization", auth)
    return fetch(`${config.baseUrl}/event`, { headers })
  }

  return { start, fetch: fetchHandler, request, eventStream, config }
}

if (import.meta.main) {
  createProxy().start()
}
