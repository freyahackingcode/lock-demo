# 电量管理 Demo 使用指南

## 一键启动（推荐）

**双击** `启动Demo.command`（就在这个文件夹里）

- 首次运行会自动装依赖 + 构建，约 30 秒
- 之后每次启动约 2-3 秒
- 启动完自动打开浏览器
- **关闭终端窗口后 Demo 会继续在后台运行**

## 一键停止

**双击** `停止Demo.command`

## 快捷入口

启动后默认打开电量管理页。想直接跳其他状态：

| 页面 | 网址 |
|------|------|
| 主页（标准模式） | http://localhost:4321/#elec |
| 省电模式 | http://localhost:4321/#elec?mode=saving |
| 超级省电模式 | http://localhost:4321/#elec?mode=super |
| 自定义模式 | http://localhost:4321/#elec?mode=custom |
| 模式选择弹窗 | http://localhost:4321/#elec?sheet=1 |
| 超级省电二次确认 | http://localhost:4321/#elec?confirm=1 |
| 相关设置子页 | http://localhost:4321/#elec?sub=1 |
| 一键省电弹窗 | http://localhost:4321/#elec?saving=1 |
| 隐藏顶部 dev-nav | 任意 URL 加 `&clean=1` |

## 首次运行遇到问题

### 双击文件后提示"无法验证开发者"

在 Finder 里 **右键点击文件 → 打开** → 弹窗里再点"打开"，之后就不会拦了。

### 双击后文件用编辑器打开了，不是运行

给文件加执行权限：

1. 打开"终端"
2. 粘贴执行：
   ```
   chmod +x /Users/mi/Projects/pm_agent/lock-demo/启动Demo.command
   chmod +x /Users/mi/Projects/pm_agent/lock-demo/停止Demo.command
   ```

（我已经帮你 chmod 过，正常不需要再执行）

## 想放桌面

在 Finder 里选中两个 `.command` 文件 → 右键 → 制作替身，把替身拖到桌面即可。

## 手动方式（备用）

打开终端跑：

```
cd /Users/mi/Projects/pm_agent/lock-demo
npm run dev    # 开发模式，改代码热更新
# 或
npm run preview -- --port 4321   # 预览模式，稳定
```

## 我在改 demo 代码想看效果

改代码后，先关掉后台服务，再双击启动 → 会重新 build 一次，最新代码生效。

或者用开发模式：
```
cd /Users/mi/Projects/pm_agent/lock-demo && npm run dev
```
开发模式改代码即时刷新，端口是 5180。
