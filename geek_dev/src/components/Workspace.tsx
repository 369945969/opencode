import { type Component, createSignal, onMount, onCleanup, Show, For } from "solid-js"

// Mock Data for Product Requirements Document
const mockDocs = [
  {
    id: "1",
    title: "Product Charter — CodeFlow AI",
    filename: "product_charter.md",
    lastModified: "10 mins ago",
    content: `# Product Charter — CodeFlow AI\n\n## 1) Product Positioning\nCodeFlow AI is an integrated development environment (IDE) built for the AI-native era. It seamlessly combines code editing, real-time collaboration, and intelligent assistance into a single, cohesive platform.\n\n## 2) Brand Keywords\n- **Intelligent**: Leveraging state-of-the-art LLMs to understand code context.\n- **Collaborative**: Real-time multiplayer editing and debugging.\n- **Efficient**: Streamlined workflows to reduce context switching.\n\n## 3) Core Problem / JTBD\nDevelopers spend too much time configuring tools and switching between context (IDE, chat, docs). CodeFlow AI unifies these into one workspace.\n\n## 4) Goals & Mission\n- **Mission**: To empower every developer to build software faster and with more confidence.\n- **Vision**: A world where coding is as fluid as thought.`,
  },
  {
    id: "2",
    title: 'Professional Developer "Efficiency Seeker"',
    filename: "persona_developer.md",
    lastModified: "2 hours ago",
    content: `# Professional Developer "Efficiency Seeker"\n\n**Name**: Amara\n**Age**: 28\n**Role**: Senior Frontend Engineer\n\n## Bio\nAmara works at a fast-paced SaaS startup. She values speed and precision. She hates repetitive tasks and slow tooling.\n\n## Goals\n- Ship features quickly without bugs.\n- Maintain a clean codebase.\n- Automate boring parts of development.\n\n## Pain Points\n- Context switching between JIRA, GitHub, and VS Code.\n- Waiting for CI/CD pipelines.\n- outdated documentation.`,
  },
  {
    id: "3",
    title: 'Learning Developer "Exploration Tester"',
    filename: "persona_learner.md",
    lastModified: "1 day ago",
    content: `# Learning Developer "Exploration Tester"\n\n**Name**: Diego\n**Age**: 22\n**Role**: Junior Developer / Student\n\n## Bio\nDiego is just starting his career. He is eager to learn but often gets stuck on configuration and complex patterns.\n\n## Goals\n- Learn best practices.\n- Understand the codebase quickly.\n- Get help when stuck.\n\n## Pain Points\n- Overwhelmed by complex toolchains.\n- Fear of breaking things.\n- Lack of immediate feedback.`,
  },
  {
    id: "4",
    title: "Product Charter — DataFlow AI",
    filename: "data_agency.md",
    lastModified: "2 days ago",
    content: `# Product Charter — DataFlow AI\n\n## Overview\nDataFlow AI is a sub-module focusing on data processing pipelines.\n\n## Key Features\n- Visual pipeline builder.\n- Real-time data monitoring.\n- Automated anomaly detection.`,
  },
  {
    id: "5",
    title: 'Business Analyst "Data Observer"',
    filename: "persona_analyst.md",
    lastModified: "3 days ago",
    content: `# Business Analyst "Data Observer"\n\n**Name**: Sarah\n**Role**: Product Analyst\n\n## Goals\n- Understand user behavior through data.\n- Create actionable reports.\n\n## Needs\n- Easy access to production data (sanitized).\n- Visualization tools.`,
  },
  {
    id: "6",
    title: 'Operations Manager "Decision Driver"',
    filename: "persona_manager.md",
    lastModified: "1 week ago",
    content: `# Operations Manager "Decision Driver"\n\n**Name**: Marcus\n**Role**: VP of Engineering\n\n## Goals\n- Ensure team velocity and health.\n- Make strategic technology decisions.\n\n## Needs\n- High-level overview of project status.\n- Resource allocation metrics.`,
  },
]

