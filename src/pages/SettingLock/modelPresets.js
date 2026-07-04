// Model preset：每个 model 的默认 spec 存在性 + 配置
// 数据依据尽量来自 miot.lock.spec 生产代码；无证据的项目标注 '?'
// 用户在 Config 面板里可以随时手动改，preset 只是快速起点

// 覆盖两个模块所有 property：settingLock + settingLockVoice
export const SPEC_KEYS = {
  lock: [
    // settingLock
    'homekitSwitch',
    'homekitBindStatusSync',
    'uwbSwitch',
    'childLock',
    'antiLock',
    'faceRecognitionUnlockingSwitch',
    'palmVeinRecognitionUnlockingSwitch',
    'triggeringMethod',
    'faceUnlockSensitivity',
    'faceUnlockSleepTime',
    'uwbUnlockSleepTime',
    'resetWithVerificationRequiredSetting',
    // settingLockVoice
    'vocalType',
    'soundOption',
    'doorOpenReminderFreq',
    'doorOpenReminderFreqSwitch',
  ],
  wifiDoorbell: [
    // settingLock
    'on',
    'doorbellLightOn',
    // settingLockVoice
    'ringtone',
    'volume',
  ],
  lockManage: ['operationMethod', 'userDeadboltPermission'],
  lockVolumeManagement: [
    'doorOperationVolume',
    'language',
    'doorClosingReminderVolume',
    'setFunctionReminder',
    'doorOpenReminderVolume',
    'doorOpenReminderTime',
    'doorNotClosedReminder',
    'doorAjarReminderVolume',
    'doorAjarReminderTime',
    'doorLockBrokenReminderVolume',
    'lowBatteryReminderSwitch',
  ],
}

// 全量默认存在（用于"典型 5Max"起点）
const ALL_TRUE = () => {
  const s = {}
  Object.entries(SPEC_KEYS).forEach(([svc, props]) => {
    s[svc] = {}
    props.forEach((p) => { s[svc][p] = true })
  })
  return s
}

