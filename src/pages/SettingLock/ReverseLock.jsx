// 反锁落地页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/settingLock/reverseLock.js
// "不受反锁限制的人"入口显示条件：custom_config.anti-lock-unlock-permission
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, NavigationRow, Toast } from './components.jsx'
import PlaceholderBanner from './PlaceholderBanner.jsx'
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
  const showAntiLockUsers = !!s.customConfig['anti-lock-unlock-permission']

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="反锁" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-header-image-view">
          {/* 生产实际 banner 走 custom_config.lock-setting.anti-lock */}
          <PlaceholderBanner icon="🔐" tint="orange" />
          <div className="sl-header-image-text">
            可长按锁端按键或通过下方开关控制反锁。开启后，仅指定家人可室外开门（机械钥匙除外），室内开锁后自动解除
          </div>
        </div>

        <Section>
          <SwitchRow label="反锁" value={s.antiLock} onChange={onChange} />
          {showAntiLockUsers ? (
            <NavigationRow
              label="不受反锁限制的人"
              sub="授权的家人可无视反锁限制，正常开锁。开锁后反锁不会解除"
              value={count > 0 ? `${count} 人` : '去设置'}
              onClick={() => navigate('antilock')}
            />
          ) : null}
        </Section>
      </div>

      <Toast msg={toast} />
    </div>
  )
}
