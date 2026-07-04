const MODES = [
  {
    key: 'standard',
    name: '标准模式',
    subtitle: '可在有人逗留、有人按门铃、开关门及高风险事件发生时录像，可在事件发生时查看实时画面',
    color: '#0CCE94',
    gradient: '#0CCE94',
    estimatedDays: 30,
  },
  {
    key: 'saving',
    name: '省电模式',
    subtitle: '仅在有人按门铃及高风险事件发生时录像，UWB、语音留言功能关闭',
    color: '#FF8F0F',
    gradient: '#FF8F0F',
    estimatedDays: 60,
  },
  {
    key: 'super',
    name: '超级省电模式',
    subtitle: '最大程度延长续航，录像功能关闭且无法查看实时画面，后屏幕无法使用。需手动触发人脸掌静脉解锁，UWB、语音留言功能关闭',
    color: '#FFBB0F',
    gradient: '#FFBB0F',
    estimatedDays: 120,
  },
  {
    key: 'custom',
    name: '自定义模式',
    subtitle: '可自行调整',
    color: '#3482FF',
    gradient: '#3482FF',
    estimatedDays: 45,
  }
]

export default MODES
