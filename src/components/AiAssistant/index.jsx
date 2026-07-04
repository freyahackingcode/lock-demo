import { useState, useEffect, useRef } from 'react'
import FeedbackSheet from '../FeedbackSheet/index.jsx'
import { toast } from '../Toast.jsx'
import './index.css'

const SUGGESTIONS = ['今天小红几点回家了？', '爸爸出门了吗？', '今天有人遛狗吗？']

const QA_FEEDBACK_OPTIONS = [
  { key: 'wrong', label: '回答有误' },
  { key: 'irrelevant', label: '无关内容过多' },
  { key: 'missing', label: '未找到想要的内容' },
  { key: 'other', label: '其他' },
]

const IconFeedback = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 3.5h9v6h-5l-2.5 2v-2H2.5v-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)
const IconFeedbackDone = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7.2l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const IconSend = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 11.5V3M7 3l-3.5 3.5M7 3l3.5 3.5"
      stroke={active ? '#fff' : 'rgba(255,255,255,0.85)'}
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function AiAssistant({ open, onClose }) {
  // 'closed' | 'intro' | 'chat'
  const [stage, setStage] = useState('intro')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [feedbackFor, setFeedbackFor] = useState(null) // message index
  const [feedbackedSet, setFeedbackedSet] = useState(new Set())
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      setStage('intro')
      setMessages([])
      setInput('')
      setFeedbackedSet(new Set())
      setFeedbackFor(null)
    }
  }, [open])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const send = (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setStage('chat')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: 'ai',
        text: aiReply(q),
      }])
    }, 600)
  }

  if (!open) return null

  return (
    <div className="ai-mask" onClick={onClose}>
      <div className="ai-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="ai-handle"><span /></div>

        <div className="ai-header">
          <button className="ai-close" onClick={onClose}><IconClose /></button>
          <div className="ai-title">
            <div className="t1">门锁智能助手</div>
            <div className="t2">内容由AI大模型生成，请注意甄别</div>
          </div>
          <span className="ai-spacer" />
        </div>

        {stage === 'intro' ? (
          <div className="ai-body intro">
            <div className="ai-welcome">
              <p className="ai-hi">Hi，我是门锁智能助手</p>
              <p className="ai-desc">我可以基于大模型能力提供门锁视频检索服务，可以试试下面这些问题</p>
            </div>
            <div className="ai-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="ai-suggestion" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ai-body chat" ref={listRef}>
            {messages.map((m, i) => {
              const done = feedbackedSet.has(i)
              return (
                <div key={i} className={`ai-msg ${m.role}`}>
                  <div className="ai-msg-col">
                    <div className="ai-bubble">{m.text}</div>
                    {m.role === 'ai' && (
                      done ? (
                        <span className="ai-fb-tag done">
                          <IconFeedbackDone />已反馈
                        </span>
                      ) : (
                        <button className="ai-fb-tag" onClick={() => setFeedbackFor(i)}>
                          <IconFeedback />反馈
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="ai-input-bar">
          <div className="ai-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="有什么问题尽管问我"
            />
            <button
              className={`ai-send ${input.trim() ? 'active' : ''}`}
              onClick={() => send()}
            >
              <IconSend active={!!input.trim()} />
            </button>
          </div>
        </div>
        <div className="ai-home-indicator" />

        <FeedbackSheet
          open={feedbackFor !== null}
          title="反馈问题"
          options={QA_FEEDBACK_OPTIONS}
          onClose={() => setFeedbackFor(null)}
          onSubmit={() => {
            setFeedbackedSet((s) => {
              const next = new Set(s)
              next.add(feedbackFor)
              return next
            })
            setFeedbackFor(null)
            toast('谢谢你的帮助，让我们变得更好')
          }}
        />
      </div>
    </div>
  )
}

function aiReply(q) {
  if (q.includes('小红') || q.includes('回家')) return '根据云端视频分析，小红今天 17:42 回到家中。'
  if (q.includes('爸爸') || q.includes('出门')) return '爸爸今天 08:15 离开家，目前尚未返回。'
  if (q.includes('狗')) return '今天 19:08 检测到一次遛狗行为，时长约 32 分钟。'
  return '已收到你的提问，正在为你检索门锁视频…'
}
