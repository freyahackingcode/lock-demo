import { useState } from 'react'
import { homeEvents, quickActions } from '../../mock/events.js'
import {
  IconBack, IconMore, IconBluetooth, IconBattery, IconChildLock,
  IconPlay, IconArrow, IconFamily, IconKey, IconVoice, IconShield,
  IconEventKey, IconEventMove, IconEventLock, IconScene, IconList,
} from '../../components/Icons.jsx'
import AiAssistant from '../../components/AiAssistant/index.jsx'
import LiveModal from '../../components/LiveModal/index.jsx'
import LogLLM from '../../components/LogLLM/index.jsx'
import { ToastHost, toast } from '../../components/Toast.jsx'
import './index.css'

const quickIconMap = {
  family: <IconFamily />,
  guest: <IconKey />,
  voice: <IconVoice />,
  service: <IconShield />,
}

const eventIconMap = {
  key: <IconEventKey />,
  move: <IconEventMove />,
  lock: <IconEventLock />,
}

export default function LockHome() {
  const [aiOpen, setAiOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [locked, setLocked] = useState(true)
  const [updatedAt, setUpdatedAt] = useState('09:36:28 更新')

  const onUnlock = () => {
    if (unlocking) return
    setUnlocking(true)
    toast('蓝牙连接中…')
    setTimeout(() => {
      setLocked(false)
      setUnlocking(false)
      const now = new Date()
      const t = now.toTimeString().slice(0, 8)
      setUpdatedAt(`${t} 更新`)
      toast('开锁成功')
      setTimeout(() => setLocked(true), 4000)
    }, 1400)
  }

  return (
    <div className="lock-home">
      {/* 状态栏 */}
      <div className="status-bar">
        <span className="time">2:36</span>
        <div className="status-icons">
          <span>●●●●</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* 标题栏 */}
      <div className="title-bar">
        <button className="icon-btn" onClick={() => toast('返回')}><IconBack /></button>
        <div className="title-center">
          <span className="brand-logo">M</span>
          <span className="title-text">小米智能门锁</span>
        </div>
        <button className="icon-btn" onClick={() => toast('更多')}><IconMore /></button>
      </div>

      {/* 顶部状态卡 */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-info">
          <h1 className={`hero-title ${locked ? '' : 'unlocked'}`}>
            {locked ? '门已锁好' : '门已开启'}
          </h1>
          <div className="hero-update">{updatedAt}</div>
          <div className="status-chips">
            <span className="chip"><IconBluetooth /></span>
            <span className="chip"><IconBattery /></span>
            <span className="chip"><IconChildLock /></span>
          </div>
        </div>
        <img className={`hero-device ${locked ? '' : 'shake'}`} src="/assets/lock-device.png" alt="lock" />
        <button className="live-btn" onClick={() => setLiveOpen(true)}>
          <IconPlay />
          <span>实时</span>
        </button>
      </div>

      {/* 金刚区 */}
      <div className="card kong">
        {quickActions.map((a) => (
          <div key={a.key} className="kong-item" onClick={() => toast(a.label)}>
            <div className="kong-icon">{quickIconMap[a.icon]}</div>
            <span className="kong-label">{a.label}</span>
          </div>
        ))}
      </div>

      {/* 看家事件 */}
      <div className="card events">
        <div className="card-head" onClick={() => setLogOpen(true)}>
          <span className="card-title">看家事件</span>
          <span className="card-extra">
            今日17条事件 <IconArrow />
          </span>
        </div>
        <div className="event-list">
          {homeEvents.map((e, idx) => (
            <div key={e.id} className="event-row" onClick={() => toast(`查看：${e.title}`)}>
              <div className="event-left">
                <div className="event-icon-wrap">{eventIconMap[e.iconType]}</div>
                {idx !== homeEvents.length - 1 && <div className="event-line" />}
              </div>
              <div className="event-body">
                <div className="event-time">{e.time}</div>
                <div className="event-title">{e.title}</div>
                {e.sub && <div className="event-sub">{e.sub}</div>}
              </div>
              {e.thumb && (
                <div className="event-thumb">
                  <img src={e.thumb} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 智能场景 */}
      <div className="card scene" onClick={() => toast('打开智能场景')}>
        <div className="scene-icon"><IconScene /></div>
        <span className="scene-label">智能场景</span>
        <IconArrow />
      </div>

      {/* 蓝牙开锁按钮 */}
      <div className="primary-btn-wrap">
        <button
          className={`primary-btn ${unlocking ? 'loading' : ''}`}
          onClick={onUnlock}
          disabled={unlocking}
        >
          {unlocking ? '正在开锁…' : (locked ? '蓝牙开锁' : '已开锁')}
        </button>
      </div>

      <div className="brand-tag">小米公司出品</div>

      <button className="fab-list" onClick={() => setAiOpen(true)} aria-label="智能助手">
        <span className="fab-spark">✨</span>
      </button>

      <div className="home-indicator" />

      <AiAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      <LiveModal open={liveOpen} onClose={() => setLiveOpen(false)} />
      <LogLLM open={logOpen} onClose={() => setLogOpen(false)} />
      <ToastHost />
    </div>
  )
}
