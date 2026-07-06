// 离家场景落地页
// PRD 依据：飞书 B2gYdlPyio4agRxVLCtcAOuRnkd（便捷体验 → 离家场景）
// Spec：wifi-lock.away-home-mode + lock.lock-action value=7/8
// 交互：默认关；开启前需通过 3 项前置校验（WiFi / 网关 / 米家场景）；开启后展示 4 步教程
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, Toast, Dialog } from './components.jsx'
import { getState, subscribe, setState } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

const STEPS = [
  { n: 1, title: '在门内正常关门', desc: '锁舌检测到关闭后进入待触发态' },
  { n: 2, title: '5 秒内按下"离家按键"', desc: '键盘区"离家按键"图标亮起 5s，逾期未按则本次不生效' },
  { n: 3, title: '进入布防模式', desc: '门锁上报 lock-action=7，联动预设米家场景（如关灯 / 关空调）' },
  { n: 4, title: '门外开门自动解除', desc: '任意方式门外开门 → 上报 lock-action=8 → 按键重新亮起' },
]

export default function AwayScene({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [dialog, setDialog] = useState(null)
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const checkPrecondition = () => {
    if (!s.awayWifiConnected) {
      return { ok: false, blocking: true, msg: '未连接网络，无法开启离家场景' }
    }
    if (!s.awayGatewayBound) {
      return { ok: false, blocking: true, msg: '未绑定蓝牙网关，无法开启离家场景' }
    }
    if (!s.awaySceneConfigured) {
      return {
        ok: true,
        blocking: false,
        msg: '未设置离家场景，无法执行场景联动。离家期间有人从室内开门，会触发通知提醒',
      }
    }
    return { ok: true, blocking: false, msg: null }
  }

  const onSwitch = (v) => {
    if (!v) {
      setState({ awayHomeMode: false })
      showToast('离家场景已关闭 (lock-action = 8)')
      return
    }
    const check = checkPrecondition()
    if (check.blocking) {
      setDialog({
        title: '无法开启',
        body: check.msg,
        buttons: [{ text: '知道了', style: 'primary', onClick: () => setDialog(null) }],
      })
      return
    }
    if (check.msg) {
      setDialog({
        title: '提醒',
        body: check.msg,
        buttons: [
          { text: '取消', onClick: () => setDialog(null) },
          {
            text: '继续开启',
            style: 'primary',
            onClick: () => {
              setDialog(null)
              setState({ awayHomeMode: true })
              showToast('离家场景已开启')
            },
          },
        ],
      })
      return
    }
    setState({ awayHomeMode: true })
    showToast('离家场景已开启')
  }

  if (!s.isOwner) {
    return (
      <div className="sl-page gradient">
        <StatusBar />
        <NavBar title="离家场景" onBack={onBack} />
        <div className="sl-scroll">
          <div className="sl-section-footer">
            离家场景仅设备主人可配置。当前为共享用户视角，入口已隐藏。
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="离家场景" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-alarm-hero">
          <div className="sl-alarm-hero-icon">🏠</div>
          <div className="sl-alarm-hero-title">一键触发离家布防</div>
          <div className="sl-alarm-hero-desc">
            关门后按门锁面板"离家按键"，同时触发 <code>lock-action = 7</code>：<br />
            ① 联动米家预设"离家场景"（关灯 / 关空调等）<br />
            ② 门锁进入布防模式，离家期间室内开门将触发告警
          </div>
          <div className="sl-alarm-owner-tag">仅设备主人可见与配置</div>
        </div>

        <Section>
          <SwitchRow
            label="离家场景"
            sub="开启后需完成一次门锁本地激活"
            value={s.awayHomeMode}
            onChange={onSwitch}
          />
        </Section>

        {s.awayHomeMode ? (
          <Section title="使用步骤">
            {STEPS.map((step) => (
              <div key={step.n} className="sl-row no-arrow">
                <div className="sl-row-text sl-user-row">
                  <div className="sl-step-badge">{step.n}</div>
                  <div>
                    <div className="sl-row-label">{step.title}</div>
                    <div className="sl-row-sub">{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </Section>
        ) : null}

        <div className="sl-section-footer">
          解除机制：门外任意方式开锁一次即解除（人脸 / 密码 / 指纹 / NFC / 蓝牙远程 / 视频远程）；室内开门不解除。语音提示默认在门外播放，音量跟随"功能设置提示音"分组。
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
