// SettingLock demo 状态管理
// 一份可订阅的模块级 state；改动通过 setState → 通知所有订阅方
// 结构对齐 miot.lock.spec：spec 存在性、Platform、Device.isOwner、custom_config 分开管
import { getPreset, MODEL_LIST, SPEC_KEYS } from './modelPresets.js'

const initialModel = MODEL_LIST[0] // 默认 m40max
const initialPreset = getPreset(initialModel)

const state = {
  // ---------- 配置层（Config 面板控制） ----------
  model: initialModel,
  platform: 'ios',            // 'ios' | 'android'
  isOwner: true,              // Device.isOwner
  batteryLevel: 'normal',     // 'normal' | 'low1' | 'low2'
  mode: 'Real-time Mode',     // door-lock-camera.mode: Real-time / Battery-saving / Super Power Saving
  showSpecBadge: false,       // 是否在每行右下角显示 spec 依赖 badge

  // spec 存在性（对齐 miot.lock.spec/plugin-generator/utils/instance-parser 的运行时解析）
  specExists: initialPreset.specExists,

  // custom_config 开关（本仓库 fallback 里没有这些 note，实际由平台下发）
  customConfig: {
    'anti-lock-unlock-permission': true,   // pages/users/utils/user-operation-data.js:686
    'disable-user-permission': true,       // 同上
  },

  // ---------- spec 值层（用户交互修改） ----------
  childLock: false,
  antiLock: false,
  doorbellOn: true,
  doorbellLightOn: true,
  homekitSwitch: false,
  homekitBindStatusSync: false,     // 门锁 spec 侧的绑定态
  isNewLockHomeKitBinded: false,    // iOS 系统侧的绑定态
  hideHomeKitRebindTip: false,
  resetWithVerificationRequired: false,
  triggeringMethod: 'Auto',
  faceUnlockSensitivity: 'Medium',
  faceUnlockSleepTime: 30,
  uwbUnlockSleepTime: 0,
  deadlockUids: [1, 2],

  // ---------- 声音和提醒相关 spec 值 ----------
  doorOperationVolume: 'Medium',       // 使用提示音量
  doorClosingReminderVolume: 'Medium', // 上锁成功提示音
  setFunctionReminder: 'On',           // 功能提示音
  doorbellRingtone: 'Classic',         // 铃声选择
  doorbellVolume: 'Medium',            // 门铃音量
  soundOption: 'Default',              // 提示音音效
  vocalType: 'Female',                 // 人声音色
  language: 'Chinese',                 // 播报语言
  doorOpenReminderVolume: 'Medium',    // 门未关提示音量
  doorOpenReminderTime: '30s',         // 门未关提示时间
  doorOpenReminderFreq: '30s',         // 再次提示间隔
  doorOpenReminderFreqSwitch: true,    // 再次提示开关
  doorNotClosedReminder: true,         // 门未关告警开关
  doorAjarReminderVolume: 'Medium',    // 门虚掩提示音量
  doorAjarReminderTime: '20s',         // 门虚掩提示时间
  doorLockBrokenReminderVolume: 'High',// 机械异常提示音量
  lowBatteryReminderSwitch: true,      // 低电量提醒开关

  // ---------- 运行时上下文 ----------
  ownerHasFingerprint: true,
  ownerHasPassword: true,
  bleConnected: true,
}

const listeners = new Set()

export function getState() {
  return state
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function setState(patch) {
  Object.assign(state, patch)
  listeners.forEach((fn) => fn(state))
}

/** 切换 model → 应用 preset */
export function applyModelPreset(model) {
  const preset = getPreset(model)
  setState({
    model,
    specExists: JSON.parse(JSON.stringify(preset.specExists)),
  })
}

/** 修改单个 spec 存在性 */
export function setSpecExists(service, property, exists) {
  const next = JSON.parse(JSON.stringify(state.specExists))
  if (!next[service]) next[service] = {}
  next[service][property] = exists
  setState({ specExists: next })
}

/** 修改 custom_config note */
export function setCustomConfig(note, value) {
  setState({ customConfig: { ...state.customConfig, [note]: value } })
}

/** 便捷读取：spec 是否存在 */
export function hasSpec(service, property) {
  return !!state.specExists?.[service]?.[property]
}

/** UWB 是否因电量/模式置灰
 *  对齐 miot.lock.spec/5max/pages/settings/settingLock/index.js:54-62 的 isUwbDisabledByMode */
export function isUwbDisabledByMode(s = state) {
  const inSavingMode = s.mode === 'Battery-saving Mode' || s.mode === 'Super Power Saving Mode'
  const isLow2 = s.batteryLevel === 'low2'
  return inSavingMode || isLow2
}

export { SPEC_KEYS }

// ---------- 家人列表（免反锁家人页用） ----------
// 头像 URL 来自 miot.lock.spec/resources/images.js 硬编码的生产 CDN
const CDN = 'https://cdn.cnbj0.fds.api.mi-img.com/miio.files/resource_package'
export const LOCK_USERS = [
  { uid: 0, name: '张先生', avatar: `${CDN}/20260317162311_lock_male_owner_male_owner.png`, isOwner: true },
  { uid: 1, name: '李女士', avatar: `${CDN}/20260317163035_lock_female_owner_female_owner.png` },
  { uid: 2, name: '小张', avatar: `${CDN}/20260317163139_lock_baby_baby.png` },
  { uid: 3, name: '爷爷', avatar: `${CDN}/20260317163417_lock_grandfather_grandfather.png` },
  { uid: 4, name: '奶奶', avatar: `${CDN}/20260317163445_lock_grandmother_grandmother.png` },
  { uid: 5, name: '哥哥', avatar: `${CDN}/20260317163214_lock_elder_brother_elder_brother.png` },
]

// HomeKit banner（硬编码 URL，homeKitSetting.js:230）
export const HOMEKIT_BANNER_URL =
  'https://cdn.cnbj0.fds.api.mi-img.com/miio.files/resource_package/20251125154233_lock_homekit_Homekit.png'
