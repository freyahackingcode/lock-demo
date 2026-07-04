// 防误开落地页
// 对应生产代码：settingLock/preventAccidentalOpen.js
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, Toast, OptionSheet } from './components.jsx'
import { getState, setState, subscribe } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

const TIME_OPTIONS = [
  { value: 0, label: '关闭' },
  { value: 10, label: '10 秒' },
  { value: 30, label: '30 秒' },
  { value: 60, label: '1 分钟' },
  { value: 180, label: '3 分钟' },
]

function formatTime(v) {
  if (v === 0) return '关闭'
  const opt = TIME_OPTIONS.find((o) => o.value === v)
  return opt ? opt.label : `${v} 秒`
}

export default function PreventAccidentalOpen({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [sheet, setSheet] = useState(null) // 'bio' | 'uwb' | null

  const showToast = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  const openBio = () => setSheet('bio')
  const openUwb = () => setSheet('uwb')

  const onSelect = (v) => {
    if (sheet === 'bio') setState({ faceUnlockSleepTime: v })
    if (sheet === 'uwb') setState({ uwbUnlockSleepTime: v })
    setSheet(null)
    showToast('设置成功')
  }

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="防误开" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-header-image-view">
          <div className="sl-header-image-text" style={{ paddingTop: 4 }}>
            关门后，部分开锁功能不可用，防止误解锁。若需开锁，可先触摸密码区唤醒门锁
          </div>
        </div>

        <Section>
          <div className="sl-row" onClick={openBio}>
            <div className="sl-row-text">
              <div className="sl-row-label">人脸、掌静脉防误开</div>
            </div>
            <div className="sl-row-value">
              <span>{formatTime(s.faceUnlockSleepTime)}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3.5 5.5L7 9L10.5 5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Section>

        <Section>
          <div className="sl-row" onClick={openUwb}>
            <div className="sl-row-text">
              <div className="sl-row-label">UWB 防误开</div>
            </div>
            <div className="sl-row-value">
              <span>{formatTime(s.uwbUnlockSleepTime)}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3.5 5.5L7 9L10.5 5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Section>
      </div>

      <OptionSheet
        open={sheet != null}
        title={sheet === 'uwb' ? 'UWB 防误开' : '人脸、掌静脉防误开'}
        options={TIME_OPTIONS}
        value={sheet === 'uwb' ? s.uwbUnlockSleepTime : s.faceUnlockSleepTime}
        onSelect={onSelect}
        onCancel={() => setSheet(null)}
      />

      <Toast msg={toast} />
    </div>
  )
}
