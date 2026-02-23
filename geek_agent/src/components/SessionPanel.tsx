import { Component, For } from 'solid-js';
import { Session } from '../core/session-manager';

interface SessionPanelProps {
  sessions: Session[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const SessionPanel: Component<SessionPanelProps> = (props) => {
  return (
    <div class="flex-grow p-10 overflow-y-auto bg-gradient-to-b from-transparent to-[#0A0E1A]/40 scrollbar-hide">
      <div class="max-w-6xl mx-auto space-y-10">
        <header class="flex justify-between items-end">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">
              Workspace <span class="text-[#00F0FF]">Dashboard</span>
            </h2>
            <p class="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">
              Orchestrating {props.sessions.length} active sessions
            </p>
          </div>
          <button class="bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 text-[#00F0FF] px-8 py-2.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            + NEW SESSION
          </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <For each={props.sessions}>
            {(session) => (
              <div
                class={`glass-panel p-8 group relative overflow-hidden transition-all duration-500 hover:border-[#00F0FF]/40 border ${
                  session.type === 'Master' ? 'border-[#00F0FF]/20' : 'border-white/5'
                } ${props.selectedId === session.id ? 'ring-1 ring-[#00F0FF]/60' : ''}`}
                onClick={() => props.onSelect && props.onSelect(session.id)}
              >
                <div
                  class={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${
                    session.type === 'Master' ? 'bg-[#00F0FF]' : 'bg-[#FF006E]'
                  }`}
                ></div>

                <div class="relative z-10">
                  <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center space-x-4">
                      <div
                        class={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 ${
                          session.type === 'Master'
                            ? 'bg-[#00F0FF]/5 border-[#00F0FF]/20 text-[#00F0FF]'
                            : 'bg-[#FF006E]/5 border-[#FF006E]/20 text-[#FF006E]'
                        }`}
                      >
                        <iconify-icon
                          icon={session.type === 'Master' ? 'line-md:brain' : 'line-md:cog-loop'}
                          class="text-3xl"
                        ></iconify-icon>
                      </div>
                      <div>
                        <div class="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">
                          {session.type} SESSION
                        </div>
                        <h3 class="text-lg font-bold text-white/90 group-hover:text-white transition-colors tracking-tight">
                          {session.id.toUpperCase()}
                        </h3>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      <div class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      <span class="text-[9px] font-mono text-white/60 uppercase tracking-tighter">
                        {session.status}
                      </span>
                    </div>
                  </div>

                  <div class="mb-8 p-5 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-white/70 italic min-h-[70px] flex items-center leading-relaxed">
                    "{session.task}"
                  </div>

                  <div class="space-y-6">
                    <div>
                      <div class="flex justify-between text-[9px] font-mono mb-2 tracking-tighter">
                        <span class="text-white/30 uppercase">Cognitive Progress</span>
                        <span class="text-[#00F0FF]">{session.progress}%</span>
                      </div>
                      <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <div
                          class="h-full bg-gradient-to-r from-[#00F0FF] to-[#0090FF] transition-all duration-1000 rounded-full"
                          style={{ width: `${session.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div class="flex justify-between items-center pt-2 border-t border-white/5">
                      <div class="flex space-x-8">
                        <div class="flex flex-col">
                          <span class="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Tokens</span>
                          <span class="text-xs text-[#00F0FF] font-mono">{session.tokensUsed}k</span>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Lifecycle</span>
                          <span class="text-xs text-white/50 font-mono italic">Persistent</span>
                        </div>
                      </div>
                      <div class="flex space-x-3">
                        <button class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00F0FF]/20 hover:border-[#00F0FF]/40 transition-all group/btn">
                          <iconify-icon
                            icon="line-md:play"
                            class="text-sm group-hover/btn:scale-110 transition-transform"
                          ></iconify-icon>
                        </button>
                        <button class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF006E]/20 hover:border-[#FF006E]/40 transition-all group/btn">
                          <iconify-icon
                            icon="line-md:close"
                            class="text-sm group-hover/btn:scale-110 transition-transform"
                          ></iconify-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default SessionPanel;
