import { useState, useEffect } from 'react'
import LockHome from './pages/LockHome/index.jsx'
import ElectricityManagement from './pages/ElectricityManagement/index.jsx'
import SettingLock from './pages/SettingLock/index.jsx'
import SettingLockChild from './pages/SettingLock/SettingLockChild.jsx'
import ReverseLock from './pages/SettingLock/ReverseLock.jsx'
import AntiLockPage from './pages/SettingLock/AntiLockPage.jsx'
import FacePalmVein from './pages/SettingLock/FacePalmVein.jsx'
import PreventAccidentalOpen from './pages/SettingLock/PreventAccidentalOpen.jsx'
import HomeKitSetting from './pages/SettingLock/HomeKitSetting.jsx'
import SoundSettings from './pages/SettingLock/SoundSettings.jsx'
import DoorNotClose from './pages/SettingLock/DoorNotClose.jsx'
import AbnormalPage from './pages/SettingLock/AbnormalPage.jsx'
import NotificationManagement from './pages/SettingLock/NotificationManagement.jsx'
import PryAlarm from './pages/SettingLock/PryAlarm.jsx'
import DuressAlarm from './pages/SettingLock/DuressAlarm.jsx'
import AwayScene from './pages/SettingLock/AwayScene.jsx'
import ConfigPanel from './pages/SettingLock/ConfigPanel.jsx'

const setHash = (h) => { window.location.hash = h }

