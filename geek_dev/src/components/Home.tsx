import type { Component } from "solid-js"

interface HomeProps {
  onNavigate: (page: string) => void
}

const Home: Component<HomeProps> = (props) => {
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
              欢迎来到Geek Dev工作区
            </h2>
            <p id="14:62" style="color: rgba(138, 151, 170, 1);" class="text-lg mb-8 whitespace-nowrap">
              在这里开始你的创意之旅，AI助手将帮助你快速构建产品原型和设计稿
            </p>

            <div id="14:63" class="flex items-center gap-x-6">
              <button
                id="14:64"
                class="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center rounded-lg cursor-pointer"
                style="background-color: rgba(0, 240, 255, 1); color: rgba(10, 14, 26, 1); padding: 0.75rem 1.5rem;"
                onClick={() => props.onNavigate("workspace")}
              >
                <div id="14:65" class="bg-transparent flex justify-center items-center w-5 h-5 mr-2">
                  <iconify-icon
                    id="14:66"
                    style="color: rgba(10, 14, 26, 1);"
                    icon="lucide:plus"
                    class="text-base"
                  ></iconify-icon>
                </div>
                <span id="14:67" class="whitespace-nowrap font-semibold">
                  开始创建
                </span>
              </button>

              <button
                class="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center rounded-lg cursor-pointer border border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 transition-all"
                style="color: rgba(232, 240, 255, 1); padding: 0.75rem 1.5rem;"
                onClick={() => props.onNavigate("project-list")}
              >
                <div class="bg-transparent flex justify-center items-center w-5 h-5 mr-2">
                  <iconify-icon
                    style="color: rgba(232, 240, 255, 1);"
                    icon="lucide:layout-grid"
                    class="text-base"
                  ></iconify-icon>
                </div>
                <span class="whitespace-nowrap font-semibold">Skills</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
