import type { Component } from "solid-js"
import { For, createSignal, onMount } from "solid-js"

interface HomeProps {
  onNavigate: (page: string) => void
}

const Home: Component<HomeProps> = () => {
  const base = import.meta.env.VITE_PROXY_URL ?? "http://localhost:4097"
  const [creating, setCreating] = createSignal(false)
  const examples = [
    {
      title: "制造运营大屏",
      desc: "产能、良率、工单与异常告警统一监控",
      prompt: "设计制造运营大屏，聚合产能、良率、工单与异常告警，突出关键指标与趋势",
    },
    {
      title: "园区监控大屏",
      desc: "安防态势、告警联动与巡检闭环",
      prompt: "搭建园区监控大屏，包含安防态势、告警联动、巡检进度与热点区域",
    },
    {
      title: "物流调度大屏",
      desc: "车辆轨迹、时效与载重分布一览",
      prompt: "设计物流调度大屏，展示车辆轨迹、时效、载重分布与异常路段",
    },
  ]
  const handleExampleClick = (text: string) => {
    window.dispatchEvent(new CustomEvent("home_example", { detail: { text } }))
  }

  const cookieValue = (key: string) => {
    const source = document.cookie || ""
    const list = source.split(";").map((part) => part.trim())
    for (const item of list) {
      if (!item.startsWith(`${key}=`)) continue
      return decodeURIComponent(item.slice(key.length + 1))
    }
    return ""
  }

  onMount(async () => {
    const cookieSession = cookieValue("app_session")
    if (cookieSession) {
      // User requested: Check and ensure directory exists for existing session
      await fetch(`${base}/session/${cookieSession}/ensure`, {
          method: "POST"
      }).catch(e => console.error("Ensure dir failed", e))
      return
    }
    setCreating(true)
    const res = await fetch(`${base}/apps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appName: "default" }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      setCreating(false)
      console.error(data?.error ?? "创建失败")
      return
    }
    setCreating(false)
    
    // User requested: Save session to cookie to reuse on refresh
    document.cookie = `app_session=${data.sessionId}; path=/; max-age=31536000; SameSite=Lax`
    
    window.dispatchEvent(
      new CustomEvent("app_created", {
        detail: { sessionId: data.sessionId, appName: data.appName, uuid: data.uuid },
      }),
    )
  })

  return (
    <main id="14:31" style="padding: 1.5rem 2rem;" class="overflow-hidden flex flex-col grow shrink">
      <div
        id="14:53"
        style="background-color: color-mix( in oklab , #141829 80% , transparent ); flex-basis: 0%; border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
        class="overflow-hidden relative grow shrink border-[1px] border-solid rounded-2xl"
      >
        <div
          id="14:54"
          style="background-image: radial-gradient(circle, rgba(0, 240, 255, 1) 1px, transparent 1px); background-size: 20px 20px; top: 0; right: 0; bottom: 0; left: 0;"
          class="opacity-10 absolute"
        ></div>

        <div
          id="14:55"
          style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
          class="flex absolute flex-col justify-center items-center"
        >
          <div id="14:56" class="text-center flex flex-col items-center max-w-168">
            <div id="14:57" class="mb-8">
              <div
                id="14:58"
                style="background-color: color-mix( in oklab , #00F0FF 10% , transparent ); box-shadow: 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 32px rgba(0, 240, 255, 0.15); border-color: color-mix( in oklab , #00F0FF 30% , transparent );"
                class="flex justify-center items-center w-32 h-32 border-[2px] border-solid rounded-full"
              >
                <div id="14:59" class="bg-transparent flex justify-center items-center w-16 h-16">
                  <iconify-icon
                    id="14:60"
                    style="color: rgba(0, 240, 255, 1);"
                    icon="lucide:sparkles"
                    class="text-6xl"
                  ></iconify-icon>
                </div>
              </div>
            </div>

            <h2 id="14:61" style="color: rgba(232, 240, 255, 1);" class="text-4xl mb-4 font-bold">
              欢迎来到极客设计工坊
            </h2>
            <p id="14:62" style="color: rgba(138, 151, 170, 1);" class="text-lg mb-6 whitespace-nowrap">
              {creating() ? "正在初始化默认会话..." : "在这里开始你的创意之旅，轻松快速构建产品原型和设计稿"}
            </p>
            <div class="flex flex-nowrap justify-center gap-4 max-w-[1100px] overflow-x-auto geek-scroll px-2">
              <For each={examples}>
                {(item: { title: string; desc: string; prompt: string }) => (
                  <button
                    onClick={() => handleExampleClick(item.prompt)}
                    class="text-left w-64 shrink-0 px-4 py-3 rounded-xl border border-[#00F0FF]/15 bg-[#0F1624]/70 hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/50 transition-colors"
                  >
                    <div class="text-sm text-[#E8F0FF] font-semibold">{item.title}</div>
                    <div
                      class="text-xs text-[#8A97AA] mt-1"
                      style="-webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;"
                    >
                      {item.desc}
                    </div>
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
