// 门锁设置主页
// 对应生产代码：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/settingLock/index.js
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, NavigationRow, NavigationOnOffRow, SwitchRow, Toast, Dialog } from './components.jsx'
import { getState, setState, subscribe } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

export default function SettingLock({ onBack, navigate }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  // 门铃关闭确认弹窗
  const [doorbellCloseDlg, setDoorbellCloseDlg] = useState(false)
  // 重置门锁验证 · 三种弹窗
  const [resetDlg, setResetDlg] = useState(null) // 'confirm' | 'noFP' | 'noPwd'

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  // --- 门铃开关 ---
  const onDoorbellChange = (v) => {
    if (v) {
      // 关→开：直接写入
      setState({ doorbellOn: true })
      showToast('设置成功')
    } else {
      setDoorbellCloseDlg(true)
    }
  }
  const confirmDoorbellClose = () => {
    setState({ doorbellOn: false })
    setDoorbellCloseDlg(false)
    showToast('设置成功')
  }

  // --- 门铃灯：直接写 ---
  const onDoorbellLightChange = (v) => {
    setState({ doorbellLightOn: v })
    showToast('设置成功')
  }

  // --- 重置门锁验证 · 关→开前置校验 ---
  const onResetVerificationChange = (v) => {
    if (!v) {
      setState({ resetWithVerificationRequired: false })
      showToast('设置成功')
      return
    }
    if (!s.bleConnected) {
      showToast('当前手机蓝牙未开启，请打开手机蓝牙后重试')
      return
    }
    const hasFP = s.ownerHasFingerprint
    const hasPwd = s.ownerHasPassword
    if (hasFP && hasPwd) {
      setResetDlg('confirm')
    } else if (!hasFP) {
      setResetDlg('noFP')
    } else if (!hasPwd) {
      setResetDlg('noPwd')
    }
  }

  const resetDialogs = {
    confirm: {
      title: '确认开启？',
      body: '开启后，如果无法验证设备主人的开锁信息，将无法重置门锁或重新绑定"米家"',
      buttons: [
        { text: '取消', onClick: () => { setResetDlg(null); showToast('设置失败') } },
        {
          text: '仍要开启', style: 'danger',
          onClick: () => { setState({ resetWithVerificationRequired: true }); setResetDlg(null); showToast('设置成功') }
        }
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

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title="门锁设置" onBack={onBack} />

      <div className="sl-scroll">
        {/* 开锁方式（简化，仅展示） */}
        <Section title="开锁方式">
          <NavigationOnOffRow label="人脸识别开锁" on={true} onClick={() => showToast('人脸识别开锁页（略）')} />
          <NavigationOnOffRow label="掌静脉开锁" on={true} onClick={() => showToast('掌静脉开锁页（略）')} />
          <NavigationOnOffRow label="UWB 开锁" on={false} onClick={() => showToast('UWB 开锁页（略）')} />
        </Section>

        {/* 识别设置 */}
        <Section title="识别设置">
          <NavigationRow
            label="人脸、掌静脉自动识别"
            sub="有人靠近时，门锁将自动唤醒并识别"
            onClick={() => navigate('face-palm')}
          />
          <NavigationRow
            label="防误开"
            sub="关门后，屏蔽部分开锁方式，避免误解锁"
            onClick={() => navigate('prevent')}
          />
        </Section>

        {/* 童锁与反锁 */}
        <Section title="童锁与反锁">
          <NavigationOnOffRow
            label="童锁"
            on={s.childLock}
            onClick={() => navigate('child')}
          />
          <NavigationOnOffRow
            label="反锁"
            on={s.antiLock}
            onClick={() => navigate('reverse')}
          />
        </Section>

        {/* 更多设置 */}
        <Section title="更多设置">
          <SwitchRow
            label="门铃"
            sub="关闭后，门铃不可使用"
            value={s.doorbellOn}
            onChange={onDoorbellChange}
          />
          <SwitchRow
            label="门铃灯"
            sub="有人靠近门锁门铃灯会自动亮起"
            value={s.doorbellLightOn}
            onChange={onDoorbellLightChange}
            disabled={!s.doorbellOn}
          />
          <NavigationOnOffRow
            label="HomeKit 设置"
            on={s.homekitSwitch}
            onClick={() => navigate('homekit')}
          />
          <SwitchRow
            label="重置门锁验证"
            sub="开启后，重置门锁需验证设备主人密码或指纹"
            value={s.resetWithVerificationRequired}
            onChange={onResetVerificationChange}
          />
        </Section>
      </div>

      {/* 门铃关闭二次确认 */}
      <Dialog
        open={doorbellCloseDlg}
        body={'关闭"门铃"后，该功能将禁用，确认关闭？'}
        buttons={[
          { text: '取消', onClick: () => setDoorbellCloseDlg(false) },
          { text: '确定', onClick: confirmDoorbellClose }
        ]}
      />

      {/* 重置门锁验证 · 三种弹窗 */}
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
    </div>
  )
}
