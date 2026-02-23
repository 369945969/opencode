import { Component, For } from 'solid-js';
import { CognitiveMode } from '../core/meta-cognition';

interface SidebarProps {
    currentMode: CognitiveMode;
    onModeChange: (mode: CognitiveMode) => void;
}

const Sidebar: Component<SidebarProps> = (props) => {
    const modes: CognitiveMode[] = ['Analyst', 'Architect', 'Craftsman', 'QA', 'DevOps'];

    return (
        <aside class="w-72 border-r border-white/10 glass-panel flex flex-col p-6 space-y-8 bg-[#0D1117]/80 backdrop-blur-xl">
            <div>
                <div class="text-[10px] font-mono text-[#00F0FF]/50 uppercase tracking-[0.2em] mb-4">Cognitive Modes</div>
                <nav class="space-y-2">
                    <For each={modes}>
                        {(mode) => (
                            <div
                                onClick={() => props.onModeChange(mode)}
                                class={`group flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 border ${props.currentMode === mode
                                        ? 'bg-[#00F0FF]/10 border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                                        : 'border-transparent hover:bg-white/5 text-white/50 hover:text-white'
                                    }`}
                            >
                                <div class={`w-2 h-2 rounded-full mr-4 transition-all duration-500 ${props.currentMode === mode ? 'bg-[#00F0FF] scale-125 shadow-[0_0_8px_#00F0FF]' : 'bg-white/20'
                                    }`} />
                                <span class="font-mono text-sm tracking-wide">{mode}</span>
                            </div>
                        )}
                    </For>
                </nav>
            </div>

            <div>
                <div class="text-[10px] font-mono text-[#FF006E]/50 uppercase tracking-[0.2em] mb-4">Memory System</div>
                <div class="space-y-4">
                    <div class="glass-panel p-3 rounded-lg border border-white/5">
                        <div class="flex justify-between text-[10px] font-mono mb-2">
                            <span class="text-white/40">WORKING MEMORY</span>
                            <span class="text-[#00F0FF]">5 / 7</span>
                        </div>
                        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full bg-[#00F0FF] transition-all duration-500" style="width: 71%"></div>
                        </div>
                    </div>
                    <div class="glass-panel p-3 rounded-lg border border-white/5">
                        <div class="flex justify-between text-[10px] font-mono mb-2">
                            <span class="text-white/40">SHORT-TERM</span>
                            <span class="text-[#FF006E]">128 Items</span>
                        </div>
                        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full bg-[#FF006E] transition-all duration-500" style="width: 45%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-grow" />

            <div class="p-4 rounded-2xl bg-gradient-to-br from-[#00F0FF]/10 to-transparent border border-[#00F0FF]/10">
                <div class="text-[10px] font-mono text-[#00F0FF] mb-1">SYSTEM HEALTH</div>
                <div class="text-xs text-white/60 mb-3 leading-tight italic">"All neural pathways optimized for parallel execution."</div>
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span class="text-[10px] font-mono text-green-500/80 tracking-tighter uppercase">Stable Orchestration</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
