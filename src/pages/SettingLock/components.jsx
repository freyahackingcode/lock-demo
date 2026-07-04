// SettingLock 共用小组件
import { useEffect } from 'react'

export function StatusBar() {
  return (
    <div className="sl-status-bar">
      <span className="time">2:36</span>
      <div className="sl-status-icons">
        <span>●●●●</span><span>📶</span><span>🔋</span>
      </div>
    </div>
  )
}

export function NavBar({ title, onBack }) {
  return (
    <div className="sl-nav-bar">
      <button className="sl-nav-btn" onClick={onBack} aria-label="返回">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 6L9 12L15 18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="sl-nav-title">{title}</div>
      <div className="sl-nav-right" />
    </div>
  )
}

export function IosSwitch({ on, onChange, disabled }) {
  return (
    <div
      className={`sl-switch ${on ? 'on' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        if (disabled) return
        onChange && onChange(!on)
      }}
    />
  )
}

export function ArrowRight() {
  return (
    <svg className="sl-row-arrow" viewBox="0 0 16 16" fill="none">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Toast({ msg }) {
  if (!msg) return null
  return <div className="sl-toast">{msg}</div>
}

export function useToast(initial = '') {
  const showToast = (msg, setter) => {
    setter(msg)
    setTimeout(() => setter(''), 2000)
  }
  return showToast
}

/** 通用一行 · SWITCH */
export function SwitchRow({ label, sub, value, onChange, disabled }) {
  return (
    <div className={`sl-row no-arrow ${disabled ? 'disabled' : ''}`}>
      <div className="sl-row-text">
        <div className="sl-row-label">{label}</div>
        {sub ? <div className="sl-row-sub">{sub}</div> : null}
      </div>
      <IosSwitch on={value} onChange={onChange} disabled={disabled} />
    </div>
  )
}

/** 通用一行 · NAVIGATION（右侧显示文案 + 箭头） */
export function NavigationRow({ label, sub, value, onClick, disabled }) {
  return (
    <div
      className={`sl-row ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="sl-row-text">
        <div className="sl-row-label">{label}</div>
        {sub ? <div className="sl-row-sub">{sub}</div> : null}
      </div>
      <div className="sl-row-value">
        {value != null && value !== '' ? <span>{value}</span> : null}
        <ArrowRight />
      </div>
    </div>
  )
}

/** 通用一行 · NAVIGATIONONOFF（右侧显示 已开启/已关闭 + 箭头） */
export function NavigationOnOffRow({ label, sub, on, onClick, disabled }) {
  return (
    <div
      className={`sl-row ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="sl-row-text">
        <div className="sl-row-label">{label}</div>
        {sub ? <div className="sl-row-sub">{sub}</div> : null}
      </div>
      <div className="sl-row-value">
        <span>{on ? '已开启' : '已关闭'}</span>
        <ArrowRight />
      </div>
    </div>
  )
}

/** Section */
export function Section({ title, children }) {
  const kids = Array.isArray(children) ? children.filter(Boolean) : (children ? [children] : [])
  if (kids.length === 0) return null
  return (
    <div className="sl-section">
      {title ? <div className="sl-section-header">{title}</div> : null}
      <div className="sl-section-box">{kids}</div>
    </div>
  )
}

/** 通用弹窗 */
export function Dialog({ open, title, body, tip, buttons, bodyLeft }) {
  if (!open) return null
  return (
    <div className="sl-dialog-mask">
      <div className="sl-dialog">
        {title ? <div className="sl-dialog-title">{title}</div> : null}
        {body ? (
          <div className={`sl-dialog-body ${bodyLeft ? 'left' : ''}`}>
            {body}
            {tip ? <div className="sl-dialog-tip">{tip}</div> : null}
          </div>
        ) : null}
        <div className="sl-dialog-buttons">
          {buttons.map((b, i) => (
            <button
              key={i}
              className={`sl-dialog-btn ${b.style || ''}`}
              onClick={b.onClick}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 底部选项弹层（DROPDOWNMODEL） */
export function OptionSheet({ open, title, options, value, onSelect, onCancel }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onCancel && onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])
  if (!open) return null
  return (
    <div className="sl-sheet-mask" onClick={onCancel}>
      <div className="sl-sheet" onClick={(e) => e.stopPropagation()}>
        {title ? <div className="sl-sheet-title">{title}</div> : null}
        {options.map((o) => (
          <div
            key={o.value}
            className={`sl-sheet-item ${o.value === value ? 'selected' : ''}`}
            onClick={() => onSelect(o.value)}
          >
            <span>{o.label}</span>
            {o.value === value ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9L7.5 12.5L14 5.5" stroke="#34c759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
        ))}
        <button className="sl-sheet-cancel" onClick={onCancel}>取消</button>
      </div>
    </div>
  )
}
