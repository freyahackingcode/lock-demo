import { useState, useEffect } from 'react'
import LockHome from './pages/LockHome/index.jsx'
import ElectricityManagement from './pages/ElectricityManagement/index.jsx'

export default function App() {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '')

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const view = hash.replace('#', '') || 'elec'
  const isClean = view.includes('clean=1')

  let content = null
  if (view === 'home') {
    content = <LockHome />
  } else if (view.startsWith('elec')) {
    const params = new URLSearchParams(view.split('?')[1] || '')
    content = (
      <ElectricityManagement
        onBack={() => { window.location.hash = 'home' }}
        initialMode={params.get('mode') || 'standard'}
        initialSheet={params.get('sheet') === '1'}
        initialConfirm={params.get('confirm') === '1'}
        initialSubPage={params.get('sub') === '1'}
        initialSaving={params.get('saving') === '1'}
      />
    )
  }

  return (
    <div className={`app-frame ${isClean ? 'clean' : ''}`}>
      {!isClean && (
        <div className="dev-nav">
          <button className={view === 'home' ? 'active' : ''} onClick={() => { window.location.hash = 'home' }}>首页</button>
          <button className={view === 'elec' ? 'active' : ''} onClick={() => { window.location.hash = 'elec' }}>电量管理</button>
          <button className={view.includes('mode=custom') ? 'active' : ''} onClick={() => { window.location.hash = 'elec?mode=custom' }}>自定义</button>
          <button className={view.includes('sheet=1') ? 'active' : ''} onClick={() => { window.location.hash = 'elec?sheet=1' }}>模式选择</button>
          <button className={view.includes('confirm=1') ? 'active' : ''} onClick={() => { window.location.hash = 'elec?confirm=1' }}>二次确认</button>
          <button className={view.includes('sub=1') ? 'active' : ''} onClick={() => { window.location.hash = 'elec?sub=1' }}>相关设置</button>
          <button className={view.includes('saving=1') ? 'active' : ''} onClick={() => { window.location.hash = 'elec?saving=1' }}>一键省电</button>
        </div>
      )}
      {content}
    </div>
  )
}
