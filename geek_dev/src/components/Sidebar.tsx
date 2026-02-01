import type { Component } from "solid-js"
import { createSignal, onMount, onCleanup } from "solid-js"

interface SidebarProps {
  width: number
}

const Sidebar: Component<SidebarProps> = (props) => {
  const [inputHeight, setInputHeight] = createSignal(120)
  const [isDragging, setIsDragging] = createSignal(false)
  let resizerRef: HTMLDivElement | undefined
  let startY = 0
  let startHeight = 0

  const startDrag = (e: MouseEvent) => {
    setIsDragging(true)
    startY = e.clientY
    startHeight = inputHeight()
    document.body.style.cursor = "row-resize"
    document.body.style.userSelect = "none"
  }

  const doDrag = (e: MouseEvent) => {
    if (!isDragging()) return
    const deltaY = startY - e.clientY
    const newHeight = Math.max(80, Math.min(400, startHeight + deltaY))
    setInputHeight(newHeight)
  }

  const stopDrag = () => {
    setIsDragging(false)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }

  onMount(() => {
    document.addEventListener("mousemove", doDrag)
    document.addEventListener("mouseup", stopDrag)
  })

  onCleanup(() => {
    document.removeEventListener("mousemove", doDrag)
    document.removeEventListener("mouseup", stopDrag)
  })

  return (
    <aside
      id="12:88"
      style="background: linear-gradient(135deg, rgba(22, 33, 62, 1) 0%, rgba(15, 22, 36, 1) 100%);"
      class="shrink-0 min-w-fit"
    >
      <div id="12:89" class="flex flex-col h-full" style={`width: ${props.width}px`}>
        <div
          id="12:90"
          style="border-bottom-style: solid; padding: 1rem 1.5rem; border-color: color-mix( in oklab , #00F0FF 15% , transparent );"
          class="flex justify-between items-center border-b-[1px] shrink-0"
        >
          <div id="12:91" class="flex items-center gap-x-3">
            <div id="12:92" class="bg-transparent flex justify-center items-center w-6 h-6">
              <iconify-icon
                id="12:93"
                style="color: rgba(0, 240, 255, 1);"
                icon="lucide:brain-circuit"
                class="text-xl"
              ></iconify-icon>
            </div>
            <h2 id="12:94" style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold">
              极客开发区
            </h2>
          </div>
          <div
            id="12:95"
            style="background-color: rgba(0, 255, 159, 1); box-shadow: 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 8px rgba(0, 255, 159, 0.5);"
            class="w-3 h-3 rounded-full"
          ></div>
        </div>

        <div id="12:96" class="overflow-y-auto grow shrink" style="padding: 1rem 1.5rem;">
          <div id="12:97" style="margin-top: 0;" class="flex gap-x-3 mb-4">
            <div
              id="12:98"
              style="background-color: color-mix( in oklab , #00F0FF 20% , transparent ); border-color: color-mix( in oklab , #00F0FF 40% , transparent );"
              class="flex shrink-0 justify-center items-center w-8 h-8 border-[1px] border-solid rounded-full"
            >
              <div id="12:99" class="bg-transparent flex justify-center items-center w-4 h-4">
                <iconify-icon
                  id="12:100"
                  style="color: rgba(0, 240, 255, 1);"
                  icon="lucide:brain-circuit"
                  class="text-sm"
                ></iconify-icon>
              </div>
            </div>
            <div id="12:101" style="flex-basis: 0%;" class="grow shrink">
              <div
                id="12:102"
                style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent ); border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                class="p-4 border-[1px] border-solid rounded-2xl"
              >
                <p id="12:103" style="color: rgba(232, 240, 255, 1);" class="text-sm">
                  你好！我是你的AI设计助手。我可以帮你创建文档、生成界面设计稿，或者分析你的设计需求。你想要我帮你做什么？
                </p>
              </div>
              <span id="12:104" style="color: rgba(92, 104, 118, 1);" class="text-xs block mt-1 ml-4">
                刚刚
              </span>
            </div>
          </div>

          <div id="12:105" style="margin-top: 0;" class="flex justify-end gap-x-3 mb-4">
            <div id="12:106" style="flex-basis: 0%; max-width: 80%;" class="grow shrink">
              <div
                id="12:107"
                style="background-color: color-mix( in oklab , #00F0FF 15% , transparent ); margin-left: auto; border-color: color-mix( in oklab , #00F0FF 30% , transparent );"
                class="p-4 border-[1px] border-solid rounded-2xl"
              >
                <p id="12:108" style="color: rgba(232, 240, 255, 1);" class="text-sm">
                  帮我设计一个用户注册页面，风格要和现在的界面保持一致
                </p>
              </div>
              <span id="12:109" style="color: rgba(92, 104, 118, 1);" class="text-xs text-right block mt-1 mr-4">
                2分钟前
              </span>
            </div>
            <div
              id="12:110"
              style="background-color: color-mix( in oklab , #00F0FF 10% , transparent );"
              class="flex shrink-0 justify-center items-center w-8 h-8 rounded-full"
            >
              <img
                id="12:111"
                alt="User profile picture with friendly expression"
                src="https://static.paraflowcontent.com/public/resource/image/c0613487-2f97-4453-8e91-a50f025afcec.jpeg"
                class="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div id="12:112" class="flex gap-x-3">
            <div
              id="12:113"
              style="background-color: color-mix( in oklab , #00F0FF 20% , transparent ); border-color: color-mix( in oklab , #00F0FF 40% , transparent );"
              class="flex shrink-0 justify-center items-center w-8 h-8 border-[1px] border-solid rounded-full"
            >
              <div id="12:114" class="bg-transparent flex justify-center items-center w-4 h-4">
                <iconify-icon
                  id="12:115"
                  style="color: rgba(0, 240, 255, 1);"
                  icon="lucide:brain-circuit"
                  class="text-sm"
                ></iconify-icon>
              </div>
            </div>
            <div id="12:116" style="flex-basis: 0%;" class="grow shrink">
              <div
                id="12:117"
                style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent ); border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                class="p-4 border-[1px] border-solid rounded-2xl"
              >
                <p id="12:118" style="color: rgba(232, 240, 255, 1);" class="text-sm mb-3">
                  好的！我为你设计了一个注册页面，保持了赛博朋克风格。页面包含了用户名、邮箱、密码输入框和注册按钮。
                </p>
                <div id="12:119" class="flex gap-x-2">
                  <button
                    id="12:120"
                    class="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] text-xs flex items-center rounded-lg"
                    style="background-color: rgba(0, 240, 255, 1); color: rgba(10, 14, 26, 1); padding: 0.5rem 0.75rem;"
                  >
                    <span id="12:121" class="whitespace-nowrap font-semibold">
                      添加到画布
                    </span>
                  </button>
                  <button
                    id="12:122"
                    class="hover:bg-[#00F0FF]/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] text-xs bg-transparent flex items-center border-[1px] border-solid rounded-lg"
                    style="color: rgba(0, 240, 255, 1); padding: 0.5rem 0.75rem; border-color: color-mix( in oklab , #00F0FF 60% , transparent );"
                  >
                    <span id="12:123" class="whitespace-nowrap">
                      预览
                    </span>
                  </button>
                </div>
              </div>
              <span id="12:124" style="color: rgba(92, 104, 118, 1);" class="text-xs block mt-1 ml-4">
                1分钟前
              </span>
            </div>
          </div>
        </div>

        <div
          ref={resizerRef}
          onMouseDown={startDrag}
          class="h-1 cursor-row-resize hover:bg-[#00F0FF]/50 transition-colors shrink-0 mx-4 mt-4"
          style="background-color: color-mix( in oklab , #00F0FF 15% , transparent );"
        ></div>

        <div id="12:125" class="shrink-0 mx-4 mb-4 mt-4" style={`height: ${inputHeight()}px;`}>
          <div
            id="12:126"
            class="h-full flex flex-col hover:border-[#00F0FF]/50 border-[1px] border-solid rounded-2xl"
            style="background-color: color-mix( in oklab , #1A1F3A 80% , transparent ); border-color: color-mix( in oklab , #00F0FF 30% , transparent ); padding: 1rem 1.5rem;"
          >
            <textarea
              id="12:127"
              style="color: rgba(232, 240, 255, 1); resize: none;"
              placeholder="向AI助手描述你的需求..."
              class="flex-grow w-full bg-transparent outline-none text-sm"
            ></textarea>
            <div class="flex justify-between items-center mt-3">
              <span class="text-xs" style="color: rgba(92, 104, 118, 1);">
                按 Enter 发送，Shift + Enter 换行
              </span>
              <button
                id="12:128"
                class="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center w-8 h-8 rounded-lg"
                style="background-color: rgba(0, 240, 255, 1);"
              >
                <div id="12:129" class="bg-transparent flex justify-center items-center w-4 h-4">
                  <iconify-icon
                    id="12:130"
                    style="color: rgba(10, 14, 26, 1);"
                    icon="lucide:send"
                    class="text-sm"
                  ></iconify-icon>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
