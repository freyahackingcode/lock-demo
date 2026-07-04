import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitLab Pages 部署到子路径 /lock-demo/，本地 dev 时用相对根
// 通过 command 参数区分：dev 用 '/', build 用 '/lock-demo/'
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/lock-demo/' : '/',
  plugins: [react()],
  server: { port: 5180, host: true },
}))
