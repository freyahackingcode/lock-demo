// 人脸、掌静脉自动识别落地页
// 对应生产代码：settingLock/facePalmVein.js
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, NavigationRow, Toast, OptionSheet } from './components.jsx'
import { getState, setState, subscribe } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

const SENSITIVITY_OPTIONS = [
  { value: 'Low', label: '低' },
  { value: 'Medium', label: '中' },
  { value: 'High', label: '高' },
]
const SENSITIVITY_TEXT = { Low: '低', Medium: '中', High: '高' }

export default function FacePalmVein({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)

  const showToast = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  const saveMethod = (method) => {
    setState({ triggeringMethod: method })
    showToast('设置成功')
  }

  const isAuto = s.triggeringMethod === 'Auto'
  const isManual = s.triggeringMethod === 'Manual'

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="人脸、掌静脉自动识别" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-header-image-view">
          <div className="sl-header-image-box">
            <div style={{ fontSize: 64 }}>👁️</div>
          </div>
        </div>

        {/* Auto 卡片 */}
        <Section>
          <div className="sl-radio-card" onClick={() => saveMethod('Auto')}>
            <div className={`sl-radio-check ${isAuto ? 'checked' : ''}`}>
              {isAuto ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" fill="#34c759" />
                  <path d="M6 11.5L9.5 15L16 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" fill="none" stroke="#ccc" strokeWidth="1.5" />
                </svg>
              )}
            </div>
            <div className="sl-radio-body">
              <div className={`sl-radio-title ${isAuto ? 'active' : ''}`}>开启自动识别</div>
              <div className={`sl-radio-desc ${isAuto ? 'active' : ''}`}>
                开启后，走近门锁，门锁将自动唤醒并识别人脸、掌静脉
              </div>
            </div>
          </div>
          {isAuto ? (
            <div className="sl-row" onClick={() => setSheetOpen(true)}>
              <div className="sl-row-text">
                <div className="sl-row-label">识别灵敏度</div>
              </div>
              <div className="sl-row-value">
                <span>{SENSITIVITY_TEXT[s.faceUnlockSensitivity]}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3.5 5.5L7 9L10.5 5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ) : null}
        </Section>

        {/* Manual 卡片 */}
        <Section>
          <div className="sl-radio-card" onClick={() => saveMethod('Manual')}>
            <div className={`sl-radio-check ${isManual ? 'checked' : ''}`}>
              {isManual ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" fill="#34c759" />
                  <path d="M6 11.5L9.5 15L16 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" fill="none" stroke="#ccc" strokeWidth="1.5" />
                </svg>
              )}
            </div>
            <div className="sl-radio-body">
              <div className={`sl-radio-title ${isManual ? 'active' : ''}`}>关闭自动识别</div>
              <div className={`sl-radio-desc ${isManual ? 'active' : ''}`}>
                触摸密码区手动唤醒门锁，进行人脸、掌静脉识别（可延长门锁续航时间，并减少误触发）
              </div>
            </div>
          </div>
        </Section>
      </div>

      <OptionSheet
        open={sheetOpen}
        title="识别灵敏度"
        options={SENSITIVITY_OPTIONS}
        value={s.faceUnlockSensitivity}
        onSelect={(v) => {
          setState({ faceUnlockSensitivity: v })
          setSheetOpen(false)
          showToast('设置成功')
        }}
        onCancel={() => setSheetOpen(false)}
      />

      <Toast msg={toast} />
    </div>
  )
}