// 9 个 5max model 的 preset
// verified 字段列举"代码里有直接证据"的差异；其他 spec 默认全部 true（大概率 5max 都有）
export const MODEL_PRESETS = {
  'xiaomi.lock.m40max': {
    label: 'Xiaomi 智能门锁 M40 Max（5Max 旗舰）',
    specExists: (() => {
      const s = ALL_TRUE()
      s.lock.homekitSwitch = false          // 5Max 无 HomeKit 入口，见 doc/modules/settings.md
      s.lock.homekitBindStatusSync = false
      return s
    })(),
    verified: {
      'lock.homekitSwitch=false': 'doc/modules/settings.md § 5Max 差异标注：无 Homekit 设置入口',
    },
    unverified: '其他 spec 均按"典型 5Max"预置为 true，需真机核对',
  },
  'xiaomi.lock.m40': {
    label: 'Xiaomi 智能门锁 M40（5Max 双摄）',
    specExists: (() => {
      const s = ALL_TRUE()
      s.lock.homekitSwitch = false
      s.lock.homekitBindStatusSync = false
      return s
    })(),
    verified: {
      'lock.homekitSwitch=false': 'doc/modules/settings.md § 5Max 差异标注',
    },
    unverified: '其他 spec 均待真机核对',
  },
  'xiaomi.lock.4cs': {
    label: 'Xiaomi 智能门锁 4CS',
    specExists: ALL_TRUE(),
    verified: {},
    unverified: '全部 spec 待真机核对',
  },
  'xiaomi.lock.5s': {
    label: 'Xiaomi 智能门锁 5S',
    specExists: (() => {
      const s = ALL_TRUE()
      // 5s 家族纯干电，UWB / 摄像头相关 spec 通常不上报
      s.lock.uwbSwitch = false
      s.lock.uwbUnlockSleepTime = false
      s.lock.faceRecognitionUnlockingSwitch = false
      s.lock.palmVeinRecognitionUnlockingSwitch = false
      s.lock.faceUnlockSensitivity = false
      s.lock.faceUnlockSleepTime = false
      s.lock.triggeringMethod = false
      s.wifiDoorbell.on = false
      s.wifiDoorbell.doorbellLightOn = false
      s.lock.homekitSwitch = false
      s.lock.homekitBindStatusSync = false
      return s
    })(),
    verified: {
      '纯干电机型': 'hooks/index.js:418 注释提到 xiaomi.lock.5s 是纯干电',
    },
    unverified: 'UWB/摄像头/门铃相关 spec 的推断需真机核对',
  },
  'xiaomi.lock.5s1': {
    label: 'Xiaomi 智能门锁 5S 系列',
    specExists: (() => {
      const s = ALL_TRUE()
      s.lock.uwbSwitch = false
      s.lock.uwbUnlockSleepTime = false
      s.lock.faceRecognitionUnlockingSwitch = false
      s.lock.palmVeinRecognitionUnlockingSwitch = false
      s.lock.faceUnlockSensitivity = false
      s.lock.faceUnlockSleepTime = false
      s.lock.triggeringMethod = false
      s.wifiDoorbell.on = false
      s.wifiDoorbell.doorbellLightOn = false
      s.lock.homekitSwitch = false
      s.lock.homekitBindStatusSync = false
      return s
    })(),
    verified: {},
    unverified: '5s 家族按 5s 类推，待真机核对',
  },
  'xiaomi.lock.5s2': {
    label: 'Xiaomi 智能门锁 5S 系列',
    specExists: (() => {
      const s = ALL_TRUE()
      s.lock.uwbSwitch = false
      s.lock.uwbUnlockSleepTime = false
      s.lock.faceRecognitionUnlockingSwitch = false
      s.lock.palmVeinRecognitionUnlockingSwitch = false
      s.lock.faceUnlockSensitivity = false
      s.lock.faceUnlockSleepTime = false
      s.lock.triggeringMethod = false
      s.wifiDoorbell.on = false
      s.wifiDoorbell.doorbellLightOn = false
      s.lock.homekitSwitch = false
      s.lock.homekitBindStatusSync = false
      return s
    })(),
    verified: {},
    unverified: '5s 家族按 5s 类推，待真机核对',
  },
  'xiaomi.lock.5s3': {
    label: 'Xiaomi 智能门锁 5S 系列',
    specExists: (() => {
      const s = ALL_TRUE()
      s.lock.uwbSwitch = false
      s.lock.uwbUnlockSleepTime = false
      s.lock.faceRecognitionUnlockingSwitch = false
      s.lock.palmVeinRecognitionUnlockingSwitch = false
      s.lock.faceUnlockSensitivity = false
      s.lock.faceUnlockSleepTime = false
      s.lock.triggeringMethod = false
      s.wifiDoorbell.on = false
      s.wifiDoorbell.doorbellLightOn = false
      s.lock.homekitSwitch = false
      s.lock.homekitBindStatusSync = false
      return s
    })(),
    verified: {},
    unverified: '5s 家族按 5s 类推，待真机核对',
  },
  'xiaomi.lock.5pro': {
    label: 'Xiaomi 智能门锁 5 Pro',
    specExists: (() => {
      const s = ALL_TRUE()
      // 单摄，无双摄相关；其他大部分保持 true 待核实
      return s
    })(),
    verified: {},
    unverified: '全部 spec 待真机核对',
  },
  'xiaomi.lock.5pro2': {
    label: 'Xiaomi 智能门锁 5 Pro 2',
    specExists: ALL_TRUE(),
    verified: {},
    unverified: '全部 spec 待真机核对',
  },
}

export const MODEL_LIST = Object.keys(MODEL_PRESETS)

export function getPreset(model) {
  return MODEL_PRESETS[model] || MODEL_PRESETS['xiaomi.lock.m40max']
}
