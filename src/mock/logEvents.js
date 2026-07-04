// 日志-大模型：日期、AI 摘要、事件列表
export const logDates = [
  '2025年9月13日',
  '2025年9月12日',
  '2025年9月11日',
  '2025年9月10日',
]

export const logTabs = [
  { key: 'all', label: '全部' },
  { key: 'message', label: '留言' },
  { key: 'doorbell', label: '按门铃' },
  { key: 'face', label: '识别到人脸' },
]

// AI 摘要（每条按要点 bullet 形式呈现）
export const aiSummary = {
  '2025年9月13日': [
    '小明白天学习小时玩玩电子设备使用超时',
    '奶奶静坐3小时，午后阳台休息',
    '小狗下午3点撕咬鞋带，持续约5分钟',
  ],
  '2025年9月12日': [
    '小明白天学习小时玩玩电子设备使用超时',
    '奶奶静坐3小时，午后阳台休息',
    '小狗下午3点撕咬鞋带，持续约5分钟',
  ],
  '2025年9月11日': [
    '今日有 2 次按门铃记录，均无应答',
    '晚间识别到陌生人脸 1 次，已上报',
  ],
  '2025年9月10日': [
    '今日无异常事件',
  ],
}

const baseEvents = [
  { id: 1, time: '22:14', tag: '一次性密码开锁', sub: '[AI] 妈妈带着小朋友回家了',     type: 'face',     icon: 'key',     thumb: '/assets/event-baby.jpg' },
  { id: 2, time: '21:30', tag: '有人移动',       sub: '[AI] 一位男士在门前停留约10秒', type: 'face',     icon: 'move',    thumb: '/assets/event-room.jpg' },
  { id: 3, time: '20:05', tag: '室内开门',       type: 'doorbell', icon: 'lock' },
  { id: 4, time: '18:42', tag: '有人移动',       sub: '[AI] 小朋友牵着小狗经过',       type: 'face',     icon: 'move',    thumb: '/assets/event1.png' },
]

// 多日数据
export const logEvents = {
  '2025年9月13日': baseEvents,
  '2025年9月12日': baseEvents,
  '2025年9月11日': baseEvents.slice(1, 3),
  '2025年9月10日': [],
}

// 日期 -> 显示标签
export const dateLabel = {
  '2025年9月13日': { short: '9月13日', tag: '今天' },
  '2025年9月12日': { short: '9月12日' },
  '2025年9月11日': { short: '9月11日' },
  '2025年9月10日': { short: '9月10日' },
}

// 日志页面默认按当前日期显示，并向前展示 N 天的内容
export const visibleDates = ['2025年9月13日', '2025年9月12日']
