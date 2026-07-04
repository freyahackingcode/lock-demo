// 门锁设置主页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/settingLock/index.js
// 显隐规则严格对齐 ConditionalSection：section 内每行按 spec 存在性判断，
// 空 section 整段隐藏；HomeKit 需 iOS + spec；重置门锁验证需 owner + spec
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, NavigationRow, NavigationOnOffRow, SwitchRow, Toast, Dialog } from './components.jsx'
import { getState, setState, subscribe, hasSpec, isUwbDisabledByMode } from './store.js'
import ConfigPanel from './ConfigPanel.jsx'
import SpecBadge from './SpecBadge.jsx'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function SettingLock({ onBack, navigate }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [cfgOpen, setCfgOpen] = useState(false)
  const [doorbellCloseDlg, setDoorbellCloseDlg] = useState(false)
  const [resetDlg, setResetDlg] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const showBadge = s.showSpecBadge
  const badge = (deps, extra) => showBadge ? <SpecBadge deps={deps} extra={extra} /> : null

  // ---------- 开锁方式 ----------
  const showFace = hasSpec('lock', 'faceRecognitionUnlockingSwitch')
  const showPalm = hasSpec('lock', 'palmVeinRecognitionUnlockingSwitch')
  const showUwb = hasSpec('lock', 'uwbSwitch')

  // ---------- 识别设置 ----------
  const showTrig = hasSpec('lock', 'triggeringMethod')
  const showPrevent = hasSpec('lock', 'faceUnlockSleepTime') || hasSpec('lock', 'uwbUnlockSleepTime')

  // ---------- 童锁与反锁 ----------
  const showChild = hasSpec('lock', 'childLock')
  const showAnti = hasSpec('lock', 'antiLock')

  // ---------- 更多设置 ----------
  const showDoorbell = hasSpec('wifiDoorbell', 'on')
  const showDoorbellLight = hasSpec('wifiDoorbell', 'doorbellLightOn')
  const showHomekit = s.platform === 'ios' && hasSpec('lock', 'homekitSwitch')
  const showReset = s.isOwner && hasSpec('lock', 'resetWithVerificationRequiredSetting')

  const uwbGrayed = isUwbDisabledByMode(s)

  // ---------- handlers ----------
  const onDoorbellChange = (v) => {
    if (v) { setState({ doorbellOn: true }); showToast('设置成功') }
    else setDoorbellCloseDlg(true)
  }
  const confirmDoorbellClose = () => {
    setState({ doorbellOn: false })
    setDoorbellCloseDlg(false)
    showToast('设置成功')
  }
  const onDoorbellLightChange = (v) => { setState({ doorbellLightOn: v }); showToast('设置成功') }
  const onResetVerificationChange = (v) => {
    if (!v) { setState({ resetWithVerificationRequired: false }); showToast('设置成功'); return }
    if (!s.bleConnected) { showToast('当前手机蓝牙未开启，请打开手机蓝牙后重试'); return }
    if (s.ownerHasFingerprint && s.ownerHasPassword) setResetDlg('confirm')
    else if (!s.ownerHasFingerprint) setResetDlg('noFP')
    else if (!s.ownerHasPassword) setResetDlg('noPwd')
  }

  const resetDialogs = {
    confirm: {
      title: '确认开启？',
      body: '开启后，如果无法验证设备主人的开锁信息，将无法重置门锁或重新绑定"米家"',
      buttons: [
        { text: '取消', onClick: () => { setResetDlg(null); showToast('设置失败') } },
        { text: '仍要开启', style: 'danger',
          onClick: () => { setState({ resetWithVerificationRequired: true }); setResetDlg(null); showToast('设置成功') } }
      ]
    },
    noFP: {
      title: '开启失败',
      body: '未检测到设备主人指纹，请添加指纹后重试',
      tip: '添加路径：首页 > 家人管理 > 设备主人 > 添加指纹',
      buttons: [
        { text: '我知道了', onClick: () => setResetDlg(null) },
        { text: '去添加', style: 'primary', onClick: () => { setResetDlg(null); showToast('已跳转家人管理') } }
      ]
    },
    noPwd: {
      title: '开启失败',
      body: '未检测到设备主人密码，请添加密码后重试',
      tip: '添加路径：首页 > 家人管理 > 设备主人 > 添加密码',
      buttons: [
        { text: '我知道了', onClick: () => setResetDlg(null) },
        { text: '去添加', style: 'primary', onClick: () => { setResetDlg(null); showToast('已跳转家人管理') } }
      ]
    }
  }

  const onUwbClick = () => {
    if (uwbGrayed) {
      showToast(s.batteryLevel === 'low2' ? '门锁电量不足，功能不可用' : 'UWB 在省电模式下不可用')
      return
    }
    showToast('UWB 开锁页（略）')
  }

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="门锁设置" onBack={onBack} />
      <button className="sl-cfg-btn" onClick={() => setCfgOpen(true)} title="打开配置面板">⚙︎</button>

      <div className="sl-scroll">
        {/* 开锁方式 */}
        <Section title="开锁方式">
          {showFace ? (
            <NavigationOnOffRow
              label={<>人脸识别开锁{badge(['lock.faceRecognitionUnlockingSwitch'])}</>}
              on={true}
              onClick={() => showToast('人脸识别开锁页（略）')}
            />
          ) : null}
          {showPalm ? (
            <NavigationOnOffRow
              label={<>掌静脉开锁{badge(['lock.palmVeinRecognitionUnlockingSwitch'])}</>}
              on={true}
              onClick={() => showToast('掌静脉开锁页（略）')}
            />
          ) : null}
          {showUwb ? (
            <div className={`sl-row ${uwbGrayed ? 'disabled' : ''}`} onClick={onUwbClick}>
              <div className="sl-row-text">
                <div className="sl-row-label">UWB 开锁</div>
                {uwbGrayed ? <div className="sl-row-sub">当前电量或模式下不可用</div> : null}
                {badge(['lock.uwbSwitch'], uwbGrayed ? '省电/low2 置灰' : null)}
              </div>
              <div className="sl-row-value">
                <span>{uwbGrayed ? '不可用' : '已关闭'}</span>
              </div>
            </div>
          ) : null}
        </Section>

        {/* 识别设置 */}
        <Section title="识别设置">
          {showTrig ? (
            <NavigationRow
              label={<>人脸、掌静脉自动识别{badge(['lock.triggeringMethod'])}</>}
              sub="有人靠近时，门锁将自动唤醒并识别"
              onClick={() => navigate('face-palm')}
            />
          ) : null}
          {showPrevent ? (
            <NavigationRow
              label={<>防误开{badge(['lock.faceUnlockSleepTime', 'lock.uwbUnlockSleepTime'])}</>}
              sub="关门后，屏蔽部分开锁方式，避免误解锁"
              onClick={() => navigate('prevent')}
            />
          ) : null}
        </Section>

        {/* 童锁与反锁 */}
        <Section title="童锁与反锁">
          {showChild ? (
            <NavigationOnOffRow
              label={<>童锁{badge(['lock.childLock'])}</>}
              on={s.childLock}
              onClick={() => navigate('child')}
            />
          ) : null}
          {showAnti ? (
            <NavigationOnOffRow
              label={<>反锁{badge(['lock.antiLock'])}</>}
              on={s.antiLock}
              onClick={() => navigate('reverse')}
            />
          ) : null}
        </Section>

        {/* 更多设置 */}
        <Section title="更多设置">
          {showDoorbell ? (
            <SwitchRow
              label={<>门铃{badge(['wifiDoorbell.on'])}</>}
              sub="关闭后，门铃不可使用"
              value={s.doorbellOn}
              onChange={onDoorbellChange}
            />
          ) : null}
          {showDoorbellLight ? (
            <SwitchRow
              label={<>门铃灯{badge(['wifiDoorbell.doorbellLightOn'], s.doorbellOn ? null : '门铃关闭时置灰')}</>}
              sub="有人靠近门锁门铃灯会自动亮起"
              value={s.doorbellLightOn}
              onChange={onDoorbellLightChange}
              disabled={!s.doorbellOn}
            />
          ) : null}
          {showHomekit ? (
            <NavigationOnOffRow
              label={<>HomeKit 设置{badge(['lock.homekitSwitch'], 'iOS only')}</>}
              on={s.homekitSwitch}
              onClick={() => navigate('homekit')}
            />
          ) : null}
          {showReset ? (
            <SwitchRow
              label={<>重置门锁验证{badge(['lock.resetWithVerificationRequiredSetting'], 'owner only')}</>}
              sub="开启后，重置门锁需验证设备主人密码或指纹"
              value={s.resetWithVerificationRequired}
              onChange={onResetVerificationChange}
            />
          ) : null}
        </Section>
      </div>

      <Dialog
        open={doorbellCloseDlg}
        body={'关闭"门铃"后，该功能将禁用，确认关闭？'}
        buttons={[
          { text: '取消', onClick: () => setDoorbellCloseDlg(false) },
          { text: '确定', onClick: confirmDoorbellClose }
        ]}
      />

      {resetDlg && (
        <Dialog
          open={true}
          title={resetDialogs[resetDlg].title}
          body={resetDialogs[resetDlg].body}
          tip={resetDialogs[resetDlg].tip}
          bodyLeft={resetDlg !== 'confirm'}
          buttons={resetDialogs[resetDlg].buttons}
        />
      )}

      <Toast msg={toast} />
      <ConfigPanel open={cfgOpen} onClose={() => setCfgOpen(false)} />
    </div>
  )
}
