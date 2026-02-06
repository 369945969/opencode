import type { Component } from "solid-js"
import { For, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js"

interface SidebarProps {
  width: number
  isCollapsed?: boolean
  onToggle?: () => void
}

type Msg = {
  id: string
  role: "user" | "assistant"
  text: string
  ts: number
  thinkText?: string
  thinkDone?: boolean
}

type Part = {
  type: string
  text?: string
}

type EventPayload = {
  type?: string
  payload?: {
    type?: string
    properties?: {
      info?: {
        id?: string
        role?: string
        sessionID?: string
      }
      part?: {
        type?: string
        text?: string
        sessionID?: string
        messageID?: string
        time?: {
          end?: number
        }
      }
      delta?: string
    }
  }
  properties?: {
    info?: {
      id?: string
      role?: string
      sessionID?: string
    }
    part?: {
      type?: string
      text?: string
      sessionID?: string
      messageID?: string
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
  }
  part?: {
    type?: string
    text?: string
    sessionID?: string
    messageID?: string
    time?: {
      end?: number
    }
  }
  delta?: string
  connected?: boolean
  info?: {
    id?: string
    role?: string
    sessionID?: string
  }
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
      text: "你好！我是你的AI设计助手。我可以帮你创建文档、生成界面设计稿，或者分析你的设计需求。你想要我帮你做什么？",
      ts: Date.now(),
    },
  ])
  const [sid, setSid] = createSignal("")
  const [busy, setBusy] = createSignal(false)
  const [streaming, setStreaming] = createSignal(false)
  let busyTimer: number | undefined
  let lastRetryKey = ""
  const userMessageIds = new Set<string>()
  let messagesRef: HTMLDivElement | undefined
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

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
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
      return { hasThink: true, think, answer: (before + after).trim(), done: true }
    }
    if (openIndex !== -1) {
      const before = textValue.slice(0, openIndex)
      const think = textValue.slice(openIndex + openTag.length)
      return { hasThink: true, think, answer: before.trim(), done: false }
    }
    return { hasThink: false, think: "", answer: textValue, done: false }
  }

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

  const send = async () => {
    if (busy()) return
    const value = text().trim()
    if (!value) return
    const cookieSession = cookieValue("app_session")
    const sessionId = sid() || cookieSession
    if (!sessionId) {
      setMsgs((list) => [
        ...list,
        { id: makeId(), role: "assistant", text: "当前未创建App，请点击右侧开始创建App", ts: Date.now() },
      ])
      return
    }
    setMsgs((list) => [
      ...list,
      { id: makeId(), role: "user", text: value, ts: Date.now() },
    ])
    setBusy(true)
    setStreaming(true)
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
    setText("")
    if (busyTimer) window.clearTimeout(busyTimer)
    busyTimer = window.setTimeout(() => {
      setBusy(false)
      setStreaming(false)
    }, 30000)
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
    document.addEventListener("mousemove", doDrag)
    document.addEventListener("mouseup", stopDrag)
    const cookieSession = cookieValue("app_session")
    if (!cookieSession) {
      setMsgs((list) => [
        ...list,
        { id: makeId(), role: "assistant", text: "当前未创建App，请点击右侧开始创建App", ts: Date.now() },
      ])
    } else {
      setSid(cookieSession)
    }
    const handleCreated = (evt: Event) => {
      const detail = (evt as CustomEvent).detail as { sessionId?: string; appName?: string } | undefined
      if (!detail?.sessionId) return
      setSid(detail.sessionId)
      setMsgs((list) => [
        ...list,
        {
          id: makeId(),
          role: "assistant",
          text: `App已创建：${detail.appName ?? ""}`,
          ts: Date.now(),
        },
      ])
    }
    window.addEventListener("app_created", handleCreated as EventListener)
    let source: EventSource | undefined
    try {
      source = new EventSource(`${base}/events`)
      source.onopen = () => {
        setConnected(false)
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
        if (type === "message.updated") {
          const props = payload.properties ?? payload
          const info = props.info
          if (!info?.id || !info?.sessionID) return
          if (info.sessionID !== (sid() || cookieValue("app_session"))) return
          if (info.role === "user") {
            userMessageIds.add(info.id)
          }
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
        if (part.type === "reasoning") {
          const reasoningId = `${messageId}:reasoning`
          setMsgs((list) => {
            const index = list.findIndex((item) => item.id === reasoningId)
            const nextText = part.time?.end ? "思考完成" : "思考中..."
            if (index >= 0) {
              const next = list.slice()
              next[index] = { ...next[index], text: nextText, ts: Date.now() }
              return next
            }
            return [...list, { id: reasoningId, role: "assistant", text: nextText, ts: Date.now() }]
          })
          return
        }
        if (part.type !== "text") return
        const delta = props.delta ?? ""
        const rawText = part.text ?? ""
        const split = rawText ? splitThink(rawText) : { hasThink: false, answer: "", think: "", done: false }
        if (split.hasThink) {
          setMsgs((list) => {
            const index = list.findIndex((item) => item.id === messageId)
            if (index >= 0) {
              const next = list.slice()
              next[index] = {
                ...next[index],
                thinkText: split.think.trim(),
                thinkDone: split.done,
                ts: Date.now(),
              }
              return next
            }
            return [
              ...list,
              {
                id: messageId,
                role: "assistant",
                text: "",
                ts: Date.now(),
                thinkText: split.think.trim(),
                thinkDone: split.done,
              },
            ]
          })
        }
        if (split.hasThink && !split.done) return
        setMsgs((list) => {
          const index = list.findIndex((item) => item.id === messageId)
          const prev = index >= 0 ? list[index] : undefined
          const nextText = split.hasThink ? split.answer : part.text ?? (prev ? prev.text + delta : delta)
          if (!nextText) return list
          if (index >= 0 && prev) {
            const next = list.slice()
            next[index] = { ...prev, text: nextText, ts: Date.now() }
            return next
          }
          return [...list, { id: messageId, role: "assistant", text: nextText, ts: Date.now() }]
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
              <h2 id="12:94" style="color: rgba(232, 240, 255, 1);" class="text-lg font-semibold">
                极客开发区
              </h2>
            </Show>
          </div>
          <div class={`flex items-center ${props.isCollapsed ? 'flex-col gap-y-3' : 'gap-x-3'}`}>
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
          <div
            ref={messagesRef}
            id="12:96"
            class="overflow-y-auto grow shrink geek-scroll"
            style="padding: 1rem 1.5rem;"
          >
            <For each={msgs()}>
              {(msg) => {
                const isUser = msg.role === "user"
                const hasThink = !!msg.thinkText
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
                    <div style="flex-basis: 0%;" class={`${isUser ? "max-w-[80%]" : "grow shrink"}`}>
                      <Show when={hasThink}>
                        <details
                          class="p-3 border-[1px] border-solid rounded-2xl mb-2"
                          style={{
                            "background-color": "color-mix( in oklab , #1A1F3A 90% , transparent )",
                            "border-color": "color-mix( in oklab , #00F0FF 10% , transparent )",
                          }}
                          open={!msg.thinkDone}
                        >
                          <summary style="color: rgba(140, 150, 160, 1);" class="text-xs cursor-pointer">
                            {msg.thinkDone ? "思考完成" : "思考中..."}
                          </summary>
                          <p
                            style="color: rgba(140, 150, 160, 1);"
                            class="text-xs whitespace-pre-wrap mt-2"
                          >
                            {msg.thinkText || "思考中..."}
                          </p>
                        </details>
                      </Show>
                      <div
                        style={{
                          "background-color": isUser
                            ? "color-mix( in oklab , #00F0FF 15% , transparent )"
                            : "color-mix( in oklab , #1A1F3A 90% , transparent )",
                          "border-color": isUser
                            ? "color-mix( in oklab , #00F0FF 30% , transparent )"
                            : "color-mix( in oklab , #00F0FF 10% , transparent )",
                          "margin-left": isUser ? "auto" : undefined,
                        }}
                        class="p-4 border-[1px] border-solid rounded-2xl"
                      >
                        <p style="color: rgba(232, 240, 255, 1);" class="text-sm whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>
                      <span
                        style="color: rgba(92, 104, 118, 1);"
                        class={`text-xs block mt-1 ${isUser ? "text-right mr-4" : "ml-4"}`}
                      >
                        {formatTime(msg.ts)}
                      </span>
                    </div>
                    <Show when={isUser}>
                      <div
                        style="background-color: color-mix( in oklab , #00F0FF 10% , transparent );"
                        class="flex shrink-0 justify-center items-center w-8 h-8 rounded-full"
                      >
                        <img
                          alt="User profile picture with friendly expression"
                          src="https://static.paraflowcontent.com/public/resource/image/c0613487-2f97-4453-8e91-a50f025afcec.jpeg"
                          class="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </Show>
                  </div>
                )
              }}
            </For>
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
