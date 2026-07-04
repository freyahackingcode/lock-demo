import { useEffect, useState } from 'react'

const OPTIMIZATIONS = [
  {
    key: 'face',
    title: '人脸识别灵敏度',
    from: '高',
    to: '中',
    icon: '👤',
    saving: 6,
  },
  {
    key: 'uwb',
    title: 'UWB 自动唤醒',
    from: '常开',
    to: '仅事件',
    icon: '📡',
    saving: 5,
  },
  {
    key: 'doorbell',
    title: '按门铃亮起后屏',
    from: '开',
    to: '关',
    icon: '🔔',
    saving: 4,
  },
]

const TOTAL_SAVING = OPTIMIZATIONS.reduce((s, o) => s + o.saving, 0)

export default function OneClickSaving({ currentDays, onClose, onApply }) {
  const [stage, setStage] = useState('scanning')

  useEffect(() => {
    if (stage === 'scanning') {
      const t = setTimeout(() => setStage('result'), 1200)
      return () => clearTimeout(t)
    }
  }, [stage])

  const handleApply = () => {
    onApply({
      optimizations: OPTIMIZATIONS,
      totalSaving: TOTAL_SAVING,
      newDays: currentDays + TOTAL_SAVING,
    })
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="saving-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <button className="sheet-cancel" onClick={onClose}>取消</button>
          <div className="sheet-title">一键省电</div>
          <span style={{ width: 32 }} />
        </div>

        {stage === 'scanning' && (
          <div className="saving-scanning">
            <div className="scan-spinner">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="26" stroke="rgba(0,0,0,0.08)" strokeWidth="3" fill="none" />
                <circle cx="30" cy="30" r="26" stroke="#00b884" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="60 200" />
              </svg>
            </div>
            <div className="scan-text">正在扫描当前设置…</div>
            <div className="scan-sub">分析门锁功能耗电情况</div>
          </div>
        )}

        {stage === 'result' && (
          <>
            <div className="saving-headline">
              <div className="saving-headline-num">+{TOTAL_SAVING} 天</div>
              <div className="saving-headline-sub">
                检测到 <b>{OPTIMIZATIONS.length} 项</b>可优化，预计续航可延长 {TOTAL_SAVING} 天
              </div>
              <div className="saving-headline-preview">
                <span className="preview-old">{currentDays} 天</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#00b884" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="preview-new">{currentDays + TOTAL_SAVING} 天</span>
              </div>
            </div>

            <div className="saving-list">
              {OPTIMIZATIONS.map(opt => (
                <div className="saving-item" key={opt.key}>
                  <div className="saving-item-icon">{opt.icon}</div>
                  <div className="saving-item-body">
                    <div className="saving-item-title">{opt.title}</div>
                    <div className="saving-item-change">
                      <span className="change-from">{opt.from}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="rgba(0,0,0,0.35)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="change-to">{opt.to}</span>
                    </div>
                  </div>
                  <div className="saving-item-save">+{opt.saving}天</div>
                </div>
              ))}
            </div>

            <div className="saving-note">
              应用后将自动切换为「自定义模式」，你可以随时手动调整
            </div>

            <div className="saving-actions">
              <button className="saving-btn cancel" onClick={onClose}>暂不优化</button>
              <button className="saving-btn primary" onClick={handleApply}>立即应用</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
