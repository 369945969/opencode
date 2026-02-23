import { createSignal, onMount, onCleanup } from "solid-js";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SessionPanel from "./components/SessionPanel";
import ThinkStream from "./components/ThinkStream";
import { engine } from "./core/engine";
function App() {
    const [currentMode, setCurrentMode] = createSignal(engine.meta.getCurrentMode());
    const [sessions, setSessions] = createSignal(engine.sessions.getSessions());
    const [memories, setMemories] = createSignal(engine.memory.getMemories("working"));
    const [objective, setObjective] = createSignal("");
    const [connected, setConnected] = createSignal(false);
    const [latency, setLatency] = createSignal(0);
    const [selectedSessionId, setSelectedSessionId] = createSignal(null);
    const [sessionLog, setSessionLog] = createSignal([]);
    onMount(() => {
        console.log("[GeekAgent] Starting connection to OpenCode...");
        engine.connect();
        engine.client.on("connection", (data) => {
            console.log("[GeekAgent] Connection event:", data);
        });
        const interval = setInterval(() => {
            setCurrentMode(engine.meta.getCurrentMode());
            setSessions(engine.sessions.getSessions());
            setMemories([...engine.memory.getMemories("working"), ...engine.memory.getMemories("sensory").slice(-5)].sort((a, b) => b.timestamp - a.timestamp));
            setConnected(engine.connectionStatus.connected);
            setLatency(engine.connectionStatus.latency);
            const id = selectedSessionId();
            if (id) {
                setSessionLog(engine.getSessionLog(id));
            }
        }, 1000);
        onCleanup(() => clearInterval(interval));
    });
    const handleInitiate = () => {
        if (!objective().trim())
            return;
        engine.processObjective(objective());
        setObjective("");
    };
    const handleModeChange = (mode) => {
        engine.meta.setMode(mode);
    };
    const handleReconnect = () => {
        engine.client.connectEvents();
    };
    const handleSelectSession = (id) => {
        setSelectedSessionId(id);
        setSessionLog(engine.getSessionLog(id));
    };
    return (<div class="h-screen w-screen flex flex-col overflow-hidden bg-[#0A0E1A] text-[#E8F0FF]">
      <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div class="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF006E]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <Header connected={connected()} latency={latency()}/>

      <main class="flex-grow flex overflow-hidden relative z-10">
        <Sidebar currentMode={currentMode()} onModeChange={handleModeChange}/>

        <div class="flex-grow flex flex-col overflow-hidden">
          <div class="flex-grow overflow-hidden flex flex-col">
            <div class="p-6">
              <div class="max-w-4xl mx-auto">
                <div class="glass-panel p-6 border border-[#00F0FF]/10 bg-[#0D1117]/40 flex flex-col space-y-4 shadow-2xl">
                  <div class="flex items-center space-x-4">
                    <input type="text" value={objective()} onInput={(e) => setObjective(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && handleInitiate()} placeholder="Type your objective (e.g., 'Design a blog system with payments')" class="flex-grow bg-black/40 border border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-[#00F0FF]/40 transition-all font-mono text-sm placeholder:text-white/20"/>
                    <button onClick={handleInitiate} class="bg-[#00F0FF] text-[#0A0E1A] font-bold px-10 py-4 rounded-xl hover:bg-[#00F0FF]/80 transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95">
                      INITIATE
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 rounded-full" classList={{
            "bg-green-500": connected(),
            "bg-red-500": !connected(),
        }}/>
                      <span class="text-xs font-mono" classList={{
            "text-green-500": connected(),
            "text-red-500": !connected(),
        }}>
                        {connected() ? "OpenCode SSE Connected" : "OpenCode SSE Disconnected"}
                      </span>
                    </div>
                    <button onClick={handleReconnect} disabled={connected()} class="text-xs px-3 py-1 rounded border border-white/10 hover:border-[#00F0FF]/50 hover:text-[#00F0FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Reconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <SessionPanel sessions={sessions()} selectedId={selectedSessionId()} onSelect={handleSelectSession}/>
          </div>

          {selectedSessionId() && (<div class="h-56 border-t border-white/10 glass-panel mx-10 mb-2 px-6 py-4 bg-[#050711]/80 backdrop-blur-xl overflow-hidden flex flex-col">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <iconify-icon icon="line-md:clipboard-arrow-twotone-to-top" class="text-[#00F0FF] text-lg"></iconify-icon>
                  <span class="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                    Agent Detail · {selectedSessionId()}
                  </span>
                </div>
              </div>
              <div class="flex-grow overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide">
                {sessionLog().map((item) => (<div class="flex space-x-4 opacity-80 hover:opacity-100 transition-opacity">
                    <span class="text-white/20">[{new Date(item.timestamp).toLocaleTimeString()}]</span>
                    <span class="uppercase tracking-tighter" classList={{
                    "text-[#00F0FF]/60": item.role === "assistant",
                    "text-[#FFB4E6]/70": item.role === "user",
                    "text-white/40": item.role !== "assistant" && item.role !== "user",
                }}>
                      {item.role}:
                    </span>
                    <span class="text-[#E8F0FF]/80 leading-relaxed">{item.content}</span>
                  </div>))}
              </div>
            </div>)}

          <ThinkStream items={memories()} connected={connected()}/>
        </div>
      </main>
    </div>);
}
export default App;
