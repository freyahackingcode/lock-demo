// 门未关告警落地页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/settingLockVoice/doorNotClose.js
// 主开关 doorNotClosedReminder；开启后展开 4 个子设置（提示音量/时间/再次提示）
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

const TIME_OPTIONS = [
  { value: '10s', label: '10 秒' },
  { value: '30s', label: '30 秒' },
  { value: '1min', label: '1 分钟' },
  { value: '3min', label: '3 分钟' },
]
const TIME_TEXT = { '10s': '10 秒', '30s': '30 秒', '1min': '1 分钟', '3min': '3 分钟' }

const FREQ_OPTIONS = [
  { value: '30s', label: '30 秒' },
  { value: '1min', label: '1 分钟' },
  { value: '3min', label: '3 分钟' },
  { value: 'Off', label: '关闭' },
]
const FREQ_TEXT = { '30s': '30 秒', '1min': '1 分钟', '3min': '3 分钟', Off: '关闭' }

export default function DoorNotClose({ onBack }) {
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

  const onSwitchChange = (v) => {
    setState({ doorNotClosedReminder: v })
    showToast('设置成功')
  }

  const showBadge = s.showSpecBadge
  const badge = (deps, extra) => showBadge ? <SpecBadge deps={deps} extra={extra} /> : null

  const showVolume = hasSpec('lockVolumeManagement', 'doorOpenReminderVolume')
  const showTime = hasSpec('lockVolumeManagement', 'doorOpenReminderTime')
  const useFreqSwitch = hasSpec('lock', 'doorOpenReminderFreqSwitch')
  const useFreqDropdown = !useFreqSwitch && hasSpec('lock', 'doorOpenReminderFreq')
  const showFreq = useFreqSwitch || useFreqDropdown

  const expanded = s.doorNotClosedReminder && (showVolume || showTime || showFreq)

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="门未关告警" onBack={onBack} />

      <div className="sl-scroll">
        <Section>
          <SwitchRow
            label={<>门未关{badge(['lockVolumeManagement.doorNotClosedReminder'])}</>}
            value={s.doorNotClosedReminder}
            onChange={onSwitchChange}
          />
        </Section>

        {expanded ? (
          <Section title="提示音设置">
            {showVolume ? (
              <div className="sl-row" onClick={() => openSheet('doorOpenReminderVolume', VOLUME_OPTIONS, s.doorOpenReminderVolume, '提示音量')}>
                <div className="sl-row-text">
                  <div className="sl-row-label">提示音量</div>
                  {badge(['lockVolumeManagement.doorOpenReminderVolume'])}
                </div>
                <div className="sl-row-value">
                  <span>{VOLUME_TEXT[s.doorOpenReminderVolume]}</span>
                  <ArrowDown />
                </div>
              </div>
            ) : null}
            {showTime ? (
              <div className="sl-row" onClick={() => openSheet('doorOpenReminderTime', TIME_OPTIONS, s.doorOpenReminderTime, '提示时间')}>
                <div className="sl-row-text">
                  <div className="sl-row-label">提示时间</div>
                  {badge(['lockVolumeManagement.doorOpenReminderTime'])}
                </div>
                <div className="sl-row-value">
                  <span>{TIME_TEXT[s.doorOpenReminderTime]}</span>
                  <ArrowDown />
                </div>
              </div>
            ) : null}
            {useFreqSwitch ? (
              <SwitchRow
                label={<>再次提示{badge(['lock.doorOpenReminderFreqSwitch'])}</>}
                value={s.doorOpenReminderFreqSwitch}
                onChange={(v) => { setState({ doorOpenReminderFreqSwitch: v }); showToast('设置成功') }}
              />
            ) : useFreqDropdown ? (
              <div className="sl-row" onClick={() => openSheet('doorOpenReminderFreq', FREQ_OPTIONS, s.doorOpenReminderFreq, '再次提示')}>
                <div className="sl-row-text">
                  <div className="sl-row-label">再次提示</div>
                  <div className="sl-row-sub">未关状态下每隔一段时间再次提示</div>
                  {badge(['lock.doorOpenReminderFreq'])}
                </div>
                <div className="sl-row-value">
                  <span>{FREQ_TEXT[s.doorOpenReminderFreq]}</span>
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
