// 反锁落地页
// 对应生产代码：settingLock/reverseLock.js
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, NavigationRow, Toast } from './components.jsx'
import { getState, setState, subscribe } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function ReverseLock({ onBack, navigate }) {
  const s = useStore()
  const [toast, setToast] = useState('')

  const onChange = (v) => {
    setState({ antiLock: v })
    setToast('设置成功')
    setTimeout(() => setToast(''), 2000)
  }

  const count = s.deadlockUids.length

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="反锁" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-header-image-view">
          <div className="sl-header-image-box">
            <div style={{ fontSize: 64 }}>🔐</div>
          </div>
          <div className="sl-header-image-text">
            可长按锁端按键或通过下方开关控制反锁。开启后，仅指定家人可室外开门（机械钥匙除外），室内开锁后自动解除
          </div>
        </div>

        <Section>
          <SwitchRow label="反锁" value={s.antiLock} onChange={onChange} />
          <NavigationRow
            label="不受反锁限制的人"
            sub="授权的家人可无视反锁限制，正常开锁。开锁后反锁不会解除"
            value={count > 0 ? `${count} 人` : '去设置'}
            onClick={() => navigate('antilock')}
          />
        </Section>
      </div>

      <Toast msg={toast} />
    </div>
  )
}
