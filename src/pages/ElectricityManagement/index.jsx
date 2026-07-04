import { useState } from 'react'
import MODES from './modes.js'
import ModeSelector from './ModeSelector.jsx'
import EleRelatedSettings from './EleRelatedSettings.jsx'
import OneClickSaving from './OneClickSaving.jsx'
import './index.css'

const FAQ_ITEMS = [
  { key: 'replace', title: '电池更换方式', icon: '/svg/LockMaxQuestion.svg' },
  { key: 'emergency', title: '如何在门外应急供电', icon: '/svg/LockMaxQuestion.svg' },
  { key: 'startKey', title: '如何使用应急启动键', icon: '/svg/LockMaxQuestion.svg' },
  { key: 'tips', title: '5 号电池使用小贴士', icon: '/svg/LockMaxQuestion.svg' }
]

function ProgressRing({ percent = 75, color = '#00b884', size = 40 }) {
  const r = 16
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <div className="battery-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} stroke="rgba(0,0,0,0.08)" strokeWidth="3" fill="none" />
        <circle
          cx="20" cy="20" r={r}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-text" style={{ color }}>{percent}</div>
    </div>
  )
}

export default function ElectricityManagement({ onBack, initialMode = 'standard', initialSheet = false, initialConfirm = false, initialSubPage = false, initialSaving = false }) {
  const [currentMode, setCurrentMode] = useState(initialMode)
  const [sheetOpen, setSheetOpen] = useState(initialSheet || initialConfirm)
  const [savingOpen, setSavingOpen] = useState(initialSaving)
  const [showSubPage, setShowSubPage] = useState(initialSubPage)
  const [toast, setToast] = useState('')
  const [estimatedDays, setEstimatedDays] = useState(28)

  const mode = MODES.find(m => m.key === currentMode)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const handleModeRowClick = () => {
    setSheetOpen(true)
  }

  const handleRelatedClick = () => {
    setShowSubPage(true)
  }

  const handleModeConfirm = (key) => {
    setCurrentMode(key)
    setSheetOpen(false)
    const newMode = MODES.find(m => m.key === key)
    setEstimatedDays(newMode.estimatedDays)
    showToast(`已切换为${newMode.name}，预计可用 ${newMode.estimatedDays} 天`)
  }

  const handleSavingApply = ({ totalSaving, newDays }) => {
    setCurrentMode('custom')
    setEstimatedDays(newDays)
    setSavingOpen(false)
    showToast(`已为你优化，预计可用 ${newDays} 天`)
  }

  if (showSubPage) {
    return <EleRelatedSettings onBack={() => setShowSubPage(false)} />
  }

  return (
    <div className="elec-page">
      {/* 状态栏 */}
      <div className="status-bar">
        <span className="time">2:36</span>
        <div className="status-icons">
          <span>●●●●</span><span>📶</span><span>🔋</span>
        </div>
      </div>

      {/* 标题栏 */}
      <div className="nav-bar">
        <button className="nav-btn" onClick={onBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="nav-title">电量管理</div>
        <button className="nav-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.6" fill="#000" />
            <circle cx="12" cy="12" r="1.6" fill="#000" />
            <circle cx="19" cy="12" r="1.6" fill="#000" />
          </svg>
        </button>
      </div>

      {/* Hero：以续航天数为主信息 */}
      <div className="elec-hero v2" style={{ background: `linear-gradient(135deg, ${mode.gradient} 0%, ${mode.gradient}cc 100%)` }}>
        <div className="hero-v2-row">
          <div className="hero-v2-left">
            <div className="hero-v2-label">预计可用</div>
            <div className="hero-v2-days">
              <span className="hero-v2-num">{estimatedDays}</span>
              <span className="hero-v2-unit">天</span>
            </div>
            <div className="hero-v2-mode-tag">
              <span className="mode-dot" />
              当前：{mode.name}
            </div>
          </div>
          <button
            className="hero-v2-action"
            onClick={() => setSavingOpen(true)}
          >
            <span className="action-icon">⚡</span>
            <span>一键省电</span>
          </button>
        </div>
        <div className="hero-v2-desc">{mode.subtitle}</div>
      </div>

      {/* 耗电分析（V1 仅占位提示，V3 落地真实数据） */}
      <div className="elec-card power-analysis-card" onClick={() => showToast('耗电分析详情（V3 待固件支持）')}>
        <div className="analysis-head">
          <span className="analysis-title">近 7 天耗电分析</span>
          <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
        </div>
        <div className="analysis-bars">
          <div className="analysis-bar">
            <div className="bar-label">人脸识别</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: '42%', background: '#FF6B6B' }} /></div>
            <div className="bar-percent">42%</div>
          </div>
          <div className="analysis-bar">
            <div className="bar-label">UWB 唤醒</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: '28%', background: '#FFA94D' }} /></div>
            <div className="bar-percent">28%</div>
          </div>
          <div className="analysis-bar">
            <div className="bar-label">按门铃录像</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: '18%', background: '#4DABF7' }} /></div>
            <div className="bar-percent">18%</div>
          </div>
          <div className="analysis-bar">
            <div className="bar-label">其他</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: '12%', background: '#ADB5BD' }} /></div>
            <div className="bar-percent">12%</div>
          </div>
        </div>
        <div className="analysis-tip">
          💡 人脸识别耗电偏高，可调整识别灵敏度
        </div>
      </div>

      {/* 电池模式行 */}
      <div className="elec-card">
        <div className="elec-row" onClick={handleModeRowClick}>
          <div className="elec-row-label">电池模式</div>
          <div className="elec-row-value">
            <span>{mode.name}</span>
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
        {currentMode === 'custom' && (
          <div className="elec-row" onClick={handleRelatedClick}>
            <div className="elec-row-label">相关设置</div>
            <div className="elec-row-value">
              <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
            </div>
          </div>
        )}
      </div>

      {/* 电量信息 */}
      <div className="elec-card">
        <div className="elec-card-title">电量信息</div>
        <div className="elec-row battery-row" onClick={() => showToast('跳转米家消耗品页')}>
          <div className="battery-icon-wrap">
            <img src="/svg/LithiumBatteryNormal.svg" alt="上锂电池" />
          </div>
          <div className="battery-info-text">
            <div className="battery-name">上锂电池</div>
            <div className="battery-health">健康度 92%</div>
          </div>
          <div className="battery-percent-right">
            <ProgressRing percent={75} color="#00b884" />
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
        <div className="elec-row battery-row" onClick={() => showToast('跳转米家消耗品页')}>
          <div className="battery-icon-wrap">
            <img src="/svg/LithiumBatteryNormal.svg" alt="下锂电池" />
          </div>
          <div className="battery-info-text">
            <div className="battery-name">下锂电池</div>
            <div className="battery-health">健康度 89%</div>
          </div>
          <div className="battery-percent-right">
            <ProgressRing percent={62} color="#00b884" />
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
        <div className="elec-row battery-row" onClick={() => showToast('跳转米家消耗品页')}>
          <div className="battery-icon-wrap">
            <img src="/svg/BatteryNormal.svg" alt="5 号电池" />
          </div>
          <div className="battery-info-text">
            <div className="battery-name">5 号电池</div>
          </div>
          <div className="battery-percent-right">
            <ProgressRing percent={88} color="#00b884" />
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
        <div className="elec-row trend-entry" onClick={() => showToast('30 天电量趋势（V2 待数据接入）')}>
          <div className="elec-row-label">📈 查看 30 天电量趋势</div>
          <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
        </div>
      </div>

      {/* 更多 */}
      <div className="elec-card">
        <div className="elec-card-title">更多</div>
        {FAQ_ITEMS.map(item => (
          <div key={item.key} className="elec-row" onClick={() => showToast(item.title)}>
            <div className="elec-row-label">{item.title}</div>
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        ))}
      </div>

      <div className="elec-bottom" />
      <div className="home-indicator" />

      {/* 模式选择 + 二次确认 */}
      {sheetOpen && (
        <ModeSelector
          currentMode={currentMode}
          initialConfirm={initialConfirm}
          onClose={() => setSheetOpen(false)}
          onConfirm={handleModeConfirm}
        />
      )}

      {/* 一键省电 */}
      {savingOpen && (
        <OneClickSaving
          currentDays={estimatedDays}
          onClose={() => setSavingOpen(false)}
          onApply={handleSavingApply}
        />
      )}

      {toast && <div className="elec-toast">{toast}</div>}
    </div>
  )
}
