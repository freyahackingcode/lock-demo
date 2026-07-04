// spec 依赖 badge：显示某一行的显隐条件
// 全局开关 showSpecBadge=true 时才渲染
export default function SpecBadge({ deps, extra }) {
  // deps: ['lock.homekitSwitch'] 等
  // extra: 额外条件说明字符串，如 'Platform=iOS' / 'Device.isOwner'
  return (
    <div className="sl-spec-badge" title={`依赖：${deps.join(', ')}${extra ? ' + ' + extra : ''}`}>
      <span className="sl-spec-badge-dot" />
      {deps[0]}
      {deps.length > 1 ? ` +${deps.length - 1}` : ''}
      {extra ? ` · ${extra}` : ''}
    </div>
  )
}
