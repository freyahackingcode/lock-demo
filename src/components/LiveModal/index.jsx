import './index.css'

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export default function LiveModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="live-mask" onClick={onClose}>
      <div className="live-frame" onClick={(e) => e.stopPropagation()}>
        <button className="live-close" onClick={onClose}><IconClose /></button>
        <div className="live-tag"><span className="dot" /> 直播中</div>
        <div className="live-stage">
          <div className="live-noise" />
          <div className="live-text">门口实时画面</div>
          <div className="live-time">{new Date().toLocaleTimeString()}</div>
        </div>
        <div className="live-actions">
          <button className="la-btn">📞 通话</button>
          <button className="la-btn primary">📷 抓拍</button>
          <button className="la-btn">🎙 喊话</button>
        </div>
      </div>
    </div>
  )
}
