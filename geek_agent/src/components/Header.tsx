import { Component } from "solid-js"

interface HeaderProps {
  connected?: boolean
  latency?: number
}

const Header: Component<HeaderProps> = (props) => {
  const isConnected = () => props.connected ?? false
  const latency = () => props.latency ?? 0

  return (
    <header class="h-20 border-b border-white/10 flex items-center px-10 justify-between bg-[#0A0E1A]/60 backdrop-blur-md z-50 overflow-hidden relative">
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/20 to-transparent"></div>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <div class="w-4 h-4 bg-[#00F0FF] rounded-full shadow-[0_0_15px_#00F0FF]"></div>
          </div>
          <div
            class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0A0E1A]"
            classList={{
              "bg-green-500": isConnected(),
              "bg-red-500": !isConnected(),
            }}
          ></div>
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-[0.3em] text-[#E8F0FF]">GEEK AGENT</h1>
          <p class="text-[9px] font-mono text-[#00F0FF]/60 uppercase tracking-widest">Cognitive Orchestration v1.0.4</p>
        </div>
      </div>

      <div class="flex items-center space-x-6">
        <div
          class="px-4 py-2 rounded-lg border flex items-center space-x-2"
          classList={{
            "bg-green-500/10 border-green-500/30": isConnected(),
            "bg-red-500/10 border-red-500/30 animate-pulse": !isConnected(),
          }}
        >
          <div
            class="w-2 h-2 rounded-full"
            classList={{
              "bg-green-500": isConnected(),
              "bg-red-500": !isConnected(),
            }}
          />
          <span
            class="text-xs font-mono font-bold"
            classList={{
              "text-green-500": isConnected(),
              "text-red-500": !isConnected(),
            }}
          >
            {isConnected() ? "SSE Connected" : "SSE Disconnected"}
          </span>
        </div>

        <div class="flex flex-col items-end">
          <span class="text-[9px] font-mono text-white/30 uppercase tracking-tighter">Latency</span>
          <span
            class="text-xs font-mono"
            classList={{
              "text-[#00F0FF]": isConnected(),
              "text-red-500": !isConnected(),
            }}
          >
            {isConnected() ? `${latency()}ms` : "--"}
          </span>
        </div>

        <div class="w-px h-8 bg-white/10"></div>
        <div class="flex items-center space-x-3 group cursor-pointer">
          <div class="flex flex-col items-end">
            <span class="text-[9px] font-mono text-white/40 uppercase">User</span>
            <span class="text-xs text-white/80 group-hover:text-[#00F0FF] transition-colors">Admin_Dev</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00F0FF]/30 transition-all">
            <iconify-icon icon="line-md:account" class="text-lg"></iconify-icon>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
