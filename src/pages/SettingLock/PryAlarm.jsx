// 防撬报警落地页（门锁被撬告警）
// PRD 依据：飞书 B7wKdkEY4ocVX6xI8L9c1s3Xnje 3.2.5 f 通知管理 → 紧急电话通知 → 防撬报警
// 交互：默认关；开关关闭时"联系电话-去设置"置灰；开启后可点击去设置紧急联系人
// 共用规则：立即告警 · 时长 10min · 音量默认高 · 静音时事件仍上报 · 任意开锁解除
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, NavigationRow, Toast, Dialog } from './components.jsx'
import { getState, subscribe, setState } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function PryAlarm({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [dialog, setDialog] = useState(null)
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const onSwitch = (v) => {
    if (v && !s.emergencyContact) {
      setDialog({
        title: '开启防撬报警',
        body: '开启后，门锁被撬时会拨打您预设的紧急联系人电话。请先设置联系人。',
        buttons: [
          { text: '取消', onClick: () => setDialog(null) },
          {
            text: '去设置',
            style: 'primary',
            onClick: () => {
              setDialog(null)
              onSetContact()
            },
          },
        ],
      })
      return
    }
    setState({ notifyPryAlarm: v })
    showToast(v ? '防撬报警已开启' : '防撬报警已关闭')
  }

  const onSetContact = () => {
    // 生产环境跳米家 App 通用联系人页；demo 内直接 mock 一位联系人
    setState({
      emergencyContact: { name: '张先生', phone: '138****8888' },
      notifyPryAlarm: true,
    })
    showToast('紧急联系人已设置')
  }

  const contactValue = s.emergencyContact
    ? `${s.emergencyContact.name} ${s.emergencyContact.phone}`
    : '未设置'

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="防撬报警" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-alarm-hero">
          <div className="sl-alarm-hero-icon">⚠️</div>
          <div className="sl-alarm-hero-title">门锁被撬时立即报警</div>
          <div className="sl-alarm-hero-desc">
            门锁上报 <code>lock.exception-occurred</code> 事件、<code>abnormal-condition = 9</code>（Door Lock Was Damaged）时，云端拨打预设的紧急联系人电话，同时警报声响起并上报事件。功能实现需云端配置。
          </div>
        </div>

        <Section>
          <SwitchRow
            label="防撬报警"
            value={s.notifyPryAlarm}
            onChange={onSwitch}
          />
        </Section>

        <Section title="紧急联系人">
          <NavigationRow
            label="联系电话"
            value={contactValue}
            disabled={!s.notifyPryAlarm}
            onClick={onSetContact}
          />
        </Section>

        <div className="sl-section-footer">
          告警时长 10 分钟，音量默认高（85 - 110dB 距音腔 10cm），任意开锁方式即可解除。静音时事件仍会上报。以上参数均不可修改。
        </div>
      </div>

      <Dialog
        open={dialog != null}
        title={dialog?.title}
        body={dialog?.body}
        buttons={dialog?.buttons || []}
      />
      <Toast msg={toast} />
    </div>
  )
}
