// HomeKit 设置落地页
// 对应生产代码：settingLock/homeKitSetting.js
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, NavigationRow, Dialog, Toast } from './components.jsx'
import { getState, setState, subscribe } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function HomeKitSetting({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [rebindDlg, setRebindDlg] = useState(null) // 'auto' | 'manual' | null
  const [dontRemind, setDontRemind] = useState(false)

  const showToast = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  // 绑定状态判定（对齐代码优先级）
  // 1. isNewLockHomeKitBinded === true → 已绑
  // 2. spec homekitBindStatusSync === true → 已绑
  // 3. 都为 false → 未绑
  const isBound = s.isNewLockHomeKitBinded || s.homekitBindStatusSync

  // 自动弹窗触发：homekitBindStatusSync=true 且 iOS 未识别 且 未勾选
  useEffect(() => {
    if (
      s.homekitBindStatusSync &&
      !s.isNewLockHomeKitBinded &&
      !s.hideHomeKitRebindTip &&
      !rebindDlg
    ) {
      setRebindDlg('auto')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBindClick = () => {
    if (isBound) {
      setRebindDlg('manual')
    } else {
      // 未绑：模拟 doAction(startHomekitAdv) + addNewLockToHomeKit 成功
      setState({ isNewLockHomeKitBinded: true, homekitBindStatusSync: true, homekitSwitch: true })
      showToast('已发起绑定，请在 iOS "家庭" App 中完成')
    }
  }

  const onSwitchChange = (v) => {
    setState({ homekitSwitch: v })
    showToast(v ? '已开启 HomeKit' : '已关闭 HomeKit')
  }

  const handleReset = () => {
    // 模拟：清除本机绑定 + 门锁 spec 绑定态
    setState({
      isNewLockHomeKitBinded: false,
      homekitBindStatusSync: false,
      homekitSwitch: false,
      hideHomeKitRebindTip: dontRemind
    })
    setRebindDlg(null)
    showToast('已重置绑定')
  }

  const handleDlgCancel = () => {
    setState({ hideHomeKitRebindTip: dontRemind })
    setRebindDlg(null)
  }

  const dlgTitle = rebindDlg === 'auto' ? '重要提示' : '确认重置绑定？'
  const dlgBody = '重置绑定 HomeKit 后，之前绑定的"家庭"将无法操作该门锁'

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="HomeKit 设置" onBack={onBack} />

      <div className="sl-scroll">
        <div className="sl-header-image-view">
          <div className="sl-header-image-box">
            <div style={{ fontSize: 56 }}>🏠</div>
          </div>
          <div className="sl-header-image-text">
            可通过"家庭"操作门锁。需要使用 iOS 11.3 及以上系统进行绑定
          </div>
        </div>

        <Section>
          <NavigationRow
            label="绑定门锁到 HomeKit"
            value={isBound ? '已绑定' : '去绑定'}
            onClick={onBindClick}
          />
          {isBound ? (
            <SwitchRow label="HomeKit 开关" value={s.homekitSwitch} onChange={onSwitchChange} />
          ) : null}
        </Section>
      </div>

      {rebindDlg && (
        <div className="sl-dialog-mask">
          <div className="sl-dialog">
            <div className="sl-dialog-title">{dlgTitle}</div>
            <div className="sl-dialog-body left">
              {rebindDlg === 'auto' ? (
                <div>
                  检测到门锁已经绑定 HomeKit，但此 iOS 设备的"家庭"中没有记录。
                  <br /><br />
                  如果是您或您授权的其他 Apple 账号在"家庭"中绑定了当前门锁，可登录此 Apple 账号使用 HomeKit 开锁。
                  <br /><br />
                  如果是未授权的 Apple 账号绑定了当前门锁，建议您立即重置绑定。
                </div>
              ) : (
                <div>{dlgBody}</div>
              )}
              {rebindDlg === 'auto' && (
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginTop: 14, fontSize: 14, color: 'rgba(0,0,0,0.65)'
                }}>
                  <input
                    type="checkbox"
                    checked={dontRemind}
                    onChange={(e) => setDontRemind(e.target.checked)}
                    style={{ accentColor: '#34c759' }}
                  />
                  不再提示
                </label>
              )}
            </div>
            <div className="sl-dialog-buttons">
              <button className="sl-dialog-btn danger" onClick={handleReset}>重置绑定</button>
              <button className="sl-dialog-btn" onClick={handleDlgCancel}>取消</button>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast} />
    </div>
  )
}
