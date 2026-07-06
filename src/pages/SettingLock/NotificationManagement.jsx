// 通知管理主页
// 对应生产：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/notificationManagement/index.js
// 结构：系统通知（占位）+ 紧急事件电话通知（本次 PRD 核心：3 行入口，其中门锁被撬 / 胁迫开锁走本 demo）
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, NavigationRow, Toast } from './components.jsx'
import { getState, subscribe, setState } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function NotificationManagement({ onBack, navigate }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const duressLabel = s.notifyDuressAlarm && s.duressEnabledUsers.length > 0
    ? `${s.duressEnabledUsers.length}位家人已开启`
    : '未开启'
  const pryLabel = s.notifyPryAlarm ? '已开启' : '未开启'
  const highTempLabel = s.notifyHighTempAlarm ? '已开启' : '未开启'

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="通知管理" onBack={onBack} />

      <div className="sl-scroll">
        <Section title="系统通知">
          <SwitchRow
            label="允许通知"
            value={true}
            onChange={() => showToast('演示态：请在生产环境操作')}
          />
          <NavigationRow
            label="开门通知"
            value="已开启"
            onClick={() => showToast('占位：详见 PRD 3.2.5 f')}
          />
          <NavigationRow
            label="关门通知"
            value="已开启"
            onClick={() => showToast('占位：详见 PRD 3.2.5 f')}
          />
          <NavigationRow
            label="自定义通知"
            value="全部开启"
            onClick={() => showToast('占位：详见 PRD 3.2.5 f')}
          />
        </Section>

        {s.isOwner ? (
          <>
            <Section title="紧急事件电话通知">
              <NavigationRow
                label="室内高温报警"
                sub="室内温度达到 75℃ 时拨打预设电话"
                value={highTempLabel}
                onClick={() => showToast('占位：非本次 PRD 范围')}
              />
              <NavigationRow
                label="门锁被撬报警"
                sub="abnormal-condition = 9 时拨打预设报警电话"
                value={pryLabel}
                onClick={() => navigate('alarm-pry')}
              />
              <NavigationRow
                label="胁迫开锁报警"
                sub="家人使用胁迫指纹开锁时拨打紧急联系人"
                value={duressLabel}
                onClick={() => navigate('alarm-duress')}
              />
            </Section>

            <div className="sl-section-footer">
              开启后，事件发生时会自动拨打预设的紧急联系人电话进行通知。功能实现需门锁在线并完成云端配置。仅设备主人可配置。
            </div>
          </>
        ) : (
          <div className="sl-section-footer">
            紧急事件电话通知（室内高温 / 门锁被撬 / 胁迫开锁）仅设备主人可配置。当前为共享用户视角，入口已隐藏。
          </div>
        )}
      </div>

      <Toast msg={toast} />
    </div>
  )
}
