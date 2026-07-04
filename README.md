# 小米智能门锁 · 电量管理改版 Demo

基于 React + Vite 的门锁插件原型 Demo，用于电量管理改版的方案预演与竞品对标演示。

## 演示地址

CI 构建完成后由 GitLab Pages 提供访问入口，具体链接见 **项目 Settings > Pages**（首次部署后可见）。

## 本地启动

前置：Node.js 18+ / npm

```bash
git clone git@git.n.xiaomi.com:zhangyunqing1/lock-demo.git
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

构建时会启用 `base: '/lock-demo/'`，用于 GitLab Pages 子路径部署；本地 dev 时使用根路径。

## 目录结构

```
lock-demo/
├── src/                 # 源码
│   ├── App.jsx
│   ├── pages/          # 各功能页面
│   │   └── ElectricityManagement/   # 电量管理改版模块
│   └── styles/
├── public/             # 静态资源（构建时产物覆盖）
├── vite.config.js
└── .gitlab-ci.yml      # CI/CD 配置，push 后自动部署 Pages
```

## 部署流程

1. push 到 `main` 分支
2. GitLab Runner 自动跑 `pages` job：`npm ci` → `npm run build` → 输出到 `public/`
3. 部署完成后在 project **Settings > Pages** 查看访问地址

## 相关文档

需求分析、竞品对标、客诉数据分析等背景资料存放在项目 owner 的 pm_agent 工作空间中，本 repo 仅包含 demo 代码。
