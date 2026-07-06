// 胁迫开锁报警落地页
// PRD 依据：飞书 B7wKdkEY4ocVX6xI8L9c1s3Xnje 3.2.5 f 紧急电话通知 → 胁迫开锁报警
// 原文交互：默认未开启；文案 "未开启 / X 位家人已开启"；UE 稿 TBC
// 落地策略：按家人钥匙维度多选（此处 demo 呈现 UE 稿的一种可行草案，实际以设计交付为准）
import { useEffect, useState } from 'react'
import {
  StatusBar, NavBar, Section, SwitchRow, NavigationRow, Toast, Dialog, IosSwitch,
} from './components.jsx'
import { getState, subscribe, setState, LOCK_USERS } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function DuressAlarm({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [dialog, setDialog] = useState(null)
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const enabled = s.notifyDuressAlarm
  const enabledSet = new Set(s.duressEnabledUsers)

  const onSwitch = (v) => {
    if (v && !s.emergencyContact) {
      setDialog({
        title: '开启胁迫开锁报警',
        body: '开启后，家人使用胁迫指纹开锁时会拨打您预设的紧急联系人电话。请先设置联系人。',
        buttons: [
          { text: '取消', onClick: () => setDialog(null) },
          {
            text: '去设置',
            style: 'primary',
            onClick: () => {
              setDialog(null)
              setState({
                emergencyContact: { name: '张先生', phone: '138****8888' },
                notifyDuressAlarm: true,
              })
              showToast('紧急联系人已设置')
            },
          },
        ],
      })
      return
    }
    setState({ notifyDuressAlarm: v })
    if (!v) setState({ duressEnabledUsers: [] })
    showToast(v ? '胁迫开锁报警已开启' : '胁迫开锁报警已关闭')
  }

  const toggleUser = (uid) => {
    if (!enabled) {
      showToast('请先开启胁迫开锁报警')
      return
    }
    const next = new Set(enabledSet)
    if (next.has(uid)) next.delete(uid)
    else next.add(uid)
    setState({ duressEnabledUsers: Array.from(next) })
  }

  const contactValue = s.emergencyContact
    ? `${s.emergencyContact.name} ${s.emergencyContact.phone}`
    : '未设置'

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="胁迫开锁报警" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-alarm-hero">
          <div className="sl-alarm-hero-icon">🆘</div>
          <div className="sl-alarm-hero-title">胁迫时静默报警</div>
          <div className="sl-alarm-hero-desc">
            家人使用预设的胁迫指纹开锁时，门锁在正常开门的同时静默拨打紧急联系人电话并上报事件，不会向胁迫者暴露报警行为。
          </div>
          <div className="sl-alarm-owner-tag">仅设备主人可见与配置</div>
        </div>

        <Section>
          <SwitchRow
            label="胁迫开锁报警"
            value={enabled}
            onChange={onSwitch}
          />
        </Section>

        <Section title="紧急联系人">
          <NavigationRow
            label="联系电话"
            value={contactValue}
            disabled={!enabled}
            onClick={() => showToast('生产环境跳转米家通用联系人页')}
          />
        </Section>

        <Section title="已启用胁迫指纹的家人">
          {LOCK_USERS.map((u) => (
            <div key={u.uid} className={`sl-row no-arrow ${!enabled ? 'disabled' : ''}`}>
              <div className="sl-row-text sl-user-row">
                <img className="sl-user-avatar-img" src={u.avatar} alt="" />
                <div>
                  <div className="sl-row-label">
                    {u.name}{u.isOwner ? <span className="sl-owner-badge">主人</span> : null}
                  </div>
                  <div className="sl-row-sub">胁迫指纹 · 未录入（演示态）</div>
                </div>
              </div>
              <IosSwitch
                on={enabledSet.has(u.uid)}
                onChange={() => toggleUser(u.uid)}
                disabled={!enabled}
              />
            </div>
          ))}
        </Section>

        <div className="sl-section-footer">
          告警时长 10 分钟，音量默认高（85 - 110dB 距音腔 10cm），任意开锁方式即可解除。静默模式：现场无声光提示，仅在后台上报事件并拨打电话。落地页 UE 稿以设计交付为准（原文标注 TBC）。
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
