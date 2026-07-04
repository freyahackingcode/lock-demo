// 占位 banner：用于本地拿不到生产 URL 的三个场景（童锁/反锁/人脸掌静脉）
// 生产实际图片走 custom_config.lock-setting 后台下发
export default function PlaceholderBanner({ icon = '🔒', tint = 'blue', note }) {
  const tints = {
    blue: 'linear-gradient(180deg, #e5edf7 0%, #cfdbeb 100%)',
    green: 'linear-gradient(180deg, #e6f5ed 0%, #c5e5d3 100%)',
    orange: 'linear-gradient(180deg, #fff0e0 0%, #ffd9b3 100%)'
  }
  return (
    <div className="sl-ph-banner" style={{ background: tints[tint] }}>
      <div className="sl-ph-icon">{icon}</div>
      <div className="sl-ph-tag">待补：由 custom_config 后台下发</div>
      {note ? <div className="sl-ph-note">{note}</div> : null}
    </div>
  )
}
