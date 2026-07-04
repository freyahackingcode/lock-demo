import { useState, useEffect, useMemo } from 'react'
import { logDates, logTabs, aiSummary, logEvents, dateLabel, visibleDates } from '../../mock/logEvents.js'
import FeedbackSheet from '../FeedbackSheet/index.jsx'
import { toast } from '../Toast.jsx'
import './index.css'

const LOG_FEEDBACK_OPTIONS = [
  { key: 'people', label: '人物数量有误' },
  { key: 'object', label: '对象识别有误' },
  { key: 'item', label: '物品描述有误' },
  { key: 'other', label: '其他' },
]

// 小手反馈 icon（点踩手势：拇指向下）
const IconHand = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M11 1.5h1.6a1 1 0 011 1v6a1 1 0 01-1 1H11V1.5z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M11 1.8H5.6c-.6 0-1.1.4-1.2 1L3.3 7.6c-.2.8.4 1.6 1.2 1.6h2.7l-.5 2.6c-.2.9.5 1.7 1.4 1.7.4 0 .8-.2 1-.6L11 8.7V1.8z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
)

const IconBack = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 6L9 12L15 18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IconCalendarDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
// 视频/快放
const IconReplay = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="13" height="12" rx="2.5" stroke="#000" strokeWidth="1.6" />
    <path d="M16 10.5l5-2.5v8l-5-2.5v-3z" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const IconAI = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" fill="url(#aig)" />
    <defs>
      <linearGradient id="aig" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0" stopColor="#7b8cff" />
        <stop offset="1" stopColor="#3a8bff" />
      </linearGradient>
    </defs>
  </svg>
)

// 事件圆形图标
const EvIconKey = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="5" cy="8" r="2.5" stroke="#000" strokeWidth="1.4" />
    <path d="M7.3 8H14M12 8v2.4M14 8v1.6" stroke="#000" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const EvIconMove = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <circle cx="11" cy="3.5" r="1.5" fill="#000" />
    <path d="M9 7l3-1 2 4M12 6l-2 4 2 3v3M10 10l-3 1-2 3" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const EvIconLock = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2.5" y="6" width="9" height="6.5" rx="1.2" stroke="#000" strokeWidth="1.2" />
    <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="#000" strokeWidth="1.2" />
  </svg>
)
const eventIconMap = { key: <EvIconKey />, move: <EvIconMove />, lock: <EvIconLock /> }

