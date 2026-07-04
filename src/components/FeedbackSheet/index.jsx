import { useState, useEffect } from 'react'
import './index.css'

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7.2l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const NOTE = '注意：提交反馈即表示同意贡献此视频，帮助我们通过视频来训练模型，以提供更准确的视频报警。该信息不会用于其他用途，也不会未经你同意共享给任何第三方。'

export default function FeedbackSheet({ open, title = '反馈', options = [], onClose, onSubmit }) {
  const [selected, setSelected] = useState([])
  const [otherText, setOtherText] = useState('')

  useEffect(() => {
    if (open) {
      setSelected([])
      setOtherText('')
    }
  }, [open])

  if (!open) return null

  const toggle = (key) => {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]))
  }

  const otherSelected = selected.includes('other')
  const canSubmit = selected.length > 0 && (!otherSelected || otherText.trim().length > 0)

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit?.({ options: selected, other: otherText.trim() })
  }

  return (
    <div className="fb-mask" onClick={onClose}>
      <div className="fb-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="fb-handle"><span /></div>

        <div className="fb-header">
          <div className="fb-title">{title}</div>
          <button className="fb-close" onClick={onClose}><IconClose /></button>
        </div>

        <div className="fb-body">
          <div className="fb-sub">请选择问题类型（可多选）</div>
          <div className="fb-options">
            {options.map((opt) => {
              const checked = selected.includes(opt.key)
              return (
                <button
                  key={opt.key}
                  className={`fb-option ${checked ? 'checked' : ''}`}
                  onClick={() => toggle(opt.key)}
                >
                  <span className={`fb-checkbox ${checked ? 'checked' : ''}`}>
                    {checked && <IconCheck />}
                  </span>
                  <span className="fb-option-label">{opt.label}</span>
                </button>
              )
            })}
          </div>

          {otherSelected && (
            <div className="fb-other">
              <textarea
                value={otherText}
                onChange={(e) => setOtherText(e.target.value.slice(0, 50))}
                placeholder="请描述具体问题…"
                maxLength={50}
              />
              <div className="fb-counter">{otherText.length}/50</div>
            </div>
          )}

          <div className="fb-note">{NOTE}</div>
        </div>

        <div className="fb-footer">
          <button
            className={`fb-submit ${canSubmit ? 'active' : ''}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            提交反馈
          </button>
        </div>
        <div className="fb-home-indicator" />
      </div>
    </div>
  )
}
