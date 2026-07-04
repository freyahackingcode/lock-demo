// 声音和提醒主页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/settingLockVoice/index.js
// 4 个 section + 底部勿扰模式提示
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, NavigationRow, NavigationOnOffRow, Toast, OptionSheet } from './components.jsx'
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

const RINGTONE_OPTIONS = [
  { value: 'Classic', label: '经典门铃' },
  { value: 'DingDong', label: '叮咚' },
  { value: 'Melody', label: '轻快旋律' },
  { value: 'Chime', label: '风铃' },
]
const RINGTONE_TEXT = { Classic: '经典门铃', DingDong: '叮咚', Melody: '轻快旋律', Chime: '风铃' }

const FUNCTION_REMINDER_OPTIONS = [
  { value: 'Off', label: '关闭' },
  { value: 'On', label: '开启' },
]
const FUNCTION_REMINDER_TEXT = { Off: '关闭', On: '开启' }

const SOUND_OPTIONS = [
  { value: 'Default', label: '默认' },
  { value: 'Retro', label: '复古' },
  { value: 'Warm', label: '温暖' },
]
const SOUND_TEXT = { Default: '默认', Retro: '复古', Warm: '温暖' }

const VOCAL_OPTIONS = [
  { value: 'Female', label: '女声' },
  { value: 'Male', label: '男声' },
]
const VOCAL_TEXT = { Female: '女声', Male: '男声' }

const LANGUAGE_OPTIONS = [
  { value: 'Chinese', label: '中文' },
  { value: 'English', label: 'English' },
  { value: 'Cantonese', label: '粤语' },
]
const LANGUAGE_TEXT = { Chinese: '中文', English: 'English', Cantonese: '粤语' }