export default function LogLLM({ open, onClose }) {
  const [tab, setTab] = useState('all')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [headerDate, setHeaderDate] = useState(logDates[0])
  // 每个日期的流式生成显示行数
  const [shownLines, setShownLines] = useState({})
  // 反馈状态：每个日期 AI 摘要的反馈记录
  const [feedbackFor, setFeedbackFor] = useState(null) // 当前要反馈的事件 key (date|id)
  const [feedbackedEvents, setFeedbackedEvents] = useState(new Set())

  // 启动时按 visibleDates 顺序逐日生成 AI 摘要（流式）
  useEffect(() => {
    if (!open) return
    setShownLines({})
    const timers = []
    visibleDates.forEach((d, idx) => {
      const points = aiSummary[d] || []
      let i = 0
      // 不同日期错峰开始
      const start = idx * 300
      const startT = setTimeout(() => {
        const t = setInterval(() => {
          i += 1
          setShownLines((s) => ({ ...s, [d]: i }))
          if (i >= points.length) clearInterval(t)
        }, 600)
        timers.push(t)
      }, start)
      timers.push(startT)
    })
    return () => timers.forEach((t) => { clearTimeout(t); clearInterval(t) })
  }, [open])

  if (!open) return null

  const filterEvents = (events) =>
    tab === 'all' ? events : events.filter((e) => e.type === tab)

  return (
    <div className="log-llm">
      {/* 状态栏 */}
      <div className="status-bar">
        <span className="time">2:36</span>
        <div className="status-icons"><span>●●●●</span><span>📶</span><span>🔋</span></div>
      </div>

      {/* 标题栏 */}
      <div className="log-title-bar">
        <button className="icon-btn" onClick={onClose}><IconBack /></button>
        <div className="log-date" onClick={() => setPickerOpen(true)}>
          <span>{headerDate}</span>
          <IconCalendarDown />
        </div>
        <button className="icon-btn"><IconReplay /></button>
      </div>

      {/* Tab 栏 */}
      <div className="log-tabs">
        {logTabs.map((t) => (
          <button
            key={t.key}
            className={`log-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <button className="log-tab-menu"><IconMenu /></button>
      </div>

      {/* 顶部说明 */}
      <div className="log-disclaimer">部分信息由AI大模型生成，请注意甄别</div>

      {/* 内容区 */}
      <div className="log-body">
        {visibleDates.map((d) => {
          const points = aiSummary[d] || []
          const shown = shownLines[d] || 0
          const events = filterEvents(logEvents[d] || [])
          const meta = dateLabel[d] || { short: d }
          return (
            <div key={d} className="day-block">
              <div className="day-head">
                <span className="day-date">{meta.short}</span>
                {meta.tag && <span className="day-tag">{meta.tag}</span>}
              </div>

              {/* AI 摘要卡片 */}
              <div className="ai-card">
                <div className="ai-summary-row">
                  <div className="ai-spark"><IconAI /></div>
                  <div className="ai-text">
                    {points.slice(0, shown).map((p, i) => (
                      <div key={i} className="ai-line">{p}</div>
                    ))}
                    {shown < points.length && (
                      <span className="ai-cursor" />
                    )}
                    {!points.length && <div className="ai-line muted">该日暂无摘要</div>}
                  </div>
                </div>

                {/* 完整快放 + 事件列表 共用一卡 */}
                {events.length > 0 && (
                  <>
                    <div className="ai-divider" />
                    <div className="quick-replay">
                      <div className="qr-title">查看完整快放</div>
                      <div className="qr-cover">
                        <img src={events[0].thumb || '/assets/event-baby.jpg'} alt="" />
                      </div>
                    </div>
                    <div className="ev-list">
                      {events.map((e, idx) => {
                        const hasAi = typeof e.sub === 'string' && e.sub.includes('[AI]')
                        const fbKey = `${d}|${e.id}`
                        const fbDone = feedbackedEvents.has(fbKey)
                        return (
                          <div key={e.id} className="ev-row">
                            <div className="ev-rail">
                              <div className="ev-icon">{eventIconMap[e.icon]}</div>
                              {idx !== events.length - 1 && <div className="ev-line" />}
                            </div>
                            <div className="ev-body">
                              <div className="ev-time">{e.time}</div>
                              <div className="ev-title">{e.tag}</div>
                              {e.sub && (
                                <div className="ev-sub">
                                  <span className="ev-sub-text">{e.sub}</span>
                                  {hasAi && (
                                    <button
                                      className={`ev-fb-icon ${fbDone ? 'done' : ''}`}
                                      onClick={(ev) => {
                                        ev.stopPropagation()
                                        if (fbDone) return
                                        setFeedbackFor(fbKey)
                                      }}
                                      aria-label={fbDone ? '已反馈' : '反馈错误'}
                                    >
                                      <IconHand filled={fbDone} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            {e.thumb && (
                              <div className="ev-thumb">
                                <img src={e.thumb} alt="" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 日期选择器 */}
      {pickerOpen && (
        <div className="picker-mask" onClick={() => setPickerOpen(false)}>
          <div className="picker" onClick={(e) => e.stopPropagation()}>
            <div className="picker-head">选择日期</div>
            {logDates.map((d) => (
              <div
                key={d}
                className={`picker-item ${d === headerDate ? 'active' : ''}`}
                onClick={() => { setHeaderDate(d); setPickerOpen(false) }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="home-indicator" />

      <FeedbackSheet
        open={feedbackFor !== null}
        title="反馈AI转写问题"
        options={LOG_FEEDBACK_OPTIONS}
        onClose={() => setFeedbackFor(null)}
        onSubmit={() => {
          setFeedbackedEvents((s) => {
            const next = new Set(s)
            next.add(feedbackFor)
            return next
          })
          setFeedbackFor(null)
          toast('谢谢你的帮助，让我们变得更好')
        }}
      />
    </div>
  )
}
