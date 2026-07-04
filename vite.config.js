import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 GitHub Pages 子路径 /lock-demo/，本地 dev 用根路径
// 演示地址：https://freyahackingcode.github.io/lock-demo/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/lock-demo/' : '/',
  plugins: [react()],
  server: { port: 5180, host: true },
}))
