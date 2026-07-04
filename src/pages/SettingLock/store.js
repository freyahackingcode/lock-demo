// 简易状态共享（模拟 spec 全局态）
// 页面间跳转时使用 hash 路由，状态用模块级变量 + 订阅通知

const state = {
  childLock: false,
  antiLock: false,
  doorbellOn: true,
  doorbellLightOn: true,
  homekitSwitch: false,
  homekitBindStatusSync: false,       // 门锁 spec 侧的绑定态
  isNewLockHomeKitBinded: false,      // iOS 系统侧的绑定态
  hideHomeKitRebindTip: false,
  resetWithVerificationRequired: false,
  triggeringMethod: 'Auto',           // Auto | Manual
  faceUnlockSensitivity: 'Medium',    // Low | Medium | High
  faceUnlockSleepTime: 30,            // 秒；0 = 关闭
  uwbUnlockSleepTime: 0,              // 秒；0 = 关闭
  deadlockUids: [1, 2],               // 被授权免反锁的家人 uid
  // 模拟设备主人是否已录入指纹/密码，用于"重置门锁验证"分支
  ownerHasFingerprint: true,
  ownerHasPassword: true,
  // 蓝牙态：demo 中直接给"已连接"，实际生产由 useGlobalStore 提供
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

// 家人 mock
export const LOCK_USERS = [
  { uid: 0, name: '张先生', avatar: '张', isOwner: true },
  { uid: 1, name: '李女士', avatar: '李' },
  { uid: 2, name: '小张', avatar: '张' },
  { uid: 3, name: '外婆', avatar: '婆' },
  { uid: 4, name: '外公', avatar: '公' },
]