// Mock Data for Interface Design (HTML)
const mockDesignFiles = [
  {
    id: "d1",
    title: "Login Page",
    filename: "login.html",
    type: "html",
    lastModified: "1 hour ago",
    thumbnail: "https://static.paraflowcontent.com/public/resource/image/7641c341-bc09-4527-a6a4-1075f23ad867.jpeg",
    content: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 2rem; rounded: 1rem; border: 1px solid #334155; width: 300px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        h2 { text-align: center; margin-top: 0; color: #e2e8f0; }
        input { width: 100%; padding: 0.75rem; margin: 0.5rem 0; background: #0f172a; border: 1px solid #334155; color: white; border-radius: 0.5rem; box-sizing: border-box; }
        input:focus { outline: none; border-color: #3b82f6; }
        button { width: 100%; padding: 0.75rem; margin-top: 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold; transition: background 0.2s; }
        button:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Welcome Back</h2>
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />
        <button>Sign In</button>
    </div>
</body>
</html>`,
  },
  {
    id: "d2",
    title: "Dashboard Layout",
    filename: "dashboard.html",
    type: "html",
    lastModified: "3 hours ago",
    thumbnail: "https://static.paraflowcontent.com/public/resource/image/8f64b451-6891-4d35-bce3-60d02eccab0e.jpeg",
    content: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; margin: 0; display: grid; grid-template-columns: 240px 1fr; height: 100vh; }
        aside { background: #1e293b; border-right: 1px solid #334155; padding: 1.5rem; }
        h3 { color: #3b82f6; margin-top: 0; font-size: 1.5rem; margin-bottom: 2rem; }
        ul { list-style: none; padding: 0; }
        li { padding: 0.75rem 1rem; color: #94a3b8; cursor: pointer; border-radius: 0.5rem; margin-bottom: 0.5rem; transition: all 0.2s; }
        li:hover, li.active { background: #334155; color: white; }
        main { padding: 2rem; overflow-y: auto; }
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .btn { background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
        .stat-card { background: #1e293b; padding: 1.5rem; border-radius: 1rem; border: 1px solid #334155; }
        .stat-val { font-size: 2rem; font-weight: bold; margin: 0.5rem 0; }
        .stat-label { color: #94a3b8; font-size: 0.875rem; }
    </style>
</head>
<body>
    <aside>
        <h3>CodeFlow</h3>
        <ul>
            <li class="active">Dashboard</li>
            <li>Projects</li>
            <li>Team</li>
            <li>Settings</li>
        </ul>
    </aside>
    <main>
        <header>
            <h1>Overview</h1>
            <button class="btn">+ New Project</button>
        </header>
        <div class="grid">
            <div class="stat-card">
                <div class="stat-label">Total Projects</div>
                <div class="stat-val">12</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Active Users</div>
                <div class="stat-val">1,234</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Revenue</div>
                <div class="stat-val">$45.2k</div>
            </div>
        </div>
    </main>
</body>
</html>`,
  },
]

const mockWireframeFiles = [
  {
    id: "w1",
    title: "用户故事｜注册与登录",
    filename: "US_01_用户注册.md",
    type: "markdown",
    lastModified: "5 hours ago",
    content: `# 用户故事：注册与登录

## 背景
面向汽车维修店技师/店主，首次使用平台需要快速完成注册与登录。

## 用户故事
- 作为维修店技师，我希望能用手机号快速注册，以便快速查看可用车型钥匙。
- 作为店主，我希望登录后能看到最近下单记录，以便复购。

## 价值与收益
- 降低首次使用门槛
- 提升新用户转化率

## 验收标准
1. 支持手机号/邮箱注册与登录
2. 注册后自动进入首页
3. 登录失败提示明确原因`,
  },
  {
    id: "w2",
    title: "用户故事｜下单与支付",
    filename: "US_02_下单与支付.md",
    type: "markdown",
    lastModified: "1 day ago",
    content: `# 用户故事：下单与支付

## 用户故事
- 作为技师，我希望一键加入购物车并快速结算，以节省采购时间。
- 作为采购人员，我希望支持多种支付方式，以适配公司流程。

## 价值与收益
- 提升下单效率
- 降低支付流失

## 验收标准
1. 支持购物车批量下单
2. 支付成功后生成订单与通知
3. 支持失败重试与状态恢复`,
  },
  {
    id: "w3",
    title: "用户故事｜订单查询",
    filename: "US_03_订单查询.md",
    type: "markdown",
    lastModified: "2 days ago",
    content: `# 用户故事：订单查询

## 用户故事
- 作为店主，我希望能查询历史订单，以便对账与复购。
- 作为技师，我希望查看订单物流状态，以便安排工单。

## 价值与收益
- 提升复购率
- 降低售后沟通成本

## 验收标准
1. 订单支持按时间/状态筛选
2. 订单详情包含物流与发票信息
3. 支持导出订单记录`,
  },
]

interface WorkspaceProps {
  onOpenFile?: (doc: any) => void
  title?: string
}

const Workspace: Component<WorkspaceProps> = (props) => {
  const [scale, setScale] = createSignal(1)
  const [position, setPosition] = createSignal({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = createSignal(false)
  const [dragStart, setDragStart] = createSignal({ x: 0, y: 0 })
  const [activeTool, setActiveTool] = createSignal<"select" | "hand">("select")
  const [isFullScreen, setIsFullScreen] = createSignal(false)

  // New State for Folder/File View
  const [currentView, setCurrentView] = createSignal<"canvas" | "folder" | "file">("canvas")
  const [activeFolder, setActiveFolder] = createSignal<string | null>("界面设计")
  const [activeFile, setActiveFile] = createSignal<any | null>(null)

  // Helper to format HTML
  const formatHtml = (html: string) => {
    let formatted = ''
    const pad = '  '
    let indent = 0
    
    const tokens = html.split(/(<[^>]+>)/g).filter(s => s.trim().length > 0)
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
    
    tokens.forEach(token => {
      let change = 0
      const isTag = token.startsWith('<')
      const isClosing = token.startsWith('</')
      const isSelfClosing = token.endsWith('/>') || token.startsWith('<!')
      
      if (isTag) {
        if (isClosing) {
          indent = Math.max(0, indent - 1)
        } else if (!isSelfClosing) {
          const tagName = token.match(/^<([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase()
          if (tagName && !voidTags.has(tagName)) {
            change = 1
          }
        }
      }
      
      formatted += pad.repeat(indent) + token.trim() + '\n'
      indent += change
    })
    
    return formatted.trim()
  }
  const parseMarkdown = (text: string): string => {
    if (!text) return ""
    let html = text

    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold mb-3 mt-6" style="color: rgba(232, 240, 255, 1);">$1</h3>',
    )
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold mb-4 mt-8 pb-2 border-b" style="color: rgba(232, 240, 255, 1); border-color: color-mix(in oklab, #00F0FF 30%, transparent);">$1</h2>',
    )
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-bold mb-4" style="color: rgba(232, 240, 255, 1);">$1</h1>',
    )

    html = html.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    html = html.replace(/\*(.*)\*/gim, "<em>$1</em>")
    html = html.replace(
      /`(.*)`/gim,
      '<code class="px-2 py-1 rounded" style="background-color: color-mix(in oklab, #00F0FF 10%, transparent); color: rgba(0, 240, 255, 1); font-family: monospace;">$1</code>',
    )

    html = html.replace(
      /^- (.*$)/gim,
      '<li class="ml-4 list-none flex items-start mb-2" style="color: rgba(184, 197, 217, 1);"><span class="w-2 h-2 mt-2 mr-3 rounded-full shrink-0" style="background-color: rgba(0, 240, 255, 1);"></span>$1</li>',
    )
    html = html.replace(
      /^\d+\. (.*$)/gim,
      '<li class="ml-4 list-decimal mb-2" style="color: rgba(184, 197, 217, 1);">$1</li>',
    )

    html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed" style="color: rgba(184, 197, 217, 1);">')
    html = html.replace(/\n/g, "<br>")

    return `<p class="mb-4 leading-relaxed" style="color: rgba(184, 197, 217, 1);">${html}</p>`
  }

  // Preview Modal State
  const [previewFile, setPreviewFile] = createSignal<any | null>(null)
  const [selectedHtml, setSelectedHtml] = createSignal<string | null>(null)

  onMount(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ELEMENT_SELECTED') {
        setSelectedHtml(formatHtml(event.data.html))
      }
    }
    window.addEventListener('message', handleMessage)
    onCleanup(() => window.removeEventListener('message', handleMessage))
  })

  const getMermaidHtml = (content: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            background-color: #141829;
            color: #E8F0FF;
            font-family: sans-serif;
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          .mermaid {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          /* Cyberpunk overrides for Mermaid */
          :root {
            --mermaid-font-family: 'Courier New', monospace;
          }
          /* Custom Glow Effects via SVG Filters if possible, or just CSS */
          svg {
            filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.3));
          }
          .node rect, .node circle, .node polygon, .node path {
            fill: #1A1F3A !important;
            stroke: #00F0FF !important;
            stroke-width: 2px !important;
          }
          .node .label {
            color: #E8F0FF !important;
            font-weight: bold;
          }
          .edgePath .path {
            stroke: #B026FF !important;
            stroke-width: 2px !important;
          }
          .arrowheadPath {
            fill: #B026FF !important;
          }
          .cluster rect {
            fill: rgba(0, 240, 255, 0.05) !important;
            stroke: rgba(0, 240, 255, 0.2) !important;
          }
        </style>
      </head>
      <body>
        <div class="mermaid">
          ${content}
        </div>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
          mermaid.initialize({ 
            startOnLoad: true, 
            theme: 'base',
            themeVariables: {
              background: '#141829',
              primaryColor: '#1A1F3A',
              secondaryColor: '#141829',
              tertiaryColor: '#141829',
              primaryTextColor: '#E8F0FF',
              secondaryTextColor: '#E8F0FF',
              tertiaryTextColor: '#E8F0FF',
              lineColor: '#B026FF',
              fontFamily: 'monospace'
            }
          });
        </script>
      </body>
      </html>
    `
  }

  // Inject Inspector Script
  const getPreviewContent = (html: string) => {
    const script = `
      <script>
        document.body.dataset.inspectMode = 'true';
        let hoveredElement = null;
        let originalOutline = '';
        let originalCursor = '';

        window.addEventListener('message', (event) => {
          if (event.data.type === 'TOGGLE_INSPECT') {
            document.body.dataset.inspectMode = event.data.active;
            if (!event.data.active && hoveredElement) {
               hoveredElement.style.outline = originalOutline;
               hoveredElement.style.cursor = originalCursor;
               hoveredElement = null;
            }
          }
        });

        document.addEventListener('mouseover', (e) => {
          if (document.body.dataset.inspectMode !== 'true') return;
          e.stopPropagation();
          
          if (hoveredElement && hoveredElement !== e.target) {
             hoveredElement.style.outline = originalOutline;
             hoveredElement.style.cursor = originalCursor;
          }
          
          hoveredElement = e.target;
          originalOutline = hoveredElement.style.outline;
          originalCursor = hoveredElement.style.cursor;
          
          hoveredElement.style.outline = '2px solid #00F0FF';
          hoveredElement.style.cursor = 'default';
        });

        document.addEventListener('mouseout', (e) => {
           if (document.body.dataset.inspectMode !== 'true') return;
           // Don't clear immediately on mouseout to avoid flickering, 
           // let mouseover of next element handle it or body mouseout
        });

        document.addEventListener('click', (e) => {
          if (document.body.dataset.inspectMode !== 'true') return;
          e.preventDefault();
          e.stopPropagation();
          window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            html: e.target.outerHTML
          }, '*');
        });
      </script>
    `
    return html.replace("</body>", `${script}</body>`)
  }

  let canvasRef: HTMLDivElement | undefined

  const handleMouseDown = (e: MouseEvent) => {
    if (activeTool() === "hand") {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position().x, y: e.clientY - position().y })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging()) {
      setPosition({
        x: e.clientX - dragStart().x,
        y: e.clientY - dragStart().y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.1, 3))
  const zoomOut = () => setScale((s) => Math.max(s - 0.1, 0.1))

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      canvasRef?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const updateFullScreenState = () => {
    setIsFullScreen(!!document.fullscreenElement)
  }

  onMount(() => {
    document.addEventListener("fullscreenchange", updateFullScreenState)
  })

  onCleanup(() => {
    document.removeEventListener("fullscreenchange", updateFullScreenState)
  })

  // Folder/File Handlers
  const openFolder = (folderId: string) => {
    if (activeTool() === "select") {
      setActiveFolder(folderId)
      setCurrentView("folder")
    }
  }

  const openFile = (file: any) => {
    console.log("Opening file:", file.filename)
    setActiveFile(file)
    setCurrentView("file")
    props.onOpenFile?.(file)
  }

  const backToCanvas = () => {
    setCurrentView("canvas")
    setActiveFolder(null)
  }

  const backToFolder = () => {
    setCurrentView("folder")
    setActiveFile(null)
  }
  
  const isDesignView = () => currentView() === "folder" && activeFolder() === "design"
  const isCanvasOrDesign = () => currentView() === "canvas" || isDesignView()

  return (
    <main
      id="12:31"
      style="flex-basis: 0%; padding: 1.5rem 2rem;"
      class="overflow-x-hidden overflow-y-hidden flex flex-col grow shrink relative"
    >
      <div id="12:32" class="flex justify-between items-center mb-6 h-10 relative">
        <div class="flex items-center gap-x-4">
          <Show when={currentView() !== "canvas"}>
            <button
              onClick={currentView() === "folder" ? backToCanvas : backToFolder}
              class="hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] flex justify-center items-center w-10 h-10 rounded-lg text-[#00F0FF]"
              style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent );"
            >
              <iconify-icon icon="lucide:arrow-left" class="text-xl"></iconify-icon>
            </button>
            <Show when={currentView() === "folder" && activeFolder() === "wireframe"}>
              <h1 style="color: rgba(232, 240, 255, 1);" class="text-2xl font-bold ml-2">
                用户故事
              </h1>
            </Show>
          </Show>
          <Show when={isCanvasOrDesign()}>
            <button
              id="12:39"
              onClick={() => setActiveTool((t) => (t === "select" ? "hand" : "select"))}
              class={`hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] flex justify-center items-center w-10 h-10 rounded-lg ${activeTool() === "hand" ? "bg-[#00F0FF]/20 shadow-[0_0_12px_rgba(0,240,255,0.25)]" : ""}`}
              style={{
                "background-color":
                  activeTool() === "hand" ? undefined : "color-mix( in oklab , #1A1F3A 90% , transparent )",
              }}
            >
              <div id="12:40" class="bg-transparent flex justify-center items-center w-5 h-5">
                <iconify-icon
                  id="12:41"
                  style="color: rgba(0, 240, 255, 1);"
                  icon={activeTool() === "select" ? "lucide:mouse-pointer" : "lucide:hand"}
                  class="text-base"
                ></iconify-icon>
              </div>
            </button>
            <button
              id="12:fullscreen"
              onClick={toggleFullScreen}
              class="hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] flex justify-center items-center w-10 h-10 rounded-lg"
              style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent );"
            >
              <div class="bg-transparent flex justify-center items-center w-5 h-5">
                <iconify-icon
                  style="color: rgba(0, 240, 255, 1);"
                  icon={isFullScreen() ? "lucide:minimize" : "lucide:maximize"}
                  class="text-base"
                ></iconify-icon>
              </div>
            </button>
          </Show>
        </div>
        
        <div class="flex items-center gap-x-2">
          <Show when={isCanvasOrDesign()}>
            <span id="12:46" style="color: rgba(138, 151, 170, 1);" class="text-sm">
              {Math.round(scale() * 100)}%
            </span>
            <button
              id="12:47"
              onClick={zoomIn}
              class="hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] flex justify-center items-center w-10 h-10 rounded-lg"
              style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent );"
            >
              <div id="12:48" class="bg-transparent flex justify-center items-center w-5 h-5">
                <iconify-icon
                  id="12:49"
                  style="color: rgba(0, 240, 255, 1);"
                  icon="lucide:zoom-in"
                  class="text-base"
                ></iconify-icon>
              </div>
            </button>
            <button
              id="12:50"
              onClick={zoomOut}
              class="hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] flex justify-center items-center w-10 h-10 rounded-lg"
              style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent );"
            >
              <div id="12:51" class="bg-transparent flex justify-center items-center w-5 h-5">
                <iconify-icon
                  id="12:52"
                  style="color: rgba(0, 240, 255, 1);"
                  icon="lucide:zoom-out"
                  class="text-base"
                ></iconify-icon>
              </div>
            </button>
          </Show>
        </div>
      </div>

      <div
        id="12:53"
        ref={canvasRef}
        style={{
          "background-color": "color-mix( in oklab , #141829 80% , transparent )",
          "border-color": "color-mix( in oklab , #00F0FF 10% , transparent )",
          cursor:
            isCanvasOrDesign()
              ? activeTool() === "hand"
                ? isDragging()
                  ? "grabbing"
                  : "grab"
                : "default"
              : "default",
        }}
        class="overflow-hidden relative grow shrink border-[1px] border-solid rounded-2xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Show when={isCanvasOrDesign()}>
          <div
            style={{
              transform: `translate(${position().x}px, ${position().y}px) scale(${scale()})`,
              "transform-origin": "center center",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Show when={currentView() === "canvas"}>
              <div id="12:54" style="top: 0; right: 0; bottom: 0; left: 0;" class="absolute p-12 overflow-auto flex">
                {/* Folder Grid Container */}
                <div class="grid grid-cols-2 gap-8 w-fit relative z-50 m-auto">
                  <div class="flex flex-col gap-8">
                    {/* Product Requirements Doc - Folder */}
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        // Open the first doc in the folder directly, switching to DocDetail view
                        if (mockDocs.length > 0) {
                          props.onOpenFile?.(mockDocs[0])
                        }
                      }}
                      class="hover:shadow-[0_8px_32px_rgba(0,240,255,0.25)] hover:scale-[1.02] transition-all cursor-pointer flex gap-x-4 w-80 p-5 border-[1px] border-solid rounded-2xl"
                      style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent ); box-shadow: 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 4px 20px rgba(0, 240, 255, 0.08); border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                    >
                      <div class="shrink-0">
                        <div
                          style="background-color: color-mix( in oklab , #00F0FF 10% , transparent ); border-color: color-mix( in oklab , #00F0FF 20% , transparent );"
                          class="flex justify-center items-center w-16 h-20 border-[1px] border-solid rounded-lg"
                        >
                          <div class="bg-transparent flex justify-center items-center w-8 h-8">
                            <iconify-icon
                              style="color: rgba(0, 240, 255, 1);"
                              icon="lucide:folder-open"
                              class="text-2xl"
                            ></iconify-icon>
                          </div>
                        </div>
                      </div>
                      <div style="flex-basis: 0%;" class="flex flex-col grow shrink gap-y-2">
                        <h3 style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold">
                          产品需求文档
                        </h3>
                        <p style="color: rgba(138, 151, 170, 1);" class="text-sm font-normal">
                          全局背景与规格
                        </p>
                        <div class="flex items-center gap-x-2 mt-2">
                          <div
                            style="background-color: color-mix( in oklab , #00F0FF 15% , transparent ); color: rgba(0, 240, 255, 1); padding: 0.25rem 0.5rem;"
                            class="text-xs rounded-lg"
                          >
                            文档
                          </div>
                          <span style="color: rgba(92, 104, 118, 1);" class="text-xs">
                            6 个文件
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Style Selection - Folder */}
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        props.onOpenFile?.({ type: 'style-comparison' })
                      }}
                      class="hover:shadow-[0_8px_32px_rgba(0,240,255,0.25)] hover:scale-[1.02] transition-all cursor-pointer flex gap-x-4 w-80 p-5 border-[1px] border-solid rounded-2xl"
                      style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent ); box-shadow: 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 4px 20px rgba(0, 240, 255, 0.08); border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                    >
                      <div class="shrink-0">
                        <div
                          style="background-color: color-mix( in oklab , #B026FF 10% , transparent ); border-color: color-mix( in oklab , #B026FF 20% , transparent );"
                          class="flex justify-center items-center w-16 h-20 border-[1px] border-solid rounded-lg"
                        >
                          <div class="bg-transparent flex justify-center items-center w-8 h-8">
                            <iconify-icon
                              style="color: rgba(176, 38, 255, 1);"
                              icon="lucide:palette"
                              class="text-2xl"
                            ></iconify-icon>
                          </div>
                        </div>
                      </div>
                      <div style="flex-basis: 0%;" class="flex flex-col grow shrink gap-y-2">
                        <h3 style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold">
                          风格选择
                        </h3>
                        <p style="color: rgba(138, 151, 170, 1);" class="text-sm font-normal">
                          UI 组件与配色方案
                        </p>
                        <div class="flex items-center gap-x-2 mt-2">
                          <div
                            style="background-color: color-mix( in oklab , #B026FF 20% , transparent ); color: rgba(176, 38, 255, 1); padding: 0.25rem 0.5rem;"
                            class="text-xs rounded-lg"
                          >
                            风格
                          </div>
                          <span style="color: rgba(92, 104, 118, 1);" class="text-xs">
                            Cyberpunk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wireframe - Folder */}
                    <div
                      onClick={() => openFolder("wireframe")}
                      class="hover:shadow-[0_8px_32px_rgba(0,240,255,0.25)] hover:scale-[1.02] transition-all cursor-pointer flex gap-x-4 w-80 p-5 border-[1px] border-solid rounded-2xl"
                      style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent ); box-shadow: 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 4px 20px rgba(0, 240, 255, 0.08); border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                    >
                      <div class="shrink-0">
                        <div
                          style="background-color: color-mix( in oklab , #FF006E 10% , transparent ); border-color: color-mix( in oklab , #FF006E 20% , transparent );"
                          class="flex justify-center items-center w-16 h-20 border-[1px] border-solid rounded-lg"
                        >
                          <div class="bg-transparent flex justify-center items-center w-8 h-8">
                            <iconify-icon
                              style="color: rgba(255, 0, 110, 1);"
                              icon="lucide:workflow"
                              class="text-2xl"
                            ></iconify-icon>
                          </div>
                        </div>
                      </div>
                      <div style="flex-basis: 0%;" class="flex flex-col grow shrink gap-y-2">
                        <h3 style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold">
                          用户故事
                        </h3>
                        <p style="color: rgba(138, 151, 170, 1);" class="text-sm font-normal">
                          场景与价值描述
                        </p>
                        <div class="flex items-center gap-x-2 mt-2">
                          <div
                            style="background-color: color-mix( in oklab , #00F0FF 20% , transparent ); color: rgba(0, 240, 255, 1); padding: 0.25rem 0.5rem;"
                            class="text-xs rounded-lg"
                          >
                            文档
                          </div>
                          <span style="color: rgba(92, 104, 118, 1);" class="text-xs">
                            User Story
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="h-full">
                    {/* Interface Design - Folder */}
                    <div
                      onClick={() => openFolder("design")}
                      class="hover:shadow-[0_8px_32px_rgba(0,240,255,0.25)] hover:scale-[1.02] transition-all cursor-pointer flex flex-col gap-y-4 w-96 h-full p-5 border-[1px] border-solid rounded-2xl"
                      style="background-color: color-mix( in oklab , #1A1F3A 90% , transparent ); box-shadow: 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 4px 20px rgba(0, 240, 255, 0.08); border-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                    >
                      <div
                        style="background-color: color-mix( in oklab , #00F0FF 5% , transparent ); border-color: color-mix( in oklab , #00F0FF 15% , transparent );"
                        class="flex justify-center items-center w-full grow border-[1px] border-solid rounded-lg overflow-hidden"
                      >
                        <img
                          style="filter: brightness(90%) contrast(90%);"
                          alt="UI Design"
                          src="https://static.paraflowcontent.com/public/resource/image/7641c341-bc09-4527-a6a4-1075f23ad867.jpeg"
                          class="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div class="flex flex-col gap-y-2 shrink-0">
                        <h3 style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold">
                          界面设计
                        </h3>
                        <p style="color: rgba(138, 151, 170, 1);" class="text-sm font-normal">
                          登录与仪表盘 UI
                        </p>
                        <div class="flex items-center gap-x-2 mt-2">
                          <div
                            style="background-color: color-mix( in oklab , #B026FF 20% , transparent ); color: rgba(176, 38, 255, 1); padding: 0.25rem 0.5rem;"
                            class="text-xs rounded-lg"
                          >
                            设计
                          </div>
                          <span style="color: rgba(92, 104, 118, 1);" class="text-xs">
                            HTML/CSS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <img
                  id="12:86"
                  style="top: 0; right: 0; bottom: 0; left: 0; z-index: -1;"
                  alt="SVG image #0"
                  src="https://static.paraflowcontent.com/public/resource/image/32dcbf4b-6111-44b1-bdf6-dd1213293ac9.svg"
                  class="absolute w-full h-full"
                />
              </div>

              <div
                style="background-image: radial-gradient(circle, rgba(0, 240, 255, 1) 1px, transparent 1px); background-size: 20px 20px; top: 0; right: 0; bottom: 0; left: 0;"
                class="opacity-10 absolute w-full h-full"
              ></div>
            </Show>
            
            {/* Design Folder View - Inside Transform */}
            <Show when={isDesignView()}>
              <div class="absolute inset-0 p-12 overflow-y-auto pointer-events-auto">
                 <div class="grid grid-cols-3 gap-8 w-full max-w-7xl mx-auto pb-12">
                    <For each={mockDesignFiles}>
                      {(file) => (
                        <div
                          onClick={(e) => {
                             e.stopPropagation()
                             setPreviewFile(file)
                          }}
                          class="group cursor-pointer relative w-full aspect-[4/3] rounded-2xl border border-[#B026FF]/20 bg-[#1A1F3A] hover:border-[#B026FF]/60 hover:shadow-[0_0_30px_rgba(176,38,255,0.3)] hover:scale-105 transition-all duration-300"
                        >
                          <div class="w-full h-full rounded-2xl overflow-hidden relative bg-white">
                             <iframe 
                               srcdoc={file.content} 
                               class="w-[300%] h-[300%] border-none pointer-events-none scale-[0.3333] origin-top-left"
                               tabindex="-1"
                               scrolling="no"
                             />
                             <div class="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors"></div>
                             
                             <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#141829] via-[#141829]/80 to-transparent pointer-events-none">
                                <h3 class="text-[#E8F0FF] text-xl font-bold mb-1">{file.title}</h3>
                                <p class="text-[#8A97AA] text-sm font-mono">{file.filename}</p>
                             </div>
                          </div>
                        </div>
                      )}
                    </For>
                 </div>
              </div>
            </Show>
          </div>
        </Show>

        <Show when={currentView() === "folder" && activeFolder() === "docs"}>
          <div class="w-full h-full p-8 overflow-hidden flex flex-col">
            <div class="mb-8 shrink-0">
              <h2 class="text-3xl font-bold text-[#E8F0FF] mb-2">产品需求文档</h2>
              <p class="text-[#8A97AA]">产品需求与规格说明</p>
            </div>
            <div class="flex-1 overflow-x-auto overflow-y-hidden pb-4">
              <div class="flex gap-6 h-full min-w-max px-2">
                <For each={mockDocs}>
                  {(doc) => (
                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        openFile(doc)
                      }}
                      class="text-left group cursor-pointer w-[400px] h-full flex flex-col rounded-xl border border-[#00F0FF]/10 bg-[#1A1F3A]/90 hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/5 transition-all relative overflow-hidden z-[100] pointer-events-auto"
                    >
                      <div class="p-4 border-b border-[#00F0FF]/10 bg-[#1A1F3A] flex items-center gap-3 shrink-0">
                        <div class="w-8 h-8 rounded bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                          <iconify-icon icon="lucide:file-text" class="text-lg"></iconify-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-[#E8F0FF] font-medium text-sm truncate">{doc.title}</h3>
                          <p class="text-[#8A97AA] text-[10px] truncate">{doc.filename}</p>
                        </div>
                      </div>

                      <div class="flex-1 p-6 overflow-hidden bg-[#141829]/50 relative">
                        <div class="absolute inset-0 p-6 text-[10px] text-[#8A97AA] font-mono leading-relaxed whitespace-pre-wrap opacity-70 group-hover:opacity-100 transition-opacity">
                          {doc.content}
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1F3A] to-transparent pointer-events-none"></div>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>

        {/* Wireframe Folder View */}
        <Show when={currentView() === "folder" && activeFolder() === "wireframe"}>
          <div
            style="background: linear-gradient(135deg, rgba(10, 14, 26, 1) 0%, rgba(26, 19, 50, 1) 50%, rgba(13, 27, 42, 1) 100%), radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.101961) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 0, 110, 0.101961) 0%, transparent 50%);"
            class="flex grow min-w-0 h-full overflow-y-auto"
          >
            <main
              style="flex-basis: 0%; padding: 1.5rem 2rem;"
              class="overflow-x-hidden flex flex-col grow shrink"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                <For each={mockWireframeFiles}>
                  {(file) => (
                    <div
                      onClick={() => openFile(file)}
                      class="group cursor-pointer p-4 rounded-xl border border-[#00F0FF]/10 bg-[#1A1F3A]/90 hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/5 transition-all flex flex-col gap-4"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                          <iconify-icon icon="lucide:file-text" class="text-xl"></iconify-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-[#E8F0FF] font-medium truncate">{file.filename}</h3>
                          <p class="text-[#8A97AA] text-xs">{file.lastModified}</p>
                        </div>
                      </div>
                      <div class="h-32 bg-[#141829] rounded-lg p-3 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                        <div class="w-full h-full overflow-hidden text-[10px] font-mono text-[#8A97AA] leading-tight whitespace-pre-wrap">
                          {file.content}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </main>
          </div>
        </Show>

        {/* Enhanced File Detail View */}
        <Show when={currentView() === "file" && activeFile()}>
          <div class="w-full h-full p-0 flex flex-col bg-[#141829]">
            <div class="border-b border-[#00F0FF]/10 p-6 flex items-center gap-4 bg-[#1A1F3A]/50">
              <div
                class={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  activeFile().type === "html"
                    ? "bg-[#B026FF]/10 text-[#B026FF]"
                    : activeFile().type === "flowchart"
                      ? "bg-[#FF006E]/10 text-[#FF006E]"
                      : activeFile().type === "markdown"
                        ? "bg-[#00F0FF]/10 text-[#00F0FF]"
                      : "bg-[#00F0FF]/10 text-[#00F0FF]"
                }`}
              >
                <iconify-icon
                  icon={
                    activeFile().type === "html"
                      ? "lucide:layout"
                      : activeFile().type === "flowchart"
                        ? "lucide:workflow"
                        : activeFile().type === "markdown"
                          ? "lucide:file-text"
                        : "lucide:file-text"
                  }
                ></iconify-icon>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-[#E8F0FF]">{activeFile().title}</h1>
                <p class="text-[#8A97AA] text-sm font-mono">
                  {activeFile().filename} • {activeFile().lastModified}
                </p>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-0 w-full relative">
              <Show when={activeFile().type === "html"}>
                <div class="w-full h-full bg-white">
                  <iframe srcdoc={activeFile().content} class="w-full h-full border-none" title="Preview" />
                </div>
              </Show>

              <Show when={activeFile().type === "markdown"}>
                <div class="p-8 max-w-4xl mx-auto w-full">
                  <div class="text-[#E8F0FF]" innerHTML={parseMarkdown(activeFile().content)}></div>
                </div>
              </Show>

              <Show when={activeFile().type === "flowchart"}>
                <div
                  style="background: linear-gradient(135deg, rgba(10, 14, 26, 1) 0%, rgba(26, 19, 50, 1) 50%, rgba(13, 27, 42, 1) 100%), radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.101961) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 0, 110, 0.101961) 0%, transparent 50%);"
                  class="flex grow min-w-0 h-full overflow-y-auto"
                >
                  <main
                    style="flex-basis: 0%; padding: 1.5rem 2rem;"
                    class="overflow-x-hidden flex flex-col grow shrink"
                  >
                    <div class="flex justify-between items-center mb-8">
                      <div class="flex items-center gap-y-4 gap-x-4">
                        <button 
                          onClick={() => setActiveFile(null)}
                          class="hover:bg-[#00F0FF]/10 p-2 rounded-lg transition-colors text-[#00F0FF]"
                        >
                          <iconify-icon icon="lucide:arrow-left" class="text-xl"></iconify-icon>
                        </button>
                        <h1 style="color: rgba(232, 240, 255, 1);" class="text-2xl font-bold">
                          用户故事
                        </h1>
                      </div>
                    </div>
                    <div class="w-full flex-1 bg-[#141829] relative overflow-hidden rounded-xl border border-[#00F0FF]/20 min-h-[500px]">
                      <iframe 
                        srcdoc={getMermaidHtml(activeFile().content)} 
                        class="w-full h-full border-none" 
                        title="Flowchart" 
                      />
                      <div class="absolute bottom-4 right-4 p-2 bg-[#1A1F3A]/80 backdrop-blur rounded-lg border border-[#00F0FF]/20 text-[#00F0FF] text-xs flex items-center gap-2">
                        <iconify-icon icon="simple-icons:mermaid"></iconify-icon>
                        <span>Mermaid Renderer</span>
                      </div>
                    </div>
                  </main>
                </div>
              </Show>

              <Show when={!activeFile().type}>
                <div class="p-8 max-w-4xl mx-auto w-full prose prose-invert prose-cyan max-w-none">
                  <div class="text-[#E8F0FF] whitespace-pre-wrap font-sans leading-7">{activeFile().content}</div>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </div>

      {/* Preview Modal */}
          <Show when={previewFile()}>
            <div 
              class="fixed inset-0 z-[999] bg-black/80 flex flex-col items-center justify-center animate-fade-in"
              onClick={() => setPreviewFile(null)}
            >
              <button 
                class="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-[1000]"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewFile(null)
                }}
              >
                <iconify-icon icon="lucide:x" class="text-2xl" />
              </button>
              <div class="relative w-[90%] h-[80%] flex gap-4">
                <div class="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl border border-[#00F0FF]/20">
                   <iframe 
                     id="preview-iframe"
                     srcdoc={getPreviewContent(previewFile().content)} 
                     class="w-full h-full border-none bg-white"
                     onClick={(e) => e.stopPropagation()}
                   />
                </div>
             
             <Show when={selectedHtml()}>
               <div class="w-[400px] flex flex-col bg-[#1A1F3A] rounded-xl overflow-hidden border border-[#00F0FF]/20 shadow-2xl animate-fade-in-right" onClick={(e) => e.stopPropagation()}>
                 <div class="p-4 border-b border-[#00F0FF]/10 flex justify-between items-center bg-[#141829]/50">
                    <h3 class="text-[#E8F0FF] font-semibold text-sm">Selected Element</h3>
                    <button 
                      onClick={() => setSelectedHtml(null)}
                      class="text-[#8A97AA] hover:text-white"
                    >
                       <iconify-icon icon="lucide:x" />
                    </button>
                 </div>
                 <div class="flex-1 overflow-auto p-4 font-mono text-xs text-[#E8F0FF] whitespace-pre-wrap">
                    {selectedHtml()}
                 </div>
               </div>
             </Show>
          </div>
        </div>
      </Show>
    </main>
  )
}

export default Workspace
