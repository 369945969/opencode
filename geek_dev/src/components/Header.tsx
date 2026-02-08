import { type Component, createSignal, onMount, onCleanup } from "solid-js"

interface HeaderProps {
  onNavigate?: (page: string) => void
  currentView?: string
}

const Header: Component<HeaderProps> = (props) => {
  const [showDropdown, setShowDropdown] = createSignal(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown())
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  let dropdownRef: HTMLDivElement | undefined

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      setShowDropdown(false)
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside)
  })

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside)
  })

  return (
    <header
      id="14:2"
      style="background: linear-gradient(135deg, rgba(26, 11, 46, 1) 0%, rgba(22, 33, 62, 1) 100%);"
      class="w-full shrink-0"
    >
      <nav id="14:3" style="padding: 1rem 1.5rem;" class="flex justify-between items-center w-full">
        <div id="14:4" class="flex items-center gap-x-8">
          <div id="14:5" class="flex items-center gap-x-3">
            <button
              id="14:5-btn"
              onClick={(e) => {
                e.preventDefault()
                props.onNavigate?.("home")
              }}
              class="bg-transparent p-0 border-0 cursor-pointer flex items-center gap-x-3"
            >
              <div id="14:6" class="bg-transparent flex justify-center items-center w-8 h-8">
                <iconify-icon
                  id="14:7"
                  style="color: rgba(0, 240, 255, 1);"
                  icon="lucide:zap"
                  class="text-2xl"
                ></iconify-icon>
              </div>
              <span id="14:8" style="color: rgba(232, 240, 255, 1);" class="text-xl font-bold">
                Geek Dev
              </span>
            </button>
          </div>
          <div id="14:9" class="flex items-center gap-x-6">
            <a
              id="14:12"
              class="hover:text-[#00F0FF] hover:shadow-[0_0_8px_rgba(0,240,255,0.2)] flex items-center gap-x-2 rounded-lg cursor-pointer"
              style={{
                color: props.currentView === "project-list" ? "#00F0FF" : "rgba(184, 197, 217, 1)",
                padding: "0.5rem 0.75rem",
              }}
              onClick={(e) => {
                e.preventDefault()
                props.onNavigate?.("project-list")
              }}
            >
              <span id="14:13">Skills</span>
            </a>
          </div>
        </div>
        <div id="14:16" class="flex items-center gap-x-4">
          <div id="14:26" class="flex items-center gap-x-2 relative" ref={dropdownRef}>
            <button id="14:27-button" onClick={() => window.location.href = '/login'} class="bg-transparent p-0 border-0 cursor-pointer">
              <img
                id="14:27"
                style="border-color: color-mix( in oklab , #00F0FF 40% , transparent );"
                alt="User avatar with professional appearance"
                src="https://static.paraflowcontent.com/public/resource/image/c0613487-2f97-4453-8e91-a50f025afcec.jpeg"
                class="w-9 h-9 object-cover border-[2px] border-solid rounded-full"
              />
            </button>
            <button 
              onClick={toggleDropdown}
              class="bg-transparent p-0 border-0 cursor-pointer flex justify-center items-center w-6 h-6 hover:bg-[#00F0FF]/10 rounded-full transition-colors"
            >
              <iconify-icon
                id="14:29"
                style="color: rgba(0, 240, 255, 1);"
                icon="lucide:chevron-down"
                class="text-sm"
              ></iconify-icon>
            </button>
            {showDropdown() && (
              <div
                id="dropdown-menu"
                class="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg z-50 overflow-hidden"
                style="background-color: rgba(26, 31, 58, 0.95); border: 1px solid color-mix(in oklab, #00F0FF 30%, transparent); backdrop-filter: blur(10px);"
              >
                <button
                  class="w-full flex items-center gap-x-2 px-4 py-3 text-left hover:bg-[#00F0FF]/10 transition-colors border-b border-[#00F0FF]/10"
                  style="color: rgba(232, 240, 255, 1);"
                >
                  <iconify-icon
                    icon="lucide:settings"
                    class="text-base text-[#00F0FF]"
                  ></iconify-icon>
                  <span class="text-sm">设置</span>
                </button>
                <button
                  onClick={handleLogout}
                  class="w-full flex items-center gap-x-2 px-4 py-3 text-left hover:bg-[#00F0FF]/10 transition-colors"
                  style="color: rgba(232, 240, 255, 1);"
                >
                  <iconify-icon
                    id="logout-icon"
                    style="color: rgba(255, 0, 110, 1);"
                    icon="lucide:log-out"
                    class="text-base"
                  ></iconify-icon>
                  <span class="text-sm">退出登录</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
