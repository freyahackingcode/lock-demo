// Config 常驻侧栏：勾选 spec / 切 model 时，左侧手机页面实时变化
// 主界面按这些配置对齐 miot.lock.spec 的显隐规则实时重渲染
import { useEffect, useState } from 'react'
import { getState, setState, subscribe, applyModelPreset, setSpecExists, setCustomConfig, SPEC_KEYS, isUwbDisabledByMode } from './store.js'
import { MODEL_PRESETS, MODEL_LIST } from './modelPresets.js'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function ConfigPanel() {
  const s = useStore()
  const preset = MODEL_PRESETS[s.model]

  return (
    <div className="sl-cfg-sidebar">
      <div className="sl-cfg-header">
        <div className="sl-cfg-title">配置面板 · 复原生产实际</div>
      </div>

      <div className="sl-cfg-scroll">
        <div className="sl-cfg-hint">
          切换 model / spec / 平台 / 权限，左侧手机页面按 <code>miot.lock.spec</code> 的判定逻辑实时重渲染
        </div>

        {/* Model preset */}
        <div className="sl-cfg-group">
          <div className="sl-cfg-group-title">Model</div>
          <select
            className="sl-cfg-select"
            value={s.model}
            onChange={(e) => applyModelPreset(e.target.value)}
          >
            {MODEL_LIST.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <div className="sl-cfg-hint" style={{ marginTop: 8, marginBottom: 0 }}>
            {preset.label}
          </div>
          {Object.keys(preset.verified).length > 0 ? (
            <div className="sl-cfg-verified">
              {Object.entries(preset.verified).map(([k, v]) => (
                <div key={k}><b>{k}</b> — {v}</div>
              ))}
            </div>
          ) : null}
          {preset.unverified ? (
            <div className="sl-cfg-unverified">⚠ {preset.unverified}</div>
          ) : null}
        </div>

        {/* Platform / owner / battery / mode */}
        <div className="sl-cfg-group">
          <div className="sl-cfg-group-title">运行时上下文</div>

          <div className="sl-cfg-row">
            <span>Platform.OS</span>
            <div className="sl-cfg-seg">
              <button
                className={s.platform === 'ios' ? 'active' : ''}
                onClick={() => setState({ platform: 'ios' })}
              >iOS</button>
              <button
                className={s.platform === 'android' ? 'active' : ''}
                onClick={() => setState({ platform: 'android' })}
              >Android</button>
            </div>
          </div>

          <div className="sl-cfg-row">
            <span>Device.isOwner</span>
            <div className="sl-cfg-seg">
              <button className={s.isOwner ? 'active' : ''} onClick={() => setState({ isOwner: true })}>true</button>
              <button className={!s.isOwner ? 'active' : ''} onClick={() => setState({ isOwner: false })}>false</button>
            </div>
          </div>

          <div className="sl-cfg-row">
            <span>电量档位</span>
            <div className="sl-cfg-seg">
              {['normal', 'low1', 'low2'].map((lv) => (
                <button
                  key={lv}
                  className={s.batteryLevel === lv ? 'active' : ''}
                  onClick={() => setState({ batteryLevel: lv })}
                >{lv}</button>
              ))}
            </div>
          </div>

          <div className="sl-cfg-row">
            <span>工作模式</span>
            <div className="sl-cfg-seg vertical">
              {['Real-time Mode', 'Battery-saving Mode', 'Super Power Saving Mode'].map((m) => (
                <button
                  key={m}
                  className={s.mode === m ? 'active' : ''}
                  onClick={() => setState({ mode: m })}
                >{m}</button>
              ))}
            </div>
          </div>

          <div className="sl-cfg-row">
            <span>UWB 是否置灰</span>
            <span className="sl-cfg-hint" style={{ margin: 0 }}>
              {isUwbDisabledByMode(s) ? '是' : '否'}
            </span>
          </div>

          <div className="sl-cfg-row">
            <span>显示 spec 依赖 badge</span>
            <div className="sl-cfg-seg">
              <button className={s.showSpecBadge ? 'active' : ''} onClick={() => setState({ showSpecBadge: !s.showSpecBadge })}>
                {s.showSpecBadge ? '开' : '关'}
              </button>
            </div>
          </div>
        </div>

        {/* spec 存在性 */}
        {Object.entries(SPEC_KEYS).map(([svc, props]) => (
          <div className="sl-cfg-group" key={svc}>
            <div className="sl-cfg-group-title">spec.{svc}</div>
            {props.map((p) => {
              const checked = !!s.specExists?.[svc]?.[p]
              return (
                <label className="sl-cfg-check" key={p}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setSpecExists(svc, p, e.target.checked)}
                  />
                  <span>{p}</span>
                </label>
              )
            })}
          </div>
        ))}

        {/* custom_config */}
        <div className="sl-cfg-group">
          <div className="sl-cfg-group-title">custom_config.lock-setting</div>
          <label className="sl-cfg-check">
            <input
              type="checkbox"
              checked={!!s.customConfig['anti-lock-unlock-permission']}
              onChange={(e) => setCustomConfig('anti-lock-unlock-permission', e.target.checked)}
            />
            <span>anti-lock-unlock-permission</span>
          </label>
          <label className="sl-cfg-check">
            <input
              type="checkbox"
              checked={!!s.customConfig['disable-user-permission']}
              onChange={(e) => setCustomConfig('disable-user-permission', e.target.checked)}
            />
            <span>disable-user-permission</span>
          </label>
        </div>

        <div className="sl-cfg-footer">
          所有配置只作用于当前浏览器会话，刷新页面后会重置
        </div>
      </div>
    </div>
  )
}
