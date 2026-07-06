// 离家场景落地页 —— 1:1 复刻生产
// 生产：miot.lock.spec/plugin-generator/categories/std_lock/5max/pages/settings/AIExperience/AIItems.js
//       + component/OperationCourse.js
// 顶部 banner → tipsText 说明段 → 单行开关"离家场景按键" → 操作教程（4 步 + 第 2 步可展开）→ 提示弹窗
// Spec：wifi-lock.away-home-mode（bool）
// 权限：constant.js `Device.isOwner ? [...] : []`，非主人不显示入口
import { useEffect, useState } from 'react'
import { StatusBar, NavBar, Section, SwitchRow, Toast, Dialog } from './components.jsx'
import { getState, subscribe, setState } from './store.js'
import './setting-lock.css'

function useStore() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((v) => v + 1)), [])
  return getState()
}

// 生产 i18n key 与原文一一对应（assets/i18n/zh.js）
const COPY = {
  navTitle: '离家场景',                                       // lock_std_awayScene
  tipsText:
    '开启后，可在离家时点击"离家场景按键"，联动预设的智能设备。此功能需在"米家"中设置自动化。', // lock_std_5max_away_scene_setup_hint
  switchLabel: '离家场景按键',                                 // lock_std_llm_awaySceneButton
  courseTitle: '操作教程',                                     // lock_std_operation_course
  dialogTitle: '提示',                                         // tip
  dialogMessage: '需要在智能场景中设置自动化，才能执行场景联动',  // lock_std_llm_needAutomationInSmartScene
  step1Title: '1. 开启门锁"离家场景按键"功能',
  step1Desc: '开启页面上方开关，离家关门时，门锁密码区的"离家场景按键"会亮起。',
  step2Title: '2. "米家"创建"离家场景"',
  step2Desc: '在米家场景中创建"离家场景"，选择对应触发条件及执行动作。',
  step2SubStep1:
    '1. 进入米家 > 右上方"+" > 自动化 > 添加触发条件 > 家居设备 > 选择门锁设备"开启离家场景"。',
  step2SubStep2: '2. 选择想要联动的设备和执行动作进行创建。',
  step3Title: '3. 离家关门后，点击"离家场景按键"',
  step3Desc: '离家关门后，"离家场景按键"将会亮起，点击即可联动相关智能设备执行自动化。',
  step4Title: '4. 门外开锁后，离家场景自动关闭',
  expandTutorial: '展开教程',
  collapseTutorial: '收起教程',
  goToSetScene: '去设置智能场景',
}

export default function AwayScene({ onBack }) {
  const s = useStore()
  const [toast, setToast] = useState('')
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  // 生产用 Device.isOwner ? [...] : [] 隐藏入口
  if (!s.isOwner) {
    return (
      <div className="sl-page gradient">
        <StatusBar />
        <NavBar title={COPY.navTitle} onBack={onBack} />
        <div className="sl-scroll">
          <div className="sl-section-footer">
            离家场景仅设备主人可见。当前为共享用户视角，入口已隐藏。
          </div>
        </div>
      </div>
    )
  }

  // 完整复刻生产 setSpecAwayHomeModeValue（AIItems.js:680-749）
  // 分支：已建自动化 → 直接写；未建 + 想关 → 直接关；未建 + 想开 → 弹窗二选一
  const onSwitch = (v) => {
    if (s.awaySceneConfigured) {
      setState({ awayHomeMode: v })
      showToast(v ? '已开启' : '已关闭')
      return
    }
    if (!v) {
      setState({ awayHomeMode: false })
      showToast('已关闭')
      return
    }
    setDialogOpen(true)
  }
  const onDialogConfirmAnyway = () => {
    setDialogOpen(false)
    setState({ awayHomeMode: true })
    showToast('已开启（未设置自动化，仅门锁本地布防生效）')
  }
  const onDialogGoSetup = () => {
    setDialogOpen(false)
    showToast('生产环境跳转米家智能场景页')
  }

  return (
    <div className="sl-page gradient">
      <StatusBar />
      <NavBar title={COPY.navTitle} onBack={onBack} />

      <div className="sl-scroll">
        {/* Banner 位（生产从 getSettingsAwayomeModeConfig()['banner'] 拉图，比例 23:13） */}
        <div className="sl-banner-image">
          <span className="sl-banner-placeholder">Banner · 离家场景</span>
        </div>

        {/* tipsText 段 */}
        <div className="sl-away-tips">{COPY.tipsText}</div>

        {/* 单行开关 */}
        <Section>
          <SwitchRow
            label={COPY.switchLabel}
            value={s.awayHomeMode}
            onChange={onSwitch}
          />
        </Section>

        {/* 操作教程 —— OperationCourse.js */}
        <div className="sl-away-course-title">{COPY.courseTitle}</div>
        <div className="sl-away-course-card">
          {/* Step 1 */}
          <div className="sl-away-course-item">
            <div className="sl-away-course-item-title">{COPY.step1Title}</div>
            <div className="sl-away-course-item-desc">{COPY.step1Desc}</div>
          </div>

          {/* Step 2 with expandable tutorial */}
          <div className="sl-away-course-item">
            <div className="sl-away-course-item-title">{COPY.step2Title}</div>
            <div className="sl-away-course-item-desc">{COPY.step2Desc}</div>
            <div
              className="sl-away-course-expand"
              onClick={() => setTutorialOpen((v) => !v)}
            >
              <span>{tutorialOpen ? COPY.collapseTutorial : COPY.expandTutorial}</span>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" style={{
                transform: tutorialOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}>
                <path d="M2.5 5L6 8.5L9.5 5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {tutorialOpen ? (
              <div className="sl-away-course-expanded">
                <div className="sl-away-course-image">
                  <span>米家自动化示意图 1</span>
                </div>
                <div className="sl-away-course-image">
                  <span>米家自动化示意图 2</span>
                </div>
                <div className="sl-away-course-substep">{COPY.step2SubStep1}</div>
                <div className="sl-away-course-image">
                  <span>米家自动化示意图 3</span>
                </div>
                <div className="sl-away-course-substep">{COPY.step2SubStep2}</div>
                <button
                  className="sl-away-course-cta"
                  onClick={() => showToast('生产环境跳转米家智能场景页')}
                >
                  {COPY.goToSetScene}
                </button>
              </div>
            ) : null}
          </div>

          {/* Step 3 */}
          <div className="sl-away-course-item">
            <div className="sl-away-course-item-title">{COPY.step3Title}</div>
            <div className="sl-away-course-item-desc">{COPY.step3Desc}</div>
          </div>

          {/* Step 4 (no desc) */}
          <div className="sl-away-course-item last">
            <div className="sl-away-course-item-title">{COPY.step4Title}</div>
          </div>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        title={COPY.dialogTitle}
        body={COPY.dialogMessage}
        buttons={[
          { text: '知道了', onClick: onDialogConfirmAnyway },
          { text: '去设置', style: 'primary', onClick: onDialogGoSetup },
        ]}
      />
      <Toast msg={toast} />
    </div>
  )
}