export default function SoundSettings({ onBack, navigate }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [sheet, setSheet] = useState(null) // {key, options, value, title, mapTo}

  const showToast = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  const openSheet = (key, options, value, title) => setSheet({ key, options, value, title })

  const onSelect = (v) => {
    if (!sheet) return
    // 特殊：语言切 English 时，音色只支持女声
    if (sheet.key === 'language' && v === 'English' && s.vocalType !== 'Female') {
      setState({ language: v, vocalType: 'Female' })
      showToast('英文仅支持女声音色')
    } else {
      setState({ [sheet.key]: v })
      showToast('设置成功')
    }
    setSheet(null)
  }

  const showBadge = s.showSpecBadge
  const badge = (deps, extra) => showBadge ? <SpecBadge deps={deps} extra={extra} /> : null

  // ---------- 异常提醒 ----------
  const abnormalSpecs = [
    hasSpec('lockVolumeManagement', 'doorNotClosedReminder'),
    hasSpec('lockVolumeManagement', 'doorAjarReminderVolume'),
    hasSpec('lockVolumeManagement', 'doorAjarReminderTime'),
    hasSpec('lockVolumeManagement', 'doorLockBrokenReminderVolume'),
  ].some(Boolean)
  const showDoorNotClosed = hasSpec('lockVolumeManagement', 'doorNotClosedReminder')
  // "其他异常"入口无 spec 绑定，只要 section 显示就渲染
  const showOtherAbnormal = abnormalSpecs

  // ---------- 使用提示音 ----------
  const showAlertVolume = hasSpec('lockVolumeManagement', 'doorOperationVolume')
  const showLockSuccessTone = hasSpec('lockVolumeManagement', 'doorClosingReminderVolume')
  const showFuncReminder = hasSpec('lockVolumeManagement', 'setFunctionReminder')

  // ---------- 门铃 ----------
  const showRingtone = hasSpec('wifiDoorbell', 'ringtone')
  const showDoorbellVolume = hasSpec('wifiDoorbell', 'volume')

  // ---------- 音效与音色 ----------
  const showSoundOption = hasSpec('lock', 'soundOption')
  const showVocal = hasSpec('lock', 'vocalType')
  const showLanguage = hasSpec('lockVolumeManagement', 'language')

  const isEnglish = s.language === 'English'

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="声音和提醒" onBack={onBack} />

      <div className="sl-scroll">
        {/* 异常提醒 */}
        {abnormalSpecs ? (
          <Section title="异常提醒">
            {showDoorNotClosed ? (
              <NavigationOnOffRow
                label={<>门未关告警{badge(['lockVolumeManagement.doorNotClosedReminder'])}</>}
                on={s.doorNotClosedReminder}
                onClick={() => navigate('sound-doornotclose')}
              />
            ) : null}
            {showOtherAbnormal ? (
              <NavigationRow
                label="其他异常"
                sub="门虚掩、低电量等"
                onClick={() => navigate('sound-abnormal')}
              />
            ) : null}
          </Section>
        ) : null}

        {/* 使用提示音 */}
        <Section title="使用提示音">
          {showAlertVolume ? (
            <div className="sl-row" onClick={() => openSheet('doorOperationVolume', VOLUME_OPTIONS, s.doorOperationVolume, '使用提示音量')}>
              <div className="sl-row-text">
                <div className="sl-row-label">使用提示音量</div>
                <div className="sl-row-sub">按键音、开锁音和设置成功提示音等</div>
                {badge(['lockVolumeManagement.doorOperationVolume'])}
              </div>
              <div className="sl-row-value">
                <span>{VOLUME_TEXT[s.doorOperationVolume]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
          {showLockSuccessTone ? (
            <div className="sl-row" onClick={() => openSheet('doorClosingReminderVolume', VOLUME_OPTIONS, s.doorClosingReminderVolume, '上锁成功提示音')}>
              <div className="sl-row-text">
                <div className="sl-row-label">上锁成功提示音</div>
                {badge(['lockVolumeManagement.doorClosingReminderVolume'])}
              </div>
              <div className="sl-row-value">
                <span>{VOLUME_TEXT[s.doorClosingReminderVolume]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
          {showFuncReminder ? (
            <div className="sl-row" onClick={() => openSheet('setFunctionReminder', FUNCTION_REMINDER_OPTIONS, s.setFunctionReminder, '功能设置提示音')}>
              <div className="sl-row-text">
                <div className="sl-row-label">功能设置提示音</div>
                <div className="sl-row-sub">童锁与反锁，钥匙添加与验证</div>
                {badge(['lockVolumeManagement.setFunctionReminder'], 'custom_config 下发')}
              </div>
              <div className="sl-row-value">
                <span>{FUNCTION_REMINDER_TEXT[s.setFunctionReminder]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
        </Section>

        {/* 门铃 */}
        <Section title="门铃">
          {showRingtone ? (
            <div className="sl-row" onClick={() => openSheet('doorbellRingtone', RINGTONE_OPTIONS, s.doorbellRingtone, '铃声选择')}>
              <div className="sl-row-text">
                <div className="sl-row-label">铃声选择</div>
                {badge(['wifiDoorbell.ringtone'])}
              </div>
              <div className="sl-row-value">
                <span>{RINGTONE_TEXT[s.doorbellRingtone]}</span>
                <ArrowRight />
              </div>
            </div>
          ) : null}
          {showDoorbellVolume ? (
            <div className="sl-row" onClick={() => openSheet('doorbellVolume', VOLUME_OPTIONS, s.doorbellVolume, '门铃音量')}>
              <div className="sl-row-text">
                <div className="sl-row-label">门铃音量</div>
                {badge(['wifiDoorbell.volume'])}
              </div>
              <div className="sl-row-value">
                <span>{VOLUME_TEXT[s.doorbellVolume]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
        </Section>

        {/* 音效与音色 */}
        <Section title="音效与音色">
          {showSoundOption ? (
            <div className="sl-row" onClick={() => openSheet('soundOption', SOUND_OPTIONS, s.soundOption, '提示音音效')}>
              <div className="sl-row-text">
                <div className="sl-row-label">提示音音效</div>
                <div className="sl-row-sub">验证成功、失败等音效</div>
                {badge(['lock.soundOption'])}
              </div>
              <div className="sl-row-value">
                <span>{SOUND_TEXT[s.soundOption]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
          {showVocal ? (
            <div
              className={`sl-row ${isEnglish ? 'disabled' : ''}`}
              onClick={() => {
                if (isEnglish) {
                  showToast('英文仅支持女声音色')
                  return
                }
                openSheet('vocalType', VOCAL_OPTIONS, s.vocalType, '人声音色')
              }}
            >
              <div className="sl-row-text">
                <div className="sl-row-label">人声音色</div>
                {badge(['lock.vocalType'], isEnglish ? 'English → 强制女声' : null)}
              </div>
              <div className="sl-row-value">
                <span>{VOCAL_TEXT[s.vocalType]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
          {showLanguage ? (
            <div className="sl-row" onClick={() => openSheet('language', LANGUAGE_OPTIONS, s.language, '播报语言')}>
              <div className="sl-row-text">
                <div className="sl-row-label">播报语言</div>
                {badge(['lockVolumeManagement.language'])}
              </div>
              <div className="sl-row-value">
                <span>{LANGUAGE_TEXT[s.language]}</span>
                <ArrowDown />
              </div>
            </div>
          ) : null}
        </Section>

        {/* 勿扰模式底部提示（生产代码中受 getSettingsDoNotDisturbModeConfig().banner 存在性控制） */}
        <div className="sl-disturb-hint">
          <div className="sl-disturb-title">若希望指定时间段自动降低音量，可前往设置勿扰模式</div>
          <div className="sl-disturb-link" onClick={() => showToast('跳转勿扰模式设置（略）')}>
            <span>设置勿扰模式</span>
            <ArrowRight />
          </div>
        </div>
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
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 3.5L9 7L5.5 10.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
