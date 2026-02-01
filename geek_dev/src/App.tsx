import { createSignal, onCleanup, Show } from "solid-js"
import "./App.css"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Home from "./components/Home"
import ProjectList from "./components/ProjectList"
import Workspace from "./components/Workspace"
import DocDetail from "./components/DocDetail"
import StyleComparison from "./components/StyleComparison"

// @ts-ignore
declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": any
    }
  }
}

function App() {
  const [sidebarWidth, setSidebarWidth] = createSignal(window.innerWidth * 0.36)
  const [currentView, setCurrentView] = createSignal("home")
  const [selectedDoc, setSelectedDoc] = createSignal<any>(null)
  let isResizing = false

  const startResizing = () => {
    isResizing = true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", stopResizing)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = window.innerWidth - e.clientX
    // Min 250px, Max 80% screen
    if (newWidth > 250 && newWidth < window.innerWidth * 0.8) {
      setSidebarWidth(newWidth)
    }
  }

  const stopResizing = () => {
    isResizing = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", stopResizing)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }

  onCleanup(() => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", stopResizing)
  })

  return (
    <div
      class="font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] pf-BODY-main w-full h-screen flex flex-col"
      style="line-height: 1.5;"
    >
      <Header onNavigate={setCurrentView} currentView={currentView()} />
      <div
        id="14:30"
        style="background: linear-gradient(135deg, rgba(10, 14, 26, 1) 0%, rgba(26, 19, 50, 1) 50%, rgba(13, 27, 42, 1) 100%), radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.101961) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 0, 110, 0.101961) 0%, transparent 50%);"
        class="flex w-full grow overflow-hidden"
      >
        <Show when={currentView() === "home"}>
          <Home onNavigate={(page) => setCurrentView(page)} />
        </Show>

        <Show when={currentView() === "project-list"}>
          <ProjectList onNavigate={(page) => setCurrentView(page)} />
        </Show>

        <Show when={currentView() === "workspace"}>
          <Workspace
            onOpenFile={(doc: any) => {
              if (doc.type === "style-comparison") {
                setCurrentView("style-comparison")
              } else {
                setSelectedDoc(doc)
                setCurrentView("doc-detail")
              }
            }}
          />
        </Show>

        <Show when={currentView() === "doc-detail"}>
          <DocDetail doc={selectedDoc()} onBack={() => setCurrentView("workspace")} />
        </Show>

        <Show when={currentView() === "style-comparison"}>
          <StyleComparison onBack={() => setCurrentView("workspace")} />
        </Show>

        <Show when={currentView() !== "project-list"}>
          <div
            class="w-1 hover:bg-[#00F0FF] cursor-col-resize transition-colors duration-150 flex-shrink-0"
            style="background-color: rgba(0, 240, 255, 0.05);"
            onMouseDown={startResizing}
          />

          <Sidebar width={sidebarWidth()} />
        </Show>
      </div>
    </div>
  )
}

export default App
