// 童锁落地页
// 对应生产代码：settingLock/settingLockChild.js
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, Toast } from './components.jsx'
import { getState, setState, subscribe } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function SettingLockChild({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')

  const onChange = (v) => {
    setState({ childLock: v })
    setToast('设置成功')
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="童锁" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-header-image-view">
          <div className="sl-header-image-box">
            <div style={{ fontSize: 64 }}>🔒</div>
          </div>
          <div className="sl-header-image-text">
            开启童锁后，室内仅可使用应急旋钮开门
          </div>
        </div>

        <Section>
          <SwitchRow label="童锁" value={s.childLock} onChange={onChange} />
        </Section>
      </div>

      <Toast msg={toast} />
    </div>
  )
}
