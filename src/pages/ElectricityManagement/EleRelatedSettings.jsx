import { useState } from 'react'
import './index.css'

function Switch({ on, onToggle }) {
  return (
    <div
      className={`ios-switch ${on ? 'on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle && onToggle(!on)
      }}
    />
  )
}

export default function EleRelatedSettings({ onBack }) {
  const [recording, setRecording] = useState(true)
  const [indoorCamera, setIndoorCamera] = useState(true)
  const [doorbellScreen, setDoorbellScreen] = useState(true)
  const [proximityScreen, setProximityScreen] = useState(false)

  const [liveStreamMode, setLiveStreamMode] = useState('事件发生时可查看')
  const [stayingTime, setStayingTime] = useState('20 秒')
  const [recordPeriod, setRecordPeriod] = useState('全天')
  const [sensitivity, setSensitivity] = useState('中')
  const [triggerMethod, setTriggerMethod] = useState('自动 + 手动')
  const [faceSensitivity, setFaceSensitivity] = useState('高')

  return (
    <div className="elec-page">
      <div className="status-bar">
        <span className="time">2:36</span>
        <div className="status-icons">
          <span>●●●●</span><span>📶</span><span>🔋</span>
        </div>
      </div>

      <div className="nav-bar">
        <button className="nav-btn" onClick={onBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="nav-title">相关设置</div>
        <div style={{ width: 32 }} />
      </div>

      {/* 实时画面 */}
      <div className="elec-card">
        <div className="elec-row">
          <div className="elec-row-text">
            <div className="elec-row-label">实时画面</div>
          </div>
          <div className="elec-row-value">
            <span>{liveStreamMode}</span>
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
      </div>

      {/* 录像设置 */}
      <div className="elec-card">
        <div className="elec-card-title">录像设置</div>
        <div className="elec-row">
          <div className="elec-row-text">
            <div className="elec-row-label">事件录像</div>
            <div className="row-desc">检测到事件时自动录像</div>
          </div>
          <Switch on={recording} onToggle={setRecording} />
        </div>
        {recording && (
          <>
            <div className="elec-row">
              <div className="elec-row-text">
                <div className="elec-row-label">门内摄像头</div>
                <div className="row-desc">关闭后室内摄像头不录像</div>
              </div>
              <Switch on={indoorCamera} onToggle={setIndoorCamera} />
            </div>
            <div className="elec-row">
              <div className="elec-row-text">
                <div className="elec-row-label">停留时长</div>
              </div>
              <div className="elec-row-value">
                <span>{stayingTime}</span>
                <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
              </div>
            </div>
            <div className="elec-row">
              <div className="elec-row-text">
                <div className="elec-row-label">录像时段</div>
              </div>
              <div className="elec-row-value">
                <span>{recordPeriod}</span>
                <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
              </div>
            </div>
            <div className="elec-row">
              <div className="elec-row-text">
                <div className="elec-row-label">灵敏度</div>
                <div className="row-desc">事件录像的触发灵敏度</div>
              </div>
              <div className="elec-row-value">
                <span>{sensitivity}</span>
                <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 门内屏幕设置 */}
      <div className="elec-card">
        <div className="elec-card-title">门内屏幕设置</div>
        <div className="elec-row">
          <div className="elec-row-text">
            <div className="elec-row-label">按门铃亮起后屏</div>
            <div className="row-desc">按门铃时点亮门内屏</div>
          </div>
          <Switch on={doorbellScreen} onToggle={setDoorbellScreen} />
        </div>
        <div className="elec-row">
          <div className="elec-row-text">
            <div className="elec-row-label">门内靠近亮屏</div>
            <div className="row-desc">检测到有人靠近时点亮门内屏</div>
          </div>
          <Switch on={proximityScreen} onToggle={setProximityScreen} />
        </div>
      </div>

      {/* 人脸 / 掌静脉解锁设置 */}
      <div className="elec-card">
        <div className="elec-card-title">人脸 / 掌静脉解锁设置</div>
        <div className="elec-row">
          <div className="elec-row-text">
            <div className="elec-row-label">触发方式</div>
          </div>
          <div className="elec-row-value">
            <span>{triggerMethod}</span>
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
        <div className="elec-row">
          <div className="elec-row-text">
            <div className="elec-row-label">识别灵敏度</div>
            <div className="row-desc">越高越快识别，但更容易误识别</div>
          </div>
          <div className="elec-row-value">
            <span>{faceSensitivity}</span>
            <img className="elec-row-arrow" src="/svg/IconArrowRight.svg" alt="" />
          </div>
        </div>
      </div>

      <div className="elec-bottom" />
      <div className="home-indicator" />
    </div>
  )
}
