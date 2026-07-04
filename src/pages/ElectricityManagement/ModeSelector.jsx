import { useState } from 'react'
import MODES from './modes.js'

const BASE_DAYS = MODES.find(m => m.key === 'standard').estimatedDays

export default function ModeSelector({ currentMode, onClose, onConfirm, initialConfirm = false }) {
  const [tempMode, setTempMode] = useState(initialConfirm ? 'super' : currentMode)
  const [showConfirm, setShowConfirm] = useState(initialConfirm)

  const handleSelect = (key) => {
    setTempMode(key)
  }

  const handleConfirm = () => {
    if (tempMode === 'super' && currentMode !== 'super') {
      setShowConfirm(true)
      return
    }
    onConfirm(tempMode)
  }

  const renderDaysLabel = (m) => {
    if (m.key === 'standard') return `约 ${m.estimatedDays} 天`
    if (m.key === 'custom') return `按你的设置`
    const delta = m.estimatedDays - BASE_DAYS
    const sign = delta > 0 ? '+' : ''
    return `约 ${m.estimatedDays} 天（${sign}${delta}天）`
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="mode-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <button className="sheet-cancel" onClick={onClose}>取消</button>
          <div className="sheet-title">电池模式</div>
          <button className="sheet-confirm" onClick={handleConfirm}>确认</button>
        </div>

        {MODES.map(m => (
          <div
            key={m.key}
            className={`mode-option ${tempMode === m.key ? 'selected' : ''}`}
            onClick={() => handleSelect(m.key)}
          >
            <div className="mode-radio" />
            <div className="mode-option-body">
              <div className="mode-option-head">
                <div className="mode-option-name">{m.name}</div>
                <div className={`mode-option-days ${m.key !== 'standard' && m.key !== 'custom' ? 'highlight' : ''}`}>
                  {renderDaysLabel(m)}
                </div>
              </div>
              <div className="mode-option-desc">{m.subtitle}</div>
            </div>
          </div>
        ))}

        {showConfirm && (
          <div className="confirm-mask" onClick={(e) => { e.stopPropagation(); setShowConfirm(false) }}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-body">
                <div className="confirm-icon-wrap">
                  <img src="/svg/LockMaxAlertTriangle.svg" alt="" />
                </div>
                <div className="confirm-text">
                  开启「超级省电模式」后，摄像头录像功能将完全关闭，AI 功能不可用，WLAN 进入休眠状态。是否开启？
                </div>
              </div>
              <div className="confirm-actions">
                <button className="confirm-btn cancel" onClick={() => setShowConfirm(false)}>
                  取消
                </button>
                <button
                  className="confirm-btn primary"
                  onClick={() => {
                    setShowConfirm(false)
                    onConfirm(tempMode)
                  }}
                >
                  开启
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
