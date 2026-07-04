#!/bin/bash
# 电量管理 Demo 一键启动
# 双击本文件即可运行，关闭窗口后 demo 继续在后台运行

cd "$(dirname "$0")"

PORT=4321
URL="http://localhost:$PORT/#elec"

echo "=============================="
echo "   电量管理 Demo"
echo "=============================="
echo ""

# 已在运行 → 直接打开浏览器
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
if [ "$STATUS" = "200" ]; then
  echo "✓ Demo 已在后台运行"
  echo "  地址：$URL"
  open "$URL"
  echo ""
  echo "3 秒后关闭此窗口…"
  sleep 3
  exit 0
fi

# 首次运行 → 装依赖
if [ ! -d "node_modules" ]; then
  echo "⚙️  首次运行，安装依赖中（约 30 秒）…"
  /usr/local/bin/npm install || { echo "❌ npm install 失败"; read -n 1; exit 1; }
fi

# 构建静态包（比 dev 快 & 更稳）
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo "⚙️  首次构建（约 3 秒）…"
  /usr/local/bin/npm run build || { echo "❌ 构建失败"; read -n 1; exit 1; }
fi

echo "🚀 启动服务…"

# nohup + disown 让进程脱离终端，关窗后不挂
nohup /usr/local/bin/npm run preview -- --port $PORT > /tmp/lock-demo.log 2>&1 &
PID=$!
disown
echo $PID > /tmp/lock-demo.pid

# 等待就绪
for i in {1..20}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
  if [ "$STATUS" = "200" ]; then
    break
  fi
  sleep 0.3
done

# 打开浏览器
open "$URL"

echo ""
echo "✓ Demo 已启动"
echo "  地址：$URL"
echo ""
echo "▸ 关闭此终端窗口不会停止 Demo"
echo "▸ 停止 Demo：双击『停止Demo.command』"
echo "▸ 日志：tail -f /tmp/lock-demo.log"
echo ""
echo "3 秒后关闭此窗口…"
sleep 3
