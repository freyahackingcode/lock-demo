// 其他异常落地页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/settingLockVoice/abnormalPage.js
// 两个 section：门虚掩 / 更多异常（低电量提醒 + 机械异常）
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, Toast, OptionSheet } from './components.jsx'
import { getState, setState, subscribe, hasSpec } from './store.js'
import SpecBadge from './SpecBadge.jsx'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

const VOLUME_OPTIONS = [
  { value: 'Silent', label: '静音' },
  { value: 'Low', label: '低' },
  { value: 'Medium', label: '中' },
  { value: 'High', label: '高' },
]
const VOLUME_TEXT = { Silent: '静音', Low: '低', Medium: '中', High: '高' }
const AJAR_TIME_TEXT = { '10s': '10 秒', '20s': '20 秒', '30s': '30 秒' }

export default function AbnormalPage({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [sheet, setSheet] = useState(null)

  const showToast = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }
  const openSheet = (key, options, value, title) => setSheet({ key, options, value, title })
  const onSelect = (v) => {
    setState({ [sheet.key]: v })
    setSheet(null)
    showToast('设置成功')
  }

  const showBadge = s.showSpecBadge
  const badge = (deps, extra) => showBadge ? <SpecBadge deps={deps} extra={extra} /> : null

  const ajarSpecs = hasSpec('lockVolumeManagement', 'doorAjarReminderVolume')
    || hasSpec('lockVolumeManagement', 'doorAjarReminderTime')
  const showAjarVolume = hasSpec('lockVolumeManagement', 'doorAjarReminderVolume')
  const showAjarTime = hasSpec('lockVolumeManagement', 'doorAjarReminderTime')

  // "更多异常" section 显隐条件 (abnormalPage.js:57 传入 ['', specDoorLockBrokenReminderVolume]，第一个占位，
  // 实际显示条件 = doorLockBrokenReminderVolume 存在)
  const showMore = hasSpec('lockVolumeManagement', 'doorLockBrokenReminderVolume')
  const showLowBattery = hasSpec('lockVolumeManagement', 'lowBatteryReminderSwitch')
  const showLockBroken = hasSpec('lockVolumeManagement', 'doorLockBrokenReminderVolume')

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="其他异常" onBack={onBack} />

      <div className="sl-scroll">
        {ajarSpecs ? (
          <Section title="门虚掩">
            {showAjarVolume ? (
              <div className="sl-row" onClick={() => openSheet('doorAjarReminderVolume', VOLUME_OPTIONS, s.doorAjarReminderVolume, '提示音量')}>
                <div className="sl-row-text">
                  <div className="sl-row-label">提示音量</div>
                  {badge(['lockVolumeManagement.doorAjarReminderVolume'])}
                </div>
                <div className="sl-row-value">
                  <span>{VOLUME_TEXT[s.doorAjarReminderVolume]}</span>
                  <ArrowDown />
                </div>
              </div>
            ) : null}
            {showAjarTime ? (
              <div className="sl-row no-arrow">
                <div className="sl-row-text">
                  <div className="sl-row-label">提示时间</div>
                  {badge(['lockVolumeManagement.doorAjarReminderTime'])}
                </div>
                <div className="sl-row-value">
                  <span>{AJAR_TIME_TEXT[s.doorAjarReminderTime] || s.doorAjarReminderTime}</span>
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}

        {showMore ? (
          <Section title="更多异常">
            {showLowBattery ? (
              <SwitchRow
                label={<>低电量提示音{badge(['lockVolumeManagement.lowBatteryReminderSwitch'])}</>}
                sub="功能关闭后，电量即将耗尽时仍会提醒"
                value={s.lowBatteryReminderSwitch}
                onChange={(v) => { setState({ lowBatteryReminderSwitch: v }); showToast('设置成功') }}
              />
            ) : null}
            {showLockBroken ? (
              <div className="sl-row" onClick={() => openSheet('doorLockBrokenReminderVolume', VOLUME_OPTIONS, s.doorLockBrokenReminderVolume, '门锁异常提示音')}>
                <div className="sl-row-text">
                  <div className="sl-row-label">门锁异常提示音</div>
                  <div className="sl-row-sub">门锁被撬、开门异常和关门异常等</div>
                  {badge(['lockVolumeManagement.doorLockBrokenReminderVolume'])}
                </div>
                <div className="sl-row-value">
                  <span>{VOLUME_TEXT[s.doorLockBrokenReminderVolume]}</span>
                  <ArrowDown />
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}
      </div>

      <OptionSheet
        open={sheet != null}
        title={sheet?.title}
        options={sheet?.options || []}
        value={sheet?.value}
        onSelect={onSelect}
        onCancel={() => setSheet(null)}
      />

      <Toast msg={toast} />
    </div>
  )
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 5.5L7 9L10.5 5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
