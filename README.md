# 小米智能门锁 · 电量管理改版 Demo

基于 React + Vite 的门锁插件原型 Demo，用于电量管理改版的方案预演与竞品对标演示。

## 演示地址

**Public：** https://freyahackingcode.github.io/lock-demo/ （GitHub Pages，push 到 main 后自动更新）

## 本地启动

前置：Node.js 18+ / npm

```bash
git clone https://github.com/freyahackingcode/lock-demo.git
cd lock-demo
npm install
npm run dev
```

默认监听 `http://localhost:5180/`

## 构建产物

```bash
npm run build     # 产物落在 dist/
npm run preview   # 本地预览构建结果
```

构建时启用 `base: '/lock-demo/'`，用于 GitHub Pages 子路径部署；本地 dev 时使用根路径。

## 目录结构

```
lock-demo/
├── src/                          # 源码
│   ├── App.jsx
│   ├── pages/                    # 各功能页面
│   │   └── ElectricityManagement/   # 电量管理改版模块
│   └── styles/
├── public/                       # 静态资源
├── vite.config.js
├── .github/workflows/deploy.yml  # GitHub Actions 自动部署 Pages
└── .gitlab-ci.yml                # GitLab CI 配置（备用）
```

## 部署流程

**GitHub Pages（主）**：
1. push 到 `main` 分支
2. GitHub Actions 自动跑 build → 部署 Pages
3. 首次部署完成后访问 https://freyahackingcode.github.io/lock-demo/

**小米内网 GitLab（备）**：
仓库同时推送到 `git.n.xiaomi.com:zhangyunqing1/lock-demo`，供内网 clone。

## 相关背景

需求分析、竞品对标、客诉数据分析等背景资料存放在项目 owner 的 pm_agent 工作空间中，本 repo 仅包含 demo 代码。
