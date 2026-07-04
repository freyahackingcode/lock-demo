// 免反锁家人选择页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/users/user-antiLock.js
// 头像 URL 来自 miot.lock.spec/resources/images.js 的生产 CDN 硬编码链接
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Dialog, Toast } from './components.jsx'
import { getState, setState, subscribe, LOCK_USERS } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

function uidsEqual(a, b) {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every((v) => set.has(v))
}

export default function AntiLockPage({ onBack }) {
  const s = useStore()
  const [selected, setSelected] = useState(s.deadlockUids)
  const [exitDlg, setExitDlg] = useState(false)
  const [toast, setToast] = useState('')

  const changed = !uidsEqual(selected, s.deadlockUids)

  const toggle = (uid) => {
    setSelected((prev) => prev.includes(uid) ? prev.filter((v) => v !== uid) : [...prev, uid])
  }

  const handleBack = () => {
    if (changed) setExitDlg(true)
    else onBack()
  }

  const handleConfirm = () => {
    setState({ deadlockUids: selected })
    setToast('设置成功')
    setTimeout(() => { setToast(''); onBack() }, 800)
  }

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="不受反锁限制的人" onBack={handleBack} />

      <div className="sl-scroll" style={{ paddingBottom: 120 }}>
        <div className="sl-user-list">
          {LOCK_USERS.map((u) => {
            const checked = selected.includes(u.uid)
            return (
              <div key={u.uid} className="sl-user-item" onClick={() => toggle(u.uid)}>
                <img className="sl-user-avatar-img" src={u.avatar} alt={u.name} />
                <div className="sl-user-info">
                  <div className="sl-user-name">{u.name}</div>
                  {u.isOwner ? <div className="sl-user-owner-tag">设备主人</div> : null}
                </div>
                <div className={`sl-check-box ${checked ? 'checked' : ''}`} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="sl-bottom-bar">
        <button className="sl-primary-btn" onClick={handleConfirm}>确认</button>
      </div>

      <Dialog
        open={exitDlg}
        title="设置未保存"
        body="当前设置未生效，确认退出？"
        buttons={[
          { text: '取消', onClick: () => setExitDlg(false) },
          { text: '退出', style: 'danger', onClick: () => { setExitDlg(false); onBack() } }
        ]}
      />

      <Toast msg={toast} />
    </div>
  )
}
