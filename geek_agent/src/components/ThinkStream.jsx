import { For } from "solid-js";
const ThinkStream = (props) => {
    const isConnected = () => props.connected ?? false;
    return (<footer class="h-64 border-t border-white/10 glass-panel p-6 bg-[#0B0E14]/80 backdrop-blur-2xl flex flex-col relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent"></div>

      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <iconify-icon icon="line-md:text-box-to-text-box-transition" class="text-[#00F0FF] text-lg"></iconify-icon>
          <span class="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Live Think Stream</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="w-2 h-2 rounded-full" classList={{
            "bg-[#00F0FF] animate-ping": isConnected(),
            "bg-red-500": !isConnected(),
        }}/>
          <span class="text-[10px] font-mono uppercase tracking-tighter" classList={{
            "text-[#00F0FF]/60": isConnected(),
            "text-red-500": !isConnected(),
        }}>
            {isConnected() ? "Real-time processing" : "Disconnected"}
          </span>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide">
        <For each={props.items}>
          {(item) => (<div class="flex space-x-4 opacity-80 hover:opacity-100 transition-opacity">
              <span class="text-white/20">[{new Date(item.timestamp).toLocaleTimeString()}]</span>
              <span class="text-[#00F0FF]/40 uppercase tracking-tighter">{item.tags[0]}:</span>
              <span class="text-[#E8F0FF]/80 leading-relaxed font-light">{item.content}</span>
            </div>)}
        </For>
        <div class="flex space-x-4" classList={{ "animate-pulse": isConnected(), "opacity-50": !isConnected() }}>
          <span class="text-white/20">[{new Date().toLocaleTimeString()}]</span>
          <span class="text-[#00F0FF]/40 uppercase tracking-tighter">System:</span>
          <span class="text-[#00F0FF] leading-relaxed">_</span>
        </div>
      </div>
    </footer>);
};
export default ThinkStream;
