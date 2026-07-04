#!/bin/bash
# 停止 Demo 后台服务

PORT=4321

echo "=============================="
echo "   停止电量管理 Demo"
echo "=============================="
echo ""

# 按 PID 停
if [ -f /tmp/lock-demo.pid ]; then
  PID=$(cat /tmp/lock-demo.pid)
  kill $PID 2>/dev/null
  rm -f /tmp/lock-demo.pid
fi

# 兜底：按端口找进程
PORT_PID=$(lsof -ti :$PORT 2>/dev/null)
if [ -n "$PORT_PID" ]; then
  kill $PORT_PID 2>/dev/null
fi

# 再兜底：pkill
pkill -f "vite preview --port $PORT" 2>/dev/null

sleep 1

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
if [ "$STATUS" = "200" ]; then
  echo "⚠️  Demo 仍在运行，可能有多个进程"
  echo "   手动执行：pkill -9 -f vite"
else
  echo "✓ Demo 已停止"
fi

echo ""
echo "3 秒后关闭此窗口…"
sleep 3