export default function App() {
  const [hash, setHashState] = useState(typeof window !== 'undefined' ? window.location.hash : '')

  useEffect(() => {
    const onChange = () => setHashState(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const view = hash.replace('#', '') || 'setting-lock'
  const isClean = view.includes('clean=1')

  const navigateSL = (target) => {
    const map = {
      child: 'setting-lock-child',
      reverse: 'setting-lock-reverse',
      antilock: 'setting-lock-antilock',
      'face-palm': 'setting-lock-face-palm',
      prevent: 'setting-lock-prevent',
      homekit: 'setting-lock-homekit',
      'sound-doornotclose': 'sound-doornotclose',
      'sound-abnormal': 'sound-abnormal',
      'notification-mgmt': 'notification-mgmt',
      'alarm-pry': 'alarm-pry',
      'alarm-duress': 'alarm-duress',
    }
    setHash(map[target] || target)
  }
  const backToSettingLock = () => setHash('setting-lock')
  const backToReverse = () => setHash('setting-lock-reverse')
  const backToNotification = () => setHash('notification-mgmt')

  let content = null
  if (view === 'home') {
    content = <LockHome />
  } else if (view.startsWith('elec')) {
    const params = new URLSearchParams(view.split('?')[1] || '')
    content = (
      <ElectricityManagement
        onBack={() => setHash('home')}
        initialMode={params.get('mode') || 'standard'}
        initialSheet={params.get('sheet') === '1'}
        initialConfirm={params.get('confirm') === '1'}
        initialSubPage={params.get('sub') === '1'}
        initialSaving={params.get('saving') === '1'}
      />
    )
  } else if (view === 'setting-lock') {
    content = <SettingLock onBack={() => setHash('home')} navigate={navigateSL} />
  } else if (view === 'setting-lock-child') {
    content = <SettingLockChild onBack={backToSettingLock} />
  } else if (view === 'setting-lock-reverse') {
    content = <ReverseLock onBack={backToSettingLock} navigate={navigateSL} />
  } else if (view === 'setting-lock-antilock') {
    content = <AntiLockPage onBack={backToReverse} />
  } else if (view === 'setting-lock-face-palm') {
    content = <FacePalmVein onBack={backToSettingLock} />
  } else if (view === 'setting-lock-prevent') {
    content = <PreventAccidentalOpen onBack={backToSettingLock} />
  } else if (view === 'setting-lock-homekit') {
    content = <HomeKitSetting onBack={backToSettingLock} />
  } else if (view === 'sound-settings') {
    content = <SoundSettings onBack={() => setHash('home')} navigate={navigateSL} />
  } else if (view === 'sound-doornotclose') {
    content = <DoorNotClose onBack={() => setHash('sound-settings')} />
  } else if (view === 'sound-abnormal') {
    content = <AbnormalPage onBack={() => setHash('sound-settings')} />
  } else if (view === 'notification-mgmt') {
    content = <NotificationManagement onBack={() => setHash('home')} navigate={navigateSL} />
  } else if (view === 'alarm-pry') {
    content = <PryAlarm onBack={backToNotification} />
  } else if (view === 'alarm-duress') {
    content = <DuressAlarm onBack={backToNotification} />
  } else if (view === 'away-scene') {
    content = <AwayScene onBack={() => setHash('home')} />
  }

  const isSettingLockView = view.startsWith('setting-lock') || view.startsWith('sound-') || view.startsWith('notification-') || view.startsWith('alarm-') || view === 'away-scene'

  return (
    <div className={`app-frame ${isClean ? 'clean' : ''}`}>
      {!isClean && (
        <>
          <div className="dev-nav">
            <button className={view === 'home' ? 'active' : ''} onClick={() => setHash('home')}>首页</button>
            <button className={view.startsWith('elec') ? 'active' : ''} onClick={() => setHash('elec')}>电量管理</button>
            <button className={view.startsWith('setting-lock') ? 'active' : ''} onClick={() => setHash('setting-lock')}>门锁设置</button>
            <button className={view.startsWith('sound-') ? 'active' : ''} onClick={() => setHash('sound-settings')}>声音和提醒</button>
            <button className={view.startsWith('notification-') || view.startsWith('alarm-') ? 'active' : ''} onClick={() => setHash('notification-mgmt')}>通知管理</button>
            <button className={view === 'away-scene' ? 'active' : ''} onClick={() => setHash('away-scene')}>离家场景</button>
          </div>
          {isSettingLockView && (
            <div className="dev-nav" style={{ marginTop: -6 }}>
              <button className={view === 'setting-lock' ? 'active' : ''} onClick={() => setHash('setting-lock')}>门锁设置主页</button>
              <button className={view === 'setting-lock-face-palm' ? 'active' : ''} onClick={() => setHash('setting-lock-face-palm')}>识别</button>
              <button className={view === 'setting-lock-prevent' ? 'active' : ''} onClick={() => setHash('setting-lock-prevent')}>防误开</button>
              <button className={view === 'setting-lock-child' ? 'active' : ''} onClick={() => setHash('setting-lock-child')}>童锁</button>
              <button className={view === 'setting-lock-reverse' ? 'active' : ''} onClick={() => setHash('setting-lock-reverse')}>反锁</button>
              <button className={view === 'setting-lock-antilock' ? 'active' : ''} onClick={() => setHash('setting-lock-antilock')}>免反锁</button>
              <button className={view === 'setting-lock-homekit' ? 'active' : ''} onClick={() => setHash('setting-lock-homekit')}>HomeKit</button>
              <button className={view === 'sound-settings' ? 'active' : ''} onClick={() => setHash('sound-settings')}>声音主页</button>
              <button className={view === 'sound-doornotclose' ? 'active' : ''} onClick={() => setHash('sound-doornotclose')}>门未关</button>
              <button className={view === 'sound-abnormal' ? 'active' : ''} onClick={() => setHash('sound-abnormal')}>其他异常</button>
              <button className={view === 'notification-mgmt' ? 'active' : ''} onClick={() => setHash('notification-mgmt')}>通知管理</button>
              <button className={view === 'alarm-pry' ? 'active' : ''} onClick={() => setHash('alarm-pry')}>防撬报警</button>
              <button className={view === 'alarm-duress' ? 'active' : ''} onClick={() => setHash('alarm-duress')}>胁迫开锁</button>
              <button className={view === 'away-scene' ? 'active' : ''} onClick={() => setHash('away-scene')}>离家场景</button>
            </div>
          )}
        </>
      )}
      {isSettingLockView ? (
        <div className="sl-layout">
          <div className="sl-layout-stage">{content}</div>
          <ConfigPanel />
        </div>
      ) : content}
    </div>
  )
}
