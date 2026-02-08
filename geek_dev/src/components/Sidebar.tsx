import type { Component } from "solid-js"
import { For, Show, batch, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js"
import { createStore } from "solid-js/store"

interface SidebarProps {
  width: number
  isCollapsed?: boolean
  onToggle?: () => void
  onChatStart?: (text: string) => Promise<void>
  title?: string
}

type Msg = {
  id: string
  role: "user" | "assistant"
  text: string
  ts: number
  thinkText?: string
  thinkDone?: boolean
  thinkStart?: number
  thinkDuration?: number
  toolStatus?: string
  filePaths?: string[]
  rawText?: string
}

interface QuestionOption {
  label: string
  description?: string
}

interface QuestionItem {
  question: string
  header?: string
  options: QuestionOption[]
  multiple?: boolean
}

interface QuestionPayload {
  id: string
  sessionID: string
  questions: QuestionItem[]
  tool: {
    messageID: string
    callID: string
  }
}

type EventPayload = {
  type?: string
  file?: string
  info?: {
    id?: string
    role?: string
    sessionID?: string
    time?: {
      created?: number
      completed?: number
    }
  }
  payload?: {
    type?: string
    properties?: {
      info?: {
        id?: string
        role?: string
        sessionID?: string
        time?: {
          created?: number
          completed?: number
        }
      }
      part?: {
        type?: string
        text?: string
        sessionID?: string
        messageID?: string
        tool?: string
        state?: {
          status?: string
          input?: any
          output?: any
        }
        time?: {
          end?: number
        }
      }
      delta?: string
      file?: string
    }
  }
  properties?: {
    info?: {
      id?: string
      role?: string
      sessionID?: string
      time?: {
        created?: number
        completed?: number
      }
    }
    part?: {
      type?: string
      text?: string
      sessionID?: string
      messageID?: string
      tool?: string
      state?: {
        status?: string
        input?: any
        output?: any
      }
      time?: {
        end?: number
      }
    }
    delta?: string
    file?: string
    connected?: boolean
    status?: {
      type?: string
      message?: string
      attempt?: number
      next?: number
    }
    sessionID?: string
    error?: {
      message?: string
      name?: string
    }
    questions?: QuestionItem[]
  }
  part?: {
    type?: string
    text?: string
    sessionID?: string
    messageID?: string
    tool?: string
    state?: {
      status?: string
      input?: any
      output?: any
    }
    time?: {
      end?: number
    }
  }
  delta?: string
  connected?: boolean
  status?: {
    type?: string
    message?: string
    attempt?: number
    next?: number
  }
  sessionID?: string
  error?: {
    message?: string
    name?: string
  }
  questions?: QuestionItem[]
}

const Sidebar: Component<SidebarProps> = (props) => {
  const base = import.meta.env.VITE_PROXY_URL ?? "http://localhost:4097"
  const [inputHeight, setInputHeight] = createSignal(120)
  const [isDragging, setIsDragging] = createSignal(false)
  const [text, setText] = createSignal("")
  const [connected, setConnected] = createSignal(false)
  const [msgs, setMsgs] = createSignal<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        "Hi, Geek Developers\n你想打造怎样的产品体验？\n一句需求，生成结构化产品蓝图\nPRD 与架构文档一体化输出\n用户故事 + 验收标准系统拆解\n用户旅程与流程逻辑清晰呈现\n高保真原型快速落地与验证",
      ts: Date.now(),
    },
  ])
  const [sid, setSid] = createSignal("")
  const [busy, setBusy] = createSignal(false)
  const [streaming, setStreaming] = createSignal(false)
  const [showHistory, setShowHistory] = createSignal(false)
  const [history, setHistory] = createSignal<{ id: string; title: string; ts: number }[]>([])
  const hasUserMessage = createMemo(() => msgs().some((msg) => msg.role === "user"))
  const visibleMsgs = createMemo(() => {
    const list = msgs()
    if (!hasUserMessage()) return list
    return list.filter((msg) => msg.id !== "welcome")
  })

  const [questionState, setQuestionState] = createStore<{
    activeQuestion: QuestionPayload | null
    answers: Record<number, { selected: string[]; customInput: string }>
  }>({
    activeQuestion: null,
    answers: {},
  })
  const [questionIndex, setQuestionIndex] = createSignal(0)

  let busyTimer: number | undefined
  let lastRetryKey = ""
  const userMessageIds = new Set<string>()
  const assistantMessageIds = new Set<string>()
  const pendingText = new Map<string, string>()
  const pendingReasoning = new Map<string, string>()
  let messagesRef: HTMLDivElement | undefined
  let resizerRef: HTMLDivElement | undefined
  let textareaRef: HTMLTextAreaElement | undefined
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

  const makeId = () => {
    const id = globalThis.crypto?.randomUUID?.()
    if (id) return id
    return String(Date.now())
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

  const setCookie = (key: string, value: string) => {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/`
  }

  const loadHistory = () => {
    try {
      const json = cookieValue("chat_history")
      if (!json) return
      const list = JSON.parse(json)
      if (Array.isArray(list)) {
        setHistory(list)
      }
    } catch {}
  }

  const addToHistory = (id: string, title: string) => {
    const current = history()
    const now = Date.now()
    const existingIndex = current.findIndex((h) => h.id === id)
    let next = [...current]
    if (existingIndex >= 0) {
      next[existingIndex] = { ...next[existingIndex], title, ts: now }
      // Move to top
      const item = next.splice(existingIndex, 1)[0]
      next.unshift(item)
    } else {
      next.unshift({ id, title, ts: now })
    }
    setHistory(next)
    setCookie("chat_history", JSON.stringify(next))
  }

  const handleNewSession = () => {
    setCookie("app_session", "")
    setCookie("app_name", "")
    window.location.reload()
  }

  const handleSwitchSession = async (id: string, title: string) => {
    try {
      await fetch(`${base}/session/${id}/ensure`, {
        method: "POST",
      })
    } catch (e) {
      console.error("Ensure session error:", e)
    }
    setCookie("app_session", id)
    setCookie("app_name", title)
    window.location.reload()
  }

  const deleteHistoryItem = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    const next = history().filter((h) => h.id !== id)
    setHistory(next)
    setCookie("chat_history", JSON.stringify(next))
  }

  createEffect(() => {
    const id = sid()
    const t = props.title
    if (id && t && t !== "Analyzing Input..." && t !== "极客开发区") {
      addToHistory(id, t)
    }
  })

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    const s = (ms / 1000).toFixed(1)
    return `${s}s`
  }

  const splitThink = (textValue: string) => {
    const openTag = "<think>"
    const closeTag = "</think>"
    const openIndex = textValue.indexOf(openTag)
    const closeIndex = textValue.indexOf(closeTag)
    if (closeIndex !== -1) {
      const start = openIndex !== -1 ? openIndex + openTag.length : 0
      const think = textValue.slice(start, closeIndex)
      const before = openIndex > 0 ? textValue.slice(0, openIndex) : ""
      const after = textValue.slice(closeIndex + closeTag.length)
      return { hasThink: true, think, answer: before + after, done: true }
    }
    if (openIndex !== -1) {
      const before = textValue.slice(0, openIndex)
      const think = textValue.slice(openIndex + openTag.length)
      return { hasThink: true, think, answer: before, done: false }
    }
    return { hasThink: false, think: "", answer: textValue, done: false }
  }
  const sanitizeBoxMarkers = (textValue: string) =>
    textValue.replace(/<\|begin_of_box\|>|<\|end_of_box\|>/g, "")

  const ensureSession = async () => {
    if (sid()) return sid()
    const res = await fetch(`${base}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.id) return ""
    setSid(data.id)
    return data.id
  }

  const send = async (overrideText?: string) => {
    if (busy()) return

    const value = overrideText ?? text().trim()
    if (!value) return
    const cookieSession = cookieValue("app_session")
    const sessionId = sid() || cookieSession

    
    const isFirstMessage = msgs().filter(m => m.role === "user").length === 0
    
    // Update UI immediately to prevent message staying in input box
    // Force clear input first, outside of batch to ensure priority
    setText("")
    if (textareaRef) textareaRef.value = ""

    batch(() => {
      setMsgs((list) => [
        ...list,
        { id: makeId(), role: "user", text: value, ts: Date.now() },
      ])
      
      // Show typing immediately and block input
      setBusy(true)
      setStreaming(true)
    })

    if (isFirstMessage && props.onChatStart) {
      // Trigger transition logic in background, do not await
      // Use setTimeout to ensure UI updates (input clearing) happen before any heavy transition logic
      // Increase delay to 300ms to ensure browser has time to paint the cleared input state and avoid race conditions
      setTimeout(() => {
        // Double check clear before transition
        if (textareaRef && textareaRef.value !== "") {
           textareaRef.value = ""
           setText("")
        }
        props.onChatStart?.(value).catch(console.error)
      }, 300)
    }

    const finalSessionId = sessionId || (await ensureSession())
    if (!finalSessionId) {
      setBusy(false)
      setStreaming(false)
      setMsgs((list) => [
        ...list,
        { id: makeId(), role: "assistant", text: "创建会话失败，请检查代理服务", ts: Date.now() },
      ])
      return
    }
    setCookie("app_session", finalSessionId)
    if (isFirstMessage) {
      const title = value.length > 12 ? value.slice(0, 12) + "..." : value
      setCookie("app_name", title)
    }
    const res = await fetch(`${base}/session/${finalSessionId}/prompt_async`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parts: [{ type: "text", text: value }],
        agent: "build",
      }),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      setBusy(false)
      setStreaming(false)
      setMsgs((list) => [
        ...list,
        {
          id: makeId(),
          role: "assistant",
          text: errText ? `请求失败：${errText}` : "请求失败，请检查代理或服务端",
          ts: Date.now(),
        },
      ])
      return
    }
    if (busyTimer) window.clearTimeout(busyTimer)
    busyTimer = window.setTimeout(() => {
      setBusy(false)
      setStreaming(false)
      const currentMsgs = msgs()
      const lastMsg = currentMsgs[currentMsgs.length - 1]
      if (lastMsg && lastMsg.role === "user") {
        setMsgs([
          ...currentMsgs,
          {
            id: "error-" + Date.now(),
            role: "assistant",
            text: "Error: Request timed out after 10 minutes. The model might be busy or the context is too large.",
            ts: Date.now(),
          },
        ])
      }
    }, 600000)
  }

  const toggleOption = (qIndex: number, label: string, multiple: boolean) => {
    const current = questionState.answers[qIndex]?.selected || []
    let next: string[]
    if (multiple) {
      if (current.includes(label)) {
        next = current.filter((l) => l !== label)
      } else {
        next = [...current, label]
      }
    } else {
      next = [label]
    }
    setQuestionState("answers", qIndex, "selected", next)
  }

  const updateCustomInput = (qIndex: number, value: string) => {
    setQuestionState("answers", qIndex, "customInput", value)
  }

  const currentQuestion = () => questionState.activeQuestion?.questions[questionIndex()]
  const totalQuestions = () => questionState.activeQuestion?.questions.length || 0
  const isLastQuestion = () => questionIndex() >= totalQuestions() - 1

  const nextQuestion = () => {
    const q = questionState.activeQuestion
    if (!q) return
    const total = q.questions.length
    const next = questionIndex() + 1
    if (next >= total) {
      submitQuestions()
      return
    }
    setQuestionIndex(next)
  }

  const prevQuestion = () => {
    const next = questionIndex() - 1
    if (next < 0) return
    setQuestionIndex(next)
  }

  const submitQuestions = () => {
    const q = questionState.activeQuestion
    if (!q) return
    const answers = questionState.answers

    let responseText = "我提交了问卷回答：\n"
    q.questions.forEach((item, index) => {
      const ans = answers[index]
      if (!ans) return
      responseText += `\n### ${item.header || item.question}\n`
      if (ans.selected.length === 0) {
        responseText += "*(未选择)*\n"
      } else {
        ans.selected.forEach((label) => {
          responseText += `- **${label}**`
          responseText += "\n"
        })
      }
      if (ans.customInput) {
        responseText += `补充说明：${ans.customInput}\n`
      }
    })

    send(responseText)
    setQuestionState({ activeQuestion: null, answers: {} })
    setQuestionIndex(0)
  }

  const stopStream = async () => {
    const sessionId = sid() || cookieValue("app_session")
    if (!sessionId) return
    await fetch(`${base}/session/${sessionId}/abort`, { method: "POST" }).catch(() => null)
    if (busyTimer) window.clearTimeout(busyTimer)
    setBusy(false)
    setStreaming(false)
  }

  onMount(() => {
    loadHistory()
    document.addEventListener("mousemove", doDrag)
    document.addEventListener("mouseup", stopDrag)
    const handleExample = (event: Event) => {
      const detail = (event as CustomEvent).detail as { text?: string }
      if (!detail?.text) return
      setText(detail.text)
      if (textareaRef) textareaRef.value = detail.text
    }
    const cookieSession = cookieValue("app_session")
    if (!cookieSession) {
      // setMsgs((list) => [
      //   ...list,
      //   { id: makeId(), role: "assistant", text: "正在初始化默认会话...", ts: Date.now() },
      // ])
    } else {
      setSid(cookieSession)
    }
    const handleCreated = (evt: Event) => {
      const detail = (evt as CustomEvent).detail as { sessionId?: string; appName?: string } | undefined
      if (!detail?.sessionId) return
      setSid(detail.sessionId)
      // setMsgs((list) => [
      //   ...list,
      //   {
      //     id: makeId(),
      //     role: "assistant",
      //     text: `App已创建：${detail.appName ?? ""}`,
      //     ts: Date.now(),
      //   },
      // ])
    }
    window.addEventListener("app_created", handleCreated as EventListener)
    window.addEventListener("home_example", handleExample as EventListener)
    let source: EventSource | undefined
    try {
      source = new EventSource(`${base}/events`)
      source.onopen = () => {
        setConnected(true)
      }
      source.onerror = () => {
        setConnected(false)
      }
      source.onmessage = (evt) => {
        const data = (() => {
          try {
            return JSON.parse(evt.data) as EventPayload
          } catch {
            return null
          }
        })()
        if (!data) return
        const payload = (data.payload ?? data) as EventPayload
        const type = payload.type ?? ""
        if (type === "proxy.status") {
          const props = payload.properties ?? payload
          setConnected(Boolean(props.connected))
          return
        }
        if (type === "session.error") {
          const props = payload.properties ?? payload
          const sessionId = props.sessionID
          if (!sessionId || sessionId !== (sid() || cookieValue("app_session"))) return
          const errorName = props.error?.name || ""
          const errorMessage =
            errorName === "MessageAbortedError"
              ? "用户已取消"
              : props.error?.message || errorName || "会话错误"
          setMsgs((list) => [
            ...list,
            { id: makeId(), role: "assistant", text: errorMessage, ts: Date.now() },
          ])
          if (busyTimer) window.clearTimeout(busyTimer)
          setBusy(false)
          setStreaming(false)
          return
        }
        if (type === "session.status") {
          const props = payload.properties ?? payload
          const sessionId = props.sessionID
          if (!sessionId || sessionId !== (sid() || cookieValue("app_session"))) return
          const status = props.status
          if (status?.type === "retry") {
            const key = `${sessionId}:${status.attempt ?? ""}:${status.message ?? ""}`
            if (key !== lastRetryKey) {
              lastRetryKey = key
              const hint = status.message ? `重试中：${status.message}` : "重试中"
              setMsgs((list) => [
                ...list,
                { id: makeId(), role: "assistant", text: hint, ts: Date.now() },
              ])
            }
          }
          return
        }
        if (type === "question.asked") {
          const props = payload.properties ?? payload
          // Ensure it matches the shape
          if (props && Array.isArray(props.questions)) {
            batch(() => {
              setQuestionState("activeQuestion", props as QuestionPayload)
              // Initialize answers
              const initialAnswers: Record<number, { selected: string[]; customInput: string }> = {}
              ;(props.questions as QuestionItem[]).forEach((_: any, index: number) => {
                initialAnswers[index] = { selected: [], customInput: "" }
              })
              setQuestionState("answers", initialAnswers)
              setQuestionIndex(0)
            })
            // Scroll to bottom to show question
            requestAnimationFrame(() => {
              if (messagesRef) messagesRef.scrollTo({ top: messagesRef.scrollHeight, behavior: "smooth" })
            })
          }
          return
        }
        if (type === "message.updated") {
          const props = payload.properties ?? payload
          const info = props.info
          if (!info?.id || !info?.sessionID) return
          if (info.sessionID !== (sid() || cookieValue("app_session"))) return

          if (info.role === "user") {
            userMessageIds.add(info.id)
            if (pendingText.has(info.id)) pendingText.delete(info.id)
            if (pendingReasoning.has(info.id)) pendingReasoning.delete(info.id)
          }

          const messageId = info.id
          const messageText = (info as any).text
          const toolStatus =
            (info as any).status === "pending" || (info as any).status === "running"
              ? "running"
              : (info as any).status === "success" || (info as any).status === "done"
              ? "done"
              : (info as any).status === "failed" || (info as any).status === "error"
              ? "error"
              : undefined

          if (info.role === "assistant") {
            assistantMessageIds.add(messageId)
            const pendingRaw = pendingText.get(messageId) ?? ""
            const pendingThink = pendingReasoning.get(messageId) ?? ""
            if (pendingRaw) pendingText.delete(messageId)
            if (pendingThink) pendingReasoning.delete(messageId)
            if (info.time?.completed) {
              if (busyTimer) window.clearTimeout(busyTimer)
              setBusy(false)
              setStreaming(false)
            }

            setMsgs((list) => {
              const index = list.findIndex((item) => item.id === messageId)
              if (index < 0 && (messageText === undefined || messageText === "") && !pendingRaw) {
                if (!toolStatus) return list
              }
              if (index >= 0) {
                const prev = list[index]
                const next = list.slice()
                const newText =
                  messageText === "" ? prev.text ?? "" : messageText ?? prev.text ?? ""
                const nextMsg: Msg = { ...prev, toolStatus, text: newText, ts: Date.now() }
                if (!messageText && pendingRaw) {
                  const split = splitThink(pendingRaw)
                  nextMsg.rawText = pendingRaw
                  if (split.hasThink) {
                    nextMsg.thinkText = split.think.trim()
                    nextMsg.thinkDone = split.done
                    nextMsg.text = split.answer
                  } else {
                    nextMsg.text = split.answer
                  }
                }
                if (pendingThink) {
                  nextMsg.thinkText = (nextMsg.thinkText || "") + pendingThink
                }
                next[index] = nextMsg
                return next
              }
              if (pendingRaw) {
                const split = splitThink(pendingRaw)
                return [
                  ...list,
                  {
                    id: messageId,
                    role: "assistant",
                    text: split.answer,
                    ts: Date.now(),
                    toolStatus,
                    rawText: pendingRaw,
                    thinkText: split.hasThink ? split.think.trim() : undefined,
                    thinkDone: split.hasThink ? split.done : undefined,
                  },
                ]
              }
              if (pendingThink) {
                return [
                  ...list,
                  {
                    id: messageId,
                    role: "assistant",
                    text: messageText ?? "",
                    ts: Date.now(),
                    toolStatus,
                    thinkText: pendingThink,
                  },
                ]
              }
              return [
                ...list,
                {
                  id: messageId,
                  role: "assistant",
                text: messageText ?? "",
                  ts: Date.now(),
                  toolStatus,
                },
              ]
            })
          }
          return
        }
        if (type === "file.edited") {
          const props = payload.properties ?? payload
          const filePath = props.file || ""
          // Simple relative path logic
          const parts = filePath.split("/")
          const workspaceIndex = parts.indexOf("geek_dev")
          const relativePath = workspaceIndex !== -1 ? parts.slice(workspaceIndex + 1).join("/") : filePath
          
          setMsgs((list) => [
            ...list,
            {
              id: makeId(),
              role: "assistant",
              text: `已创建/编辑文件: ${relativePath}`,
              ts: Date.now(),
              filePaths: [relativePath],
            },
          ])
          return
        }
        if (type !== "message.part.updated") return
        const props = payload.properties ?? payload
        const part = props.part
        if (!part) return
        const sessionId = part.sessionID
        if (!sessionId || sessionId !== (sid() || cookieValue("app_session"))) return
        const messageId = part.messageID
        if (!messageId) return
        if (userMessageIds.has(messageId)) return
        if (part.type === "tool") {
          setMsgs((list) => {
            const toolId = (part as any).id ?? `${messageId}:${(part as any).callID ?? part.tool ?? "tool"}`
            const index = list.findIndex((item) => item.id === toolId)
            const toolStatus = part.state?.status || "pending"
            const toolName = part.tool || "unknown tool"
            const detailLines: string[] = []
            const inputLines: string[] = []
            
            const input = part.state?.input as any
            if (input) {
              if (toolName === "write" || toolName === "write_file") {
                const p = input.file_path || input.path
                if (p) detailLines.push(`📄 写入文件: ${p}`)
                if (typeof input.content === "string") {
                  const lines = input.content.split(/\r\n|\n|\r/)
                  const previewLines = lines.slice(0, 50)
                  const truncated = lines.length > 50
                  const preview = previewLines.join("\n") + (truncated ? "\n..." : "")
                  inputLines.push(`内容预览(前50行):\n${preview}`)
                }
              } else if (toolName === "read" || toolName === "read_file") {
                const p = input.file_path || input.path
                if (p) detailLines.push(`📖 读取文件: ${p}`)
              } else if (toolName === "execute" || toolName === "run_command" || toolName === "command") {
                const c = input.command || input.cmd
                if (c) detailLines.push(`💻 执行命令: ${c}`)
                if (input.cwd) detailLines.push(`工作目录: ${input.cwd}`)
              } else if (toolName === "search_codebase" || toolName === "glob" || toolName === "grep") {
                 const p = input.query || input.pattern
                 if (p) detailLines.push(`🔍 搜索: ${p}`)
              }
              const inputText = JSON.stringify(input, null, 2)
              if (inputText && inputText !== "{}") {
                inputLines.push(`输入参数:\n${inputText}`)
              }
            }

            const output = part.state?.output
            let resultText = ""
            if (output) {
                const outStr = typeof output === "string" ? output : JSON.stringify(output, null, 2)
                const truncated = outStr.length > 1200 ? outStr.slice(0, 1200) + "..." : outStr
                resultText = `\n结果:\n${truncated}`
            }
            const detailText = detailLines.length ? `\n${detailLines.join("\n")}` : ""
            const inputTextBlock = inputLines.length ? `\n${inputLines.join("\n")}` : ""
            const messageText = `正在执行 ${toolName} 工具: ${toolStatus}${detailText}${inputTextBlock}${resultText}`
            if (index >= 0) {
              const prev = list[index]
              const next = list.slice()
              next[index] = { ...prev, toolStatus, text: messageText, ts: Date.now() }
              return next
            }
            return [
              ...list,
              {
                id: toolId,
                role: "assistant",
                text: messageText,
                ts: Date.now(),
                toolStatus,
              },
            ]
          })
          return
        }
        if (part.type === "reasoning") {
          if (!assistantMessageIds.has(messageId) && !userMessageIds.has(messageId)) {
            const chunk = part.text ?? props.delta ?? ""
            if (!chunk) return
            const prevPending = pendingReasoning.get(messageId) ?? ""
            let nextPending = prevPending
            if (part.text !== undefined && part.text !== "") {
              const textValue = part.text
              if (!prevPending || textValue.startsWith(prevPending) || textValue.length >= prevPending.length) {
                nextPending = textValue
              } else {
                nextPending = prevPending + textValue
              }
            } else {
              nextPending = prevPending + chunk
            }
            pendingReasoning.set(messageId, nextPending)
            return
          }
          setMsgs((list) => {
            const index = list.findIndex((item) => item.id === messageId)
            const delta = props.delta ?? ""
            const now = Date.now()
            if (index >= 0) {
              const prev = list[index]
              const prevThink = prev.thinkText || ""
              let nextThink = prevThink
              if (part.text !== undefined && part.text !== "") {
                const textValue = part.text
                if (!prevThink || textValue.startsWith(prevThink) || textValue.length >= prevThink.length) {
                  nextThink = textValue
                } else {
                  nextThink = prevThink + textValue
                }
              } else if (delta) {
                nextThink = prevThink + delta
              }
              const thinkDone = !!part.time?.end
              const thinkStart = prev.thinkStart || now
              const thinkDuration = thinkDone ? now - thinkStart : undefined
              const next = list.slice()
              next[index] = { ...prev, thinkText: nextThink, thinkDone, thinkStart, thinkDuration, ts: now }
              return next
            }
            return [
              ...list,
              {
                id: messageId,
                role: "assistant",
                text: "",
                ts: now,
                thinkText: part.text !== undefined ? part.text : delta,
                thinkDone: !!part.time?.end,
                thinkStart: now,
              },
            ]
          })
          return
        }
        if (part.type !== "text") return
        const delta = props.delta ?? ""
        if (!assistantMessageIds.has(messageId) && !userMessageIds.has(messageId)) {
          const chunk = part.text ?? delta ?? ""
          if (!chunk) return
          const prevPending = pendingText.get(messageId) ?? ""
          let nextPending = prevPending
          if (part.text !== undefined && part.text !== "") {
            const textValue = part.text
            if (!prevPending || textValue.startsWith(prevPending) || textValue.length >= prevPending.length) {
              nextPending = textValue
            } else {
              nextPending = prevPending + textValue
            }
          } else {
            nextPending = prevPending + chunk
          }
          pendingText.set(messageId, nextPending)
          return
        }
        
        setMsgs((list) => {
          const index = list.findIndex((item) => item.id === messageId)
          let currentRaw = ""
          const prev = index >= 0 ? list[index] : undefined
          const prevRaw = prev ? (prev.rawText ?? prev.text ?? "") : ""
          
          if (prev) {
            if (part.text !== undefined && part.text !== "") {
              const textValue = part.text
              if (!prevRaw || textValue.startsWith(prevRaw) || textValue.length >= prevRaw.length) {
                currentRaw = textValue
              } else {
                currentRaw = prevRaw + textValue
              }
            } else if (delta) {
              currentRaw = prevRaw + delta
            } else {
              currentRaw = prevRaw
            }
          } else {
             currentRaw = part.text ?? delta
          }
          
          if (!currentRaw && index < 0) return list
          const split = splitThink(currentRaw)
          
          const newMessageBase = prev ? { ...prev } : {
            id: messageId,
            role: "assistant" as const,
            text: "",
            ts: Date.now(),
          }

          const updatedMessage: Msg = {
            ...newMessageBase,
            rawText: currentRaw,
            ts: Date.now()
          }

          if (split.hasThink) {
            updatedMessage.thinkText = split.think.trim()
            updatedMessage.thinkDone = split.done
            updatedMessage.text = split.answer
          } else {
             updatedMessage.text = split.answer
          }
          
          if (index >= 0) {
            const next = list.slice()
            next[index] = updatedMessage
            return next
          }
          return [...list, updatedMessage]
        })

        if (part.time?.end) {
          if (busyTimer) window.clearTimeout(busyTimer)
          setBusy(false)
          setStreaming(false)
        }
      }
    } catch {}
    const poll = setInterval(async () => {
      const res = await fetch(`${base}/proxy/status`).catch(() => null)
      if (!res || !res.ok) {
        setConnected(false)
        return
      }
      const data = await res.json().catch(() => null)
      setConnected(Boolean(data?.connected))
    }, 2000)
    onCleanup(() => {
      clearInterval(poll)
      if (busyTimer) window.clearTimeout(busyTimer)
      window.removeEventListener("app_created", handleCreated as EventListener)
      window.removeEventListener("home_example", handleExample as EventListener)
      source?.close()
    })
  })

  onCleanup(() => {
    document.removeEventListener("mousemove", doDrag)
    document.removeEventListener("mouseup", stopDrag)
  })

  createEffect(() => {
    msgs()
    requestAnimationFrame(() => {
      if (!messagesRef) return
      messagesRef.scrollTo({ top: messagesRef.scrollHeight, behavior: "smooth" })
    })
  })

  const showTyping = () => {
    if (!streaming()) return false
    const list = msgs()
    if (list.length === 0) return false
    const last = list[list.length - 1]
    if (last.role === "user") return true
    if (last.role === "assistant") {
      // If thinking is in progress, do not show typing
      if (last.thinkText && !last.thinkDone) return false
      // If we are here, it means either:
      // 1. No thinking involved (pure text)
      // 2. Thinking is done
      // In these cases, since streaming() is true, we should show typing to indicate more text might come
      return true
    }
    return false
  }

  return (
    <aside
      id="12:88"
      style="background: linear-gradient(135deg, rgba(22, 33, 62, 1) 0%, rgba(15, 22, 36, 1) 100%);"
      class="shrink-0 min-w-fit"
    >
      <div id="12:89" class="flex flex-col h-full" style={`width: ${props.width}px`}>
        <div
          id="12:90"
          style={`border-bottom-style: solid; padding: ${props.isCollapsed ? '1rem 0' : '1rem 1.5rem'}; border-color: color-mix( in oklab , #00F0FF 15% , transparent );`}
          class={`flex ${props.isCollapsed ? 'flex-col gap-y-4 justify-center' : 'justify-between'} items-center border-b-[1px] shrink-0`}
        >
          <div id="12:91" class={`flex items-center ${props.isCollapsed ? 'justify-center' : 'gap-x-3'}`}>
            <div id="12:92" class="bg-transparent flex justify-center items-center w-6 h-6">
              <iconify-icon
                id="12:93"
                style="color: rgba(0, 240, 255, 1);"
                icon="lucide:brain-circuit"
                class="text-xl"
              ></iconify-icon>
            </div>
            <Show when={!props.isCollapsed}>
              <h2 id="12:94" style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold truncate max-w-[240px]" title={props.title || "极客开发区"}>
                {props.title || "极客开发区"}
              </h2>
            </Show>
          </div>
          <div class={`flex items-center ${props.isCollapsed ? 'flex-col gap-y-3' : 'gap-x-3'}`}>
            <Show when={!props.isCollapsed}>
              <button
                onClick={handleNewSession}
                title="New Chat"
                class="hover:text-[#00F0FF] text-[#5C6876] transition-colors flex items-center justify-center w-8 h-8"
              >
                <iconify-icon icon="lucide:plus" class="text-lg"></iconify-icon>
              </button>
              <button
                onClick={() => setShowHistory(!showHistory())}
                title="History"
                class={`hover:text-[#00F0FF] transition-colors flex items-center justify-center w-8 h-8 ${
                  showHistory() ? "text-[#00F0FF]" : "text-[#5C6876]"
                }`}
              >
                <iconify-icon icon="lucide:history" class="text-lg"></iconify-icon>
              </button>
            </Show>
            <div
              id="12:95"
              style={{
                "background-color": connected() ? "rgba(0, 255, 159, 1)" : "rgba(255, 90, 90, 1)",
                "box-shadow": connected()
                  ? "0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 8px rgba(0, 255, 159, 0.5)"
                  : "0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 rgba(0, 0, 0, 0), 0 0 8px rgba(255, 90, 90, 0.5)",
              }}
              class="w-3 h-3 rounded-full"
            ></div>
            <button
              onClick={props.onToggle}
              class="hover:text-[#00F0FF] text-[#5C6876] transition-colors flex items-center justify-center"
            >
              <iconify-icon
                icon={props.isCollapsed ? "lucide:chevrons-right" : "lucide:chevrons-left"}
                class="text-lg"
              ></iconify-icon>
            </button>
          </div>
        </div>

        <Show when={!props.isCollapsed}>
          <Show when={showHistory()}>
            <div class="overflow-y-auto grow shrink geek-scroll p-4 flex flex-col gap-2">
              <div class="text-[#5C6876] text-xs font-bold uppercase tracking-wider mb-2">History</div>
              <For each={history()}>
                {(item) => (
                  <div
                    class={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors group ${
                      item.id === sid()
                        ? "bg-[#00F0FF]/10 border border-[#00F0FF]/30"
                        : "bg-[#1A2333] border border-transparent hover:border-[#00F0FF]/30"
                    }`}
                    onClick={() => handleSwitchSession(item.id, item.title)}
                  >
                    <div class="flex flex-col overflow-hidden">
                      <div class="text-[#E8F0FF] text-sm truncate font-medium">{item.title}</div>
                      <div class="text-[#5C6876] text-xs">{new Date(item.ts).toLocaleString()}</div>
                    </div>
                    <button
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      class="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-[#5C6876] transition-all"
                    >
                      <iconify-icon icon="lucide:trash-2"></iconify-icon>
                    </button>
                  </div>
                )}
              </For>
              <Show when={history().length === 0}>
                <div class="text-[#5C6876] text-sm text-center mt-10">No history found</div>
              </Show>
            </div>
          </Show>
          <Show when={!showHistory()}>
            <div
              ref={messagesRef}
              id="12:96"
            class="overflow-y-auto grow shrink geek-scroll"
            style="padding: 1rem 1.5rem;"
          >
            <For each={visibleMsgs()}>
              {(msg) => {
                const isUser = msg.role === "user"
                const hasThink = !!msg.thinkText
                const isWelcome = msg.id === "welcome"
                const welcomeLines = isWelcome ? sanitizeBoxMarkers(msg.text).split("\n") : []
                const welcomeTitle = welcomeLines[0] ?? ""
                const welcomeSubtitle = welcomeLines[1] ?? ""
                const welcomeItems = welcomeLines.slice(2)
                return (
                  <div class={`flex gap-x-3 mb-4 ${isUser ? "justify-end" : ""}`}>
                    <Show when={!isUser}>
                      <div
                        style="background-color: color-mix( in oklab , #00F0FF 20% , transparent ); border-color: color-mix( in oklab , #00F0FF 40% , transparent );"
                        class="flex shrink-0 justify-center items-center w-8 h-8 border-[1px] border-solid rounded-full"
                      >
                        <div class="bg-transparent flex justify-center items-center w-4 h-4">
                          <iconify-icon
                            style="color: rgba(0, 240, 255, 1);"
                            icon="lucide:brain-circuit"
                            class="text-sm"
                          ></iconify-icon>
                        </div>
                      </div>
                    </Show>
                    <div class={`${isUser ? "max-w-[80%]" : "grow shrink basis-0"}`}>
                      <div
                        style={{
                          "background-color": isUser
                            ? "color-mix( in oklab , #00F0FF 15% , transparent )"
                            : "transparent",
                          "border-color": isUser
                            ? "color-mix( in oklab , #00F0FF 30% , transparent )"
                            : "transparent",
                        }}
                        class={`p-3 rounded-lg border-[1px] border-solid ${
                          isUser ? "text-[#E8F0FF]" : "text-[#94A3B8]"
                        } text-sm leading-relaxed break-words`}
                      >
                        <Show
                          when={!isWelcome}
                          fallback={
                            <div class="relative overflow-hidden rounded-xl border border-[#00F0FF]/25 bg-[#0F1624]/60 px-5 py-4">
                              <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#00F0FF]/10 blur-2xl"></div>
                              <div class="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-[#00F0FF]/10 blur-2xl"></div>
                              <div class="text-[#E8F0FF] text-base font-semibold tracking-wide">
                                {welcomeTitle}
                              </div>
                              <div class="mt-1 text-sm text-[#94A3B8]">{welcomeSubtitle}</div>
                              <div class="mt-4 grid grid-cols-1 gap-2">
                                <For each={welcomeItems}>
                                  {(item) => (
                                    <div class="flex items-center gap-2 text-sm text-[#C8D2E0]">
                                      <div class="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></div>
                                      <span>{item}</span>
                                    </div>
                                  )}
                                </For>
                              </div>
                            </div>
                          }
                        >
                        <Show when={hasThink}>
                          <div class="mb-2">
                            <div class="flex items-center gap-x-2 mb-2">
                              <span class="text-xs font-mono text-[#5C6876] uppercase tracking-wider">
                                {msg.thinkDone ? "已思考" : "思考中..."}
                              </span>
                              <Show when={msg.thinkDone && msg.thinkDuration}>
                                <span class="text-xs text-[#475569] font-mono">
                                  {formatDuration(msg.thinkDuration!)}
                                </span>
                              </Show>
                              <div
                                class={`transition-transform duration-200 ${msg.thinkDone ? "" : "animate-pulse"}`}
                              >
                                <iconify-icon
                                  icon="lucide:chevron-down"
                                  class="text-[#5C6876] text-sm"
                                ></iconify-icon>
                              </div>
                            </div>
                            <div
                              class={`text-[#5C6876] text-xs font-mono border-l-2 border-[#1E293B] pl-3 py-1 ${
                                msg.thinkDone ? "max-h-[200px] overflow-y-auto geek-scroll" : ""
                              }`}
                            >
                              {sanitizeBoxMarkers(msg.thinkText || "")}
                            </div>
                          </div>
                        </Show>
                        <div class="whitespace-pre-wrap">{sanitizeBoxMarkers(msg.text)}</div>
                        <Show when={msg.toolStatus}>
                          <div class="mt-2 text-xs font-mono text-[#00F0FF] opacity-80">
                            状态: {msg.toolStatus}
                          </div>
                        </Show>
                        <Show when={msg.filePaths && msg.filePaths.length > 0}>
                          <div class="mt-2 flex flex-col gap-1">
                            <For each={msg.filePaths}>
                              {(path) => (
                                <div class="text-xs font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded border border-[#00F0FF]/20 flex items-center gap-2">
                                  <iconify-icon icon="lucide:file-code" class="text-sm"></iconify-icon>
                                  {path}
                                </div>
                              )}
                            </For>
                          </div>
                        </Show>
                        </Show>
                      </div>
                    </div>
                  </div>
                )
              }}
            </For>
            
            {/* Typing Indicator */}
            <Show when={showTyping()}>
              <div class="flex gap-x-3 mb-4">
                <div
                  style="background-color: color-mix( in oklab , #00F0FF 20% , transparent ); border-color: color-mix( in oklab , #00F0FF 40% , transparent );"
                  class="flex shrink-0 justify-center items-center w-8 h-8 border-[1px] border-solid rounded-full"
                >
                  <div class="bg-transparent flex justify-center items-center w-4 h-4">
                    <iconify-icon
                      style="color: rgba(0, 240, 255, 1);"
                      icon="lucide:brain-circuit"
                      class="text-sm"
                    ></iconify-icon>
                  </div>
                </div>
                <div class="grow shrink basis-0">
                  <div class="flex items-center gap-x-1 h-10 px-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                </div>
              </div>
            </Show>
            
            <Show when={questionState.activeQuestion}>
              <div class="flex flex-col gap-4 mb-4 p-4 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5">
                <div class="flex items-center gap-2 mb-2">
                  <iconify-icon icon="lucide:clipboard-list" class="text-[#00F0FF] text-xl"></iconify-icon>
                  <span class="text-[#E8F0FF] font-semibold">请回答以下问题以继续</span>
                </div>
                <Show when={currentQuestion()}>
                  {(q) => (
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <div class="text-[#E8F0FF] font-medium text-sm">
                          {questionIndex() + 1}. {q().question}
                          <span class="text-xs text-[#5C6876] ml-2">
                            {q().multiple ? "(多选)" : "(单选)"}
                          </span>
                        </div>
                        <div class="text-xs text-[#5C6876]">
                          {questionIndex() + 1}/{totalQuestions()}
                        </div>
                      </div>
                      <div class="flex flex-col gap-2 pl-4">
                        <For each={q().options}>
                          {(opt) => {
                            const isSelected = () =>
                              questionState.answers[questionIndex()]?.selected.includes(opt.label)
                            return (
                              <div
                                class={`p-3 rounded-lg border transition-colors ${
                                  isSelected()
                                    ? "border-[#00F0FF] bg-[#00F0FF]/10"
                                    : "border-[#1E293B] bg-[#1E293B]/50 hover:border-[#00F0FF]/50"
                                }`}
                              >
                                <div
                                  class="flex items-start gap-3 cursor-pointer select-none"
                                  onClick={() => toggleOption(questionIndex(), opt.label, !!q().multiple)}
                                >
                                  <div
                                    class={`mt-1 w-4 h-4 shrink-0 flex items-center justify-center border rounded ${
                                      isSelected()
                                        ? "bg-[#00F0FF] border-[#00F0FF] text-[#0F1624]"
                                        : "border-[#5C6876]"
                                    }`}
                                  >
                                    <Show when={isSelected()}>
                                      <iconify-icon icon="lucide:check" class="text-xs font-bold"></iconify-icon>
                                    </Show>
                                  </div>
                                  <div class="flex flex-col gap-0.5">
                                    <span class={`text-sm ${isSelected() ? "text-[#00F0FF]" : "text-[#E8F0FF]"}`}>
                                      {opt.label}
                                    </span>
                                    <Show when={opt.description}>
                                      <span class="text-xs text-[#94A3B8]">{opt.description}</span>
                                    </Show>
                                  </div>
                                </div>
                              </div>
                            )
                          }}
                        </For>
                      </div>
                      <input
                        type="text"
                        placeholder="补充说明（可选）"
                        class="mt-2 w-full bg-transparent border-b border-[#5C6876] focus:border-[#00F0FF] outline-none text-xs text-[#E8F0FF] py-1 transition-colors placeholder:text-[#5C6876]/50"
                        value={questionState.answers[questionIndex()]?.customInput || ""}
                        onInput={(e) => updateCustomInput(questionIndex(), e.currentTarget.value)}
                      />
                      <div class="flex items-center justify-between mt-2">
                        <Show when={questionIndex() > 0}>
                          <button
                            onClick={prevQuestion}
                            class="py-2 px-3 border border-[#00F0FF]/40 text-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/10 transition-colors"
                          >
                            上一个
                          </button>
                        </Show>
                        <button
                          onClick={nextQuestion}
                          class="py-2 px-4 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0F1624] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <iconify-icon
                            icon={isLastQuestion() ? "lucide:send" : "lucide:arrow-right"}
                            class="text-lg"
                          ></iconify-icon>
                          {isLastQuestion() ? "提交回答" : "下一个"}
                        </button>
                      </div>
                    </div>
                  )}
                </Show>
              </div>
            </Show>
          </div>
        </Show>

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
              ref={textareaRef}
              id="12:127"
              style="color: rgba(232, 240, 255, 1); resize: none;"
              placeholder="向AI助手描述你的需求..."
              class="flex-grow w-full bg-transparent outline-none text-sm"
              value={text()}
              onInput={(e) => setText(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter" || e.shiftKey) return
                e.preventDefault()
                send()
              }}
            ></textarea>
            <div class="flex justify-between items-center mt-3">
              <span class="text-xs" style="color: rgba(92, 104, 118, 1);">
                按 Enter 发送，Shift + Enter 换行
              </span>
              <button
                id="12:128"
                class={`hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center w-8 h-8 rounded-lg ${busy() && !streaming() ? "opacity-60 cursor-not-allowed" : ""}`}
                style={`background-color: ${streaming() ? "rgba(255, 90, 90, 1)" : "rgba(0, 240, 255, 1)"};`}
                onClick={() => (streaming() ? stopStream() : send())}
              >
                <div id="12:129" class="bg-transparent flex justify-center items-center w-4 h-4">
                  <iconify-icon
                    id="12:130"
                    style={`color: ${streaming() ? "rgba(10, 14, 26, 1)" : "rgba(10, 14, 26, 1)"};`}
                    icon={streaming() ? "lucide:square" : "lucide:send"}
                    class="text-sm"
                  ></iconify-icon>
                </div>
              </button>
            </div>
          </div>
        </div>
        </Show>
      </div>
    </aside>
  )
}

export default Sidebar
