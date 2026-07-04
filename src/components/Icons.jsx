// 简化版 SVG 图标，参照 Figma 设计稿样式
export const IconBack = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconMore = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="19" cy="12" r="1.6" fill="currentColor" />
  </svg>
)

export const IconBluetooth = ({ size = 14, color = '#3a8bff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 7L17 17L12 22V2L17 7L7 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconBattery = ({ size = 14, color = '#3a8bff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="16" height="10" rx="2" stroke={color} strokeWidth="2" />
    <rect x="20" y="10" width="2" height="4" rx="0.5" fill={color} />
    <rect x="5" y="9" width="10" height="6" rx="1" fill={color} />
  </svg>
)

export const IconChildLock = ({ size = 14, color = '#3a8bff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const IconPlay = ({ size = 16, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.6" />
    <path d="M10 9.5L15 12L10 14.5V9.5Z" fill={color} />
  </svg>
)

export const IconArrow = ({ size = 14, color = 'rgba(0,0,0,0.3)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// 金刚区图标
export const IconFamily = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="9" cy="10" r="3.2" stroke="#000" strokeWidth="1.6" />
    <circle cx="19" cy="10" r="3.2" stroke="#000" strokeWidth="1.6" />
    <path d="M3 22c0-3 2.7-5 6-5s6 2 6 5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M13 22c0-3 2.7-5 6-5s6 2 6 5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconKey = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="9" cy="14" r="4" stroke="#000" strokeWidth="1.6" />
    <path d="M13 14h12M21 14v4M25 14v3" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconVoice = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M5 11c0-3 3-5 9-5s9 2 9 5v5c0 1-1 2-2 2h-2l-3 3v-3H7c-1 0-2-1-2-2v-5z" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="10" cy="13" r="1" fill="#000" />
    <circle cx="14" cy="13" r="1" fill="#000" />
    <circle cx="18" cy="13" r="1" fill="#000" />
  </svg>
)

export const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3l9 3v8c0 5-4 9-9 11-5-2-9-6-9-11V6l9-3z" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M10 14l3 3 5-5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconEventKey = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="5" cy="8" r="2.5" stroke="#000" strokeWidth="1.3" />
    <path d="M7.5 8H14M12 8v2.2M14 8v1.8" stroke="#000" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

export const IconEventMove = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="11" cy="3.5" r="1.5" fill="#000" />
    <path d="M9 7l3-1 2 4M12 6l-2 4 2 3v3M10 10l-3 1-2 3" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconEventLock = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2.5" y="6" width="9" height="6.5" rx="1.2" stroke="#000" strokeWidth="1.2" />
    <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="#000" strokeWidth="1.2" />
  </svg>
)

export const IconScene = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M16 4l-8 11h6l-2 9 8-11h-6l2-9z" fill="#FFB81F" stroke="#FFB81F" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

export const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="2" rx="1" fill="#000" />
    <rect x="4" y="11" width="16" height="2" rx="1" fill="#000" />
    <rect x="4" y="16" width="16" height="2" rx="1" fill="#000" />
  </svg>
)
