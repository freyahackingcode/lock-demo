import { useEffect, useState } from 'react'

let pushFn = null
export function toast(msg) { if (pushFn) pushFn(msg) }

export function ToastHost() {
  const [list, setList] = useState([])
  useEffect(() => {
    pushFn = (msg) => {
      const id = Date.now() + Math.random()
      setList((s) => [...s, { id, msg }])
      setTimeout(() => setList((s) => s.filter((x) => x.id !== id)), 1800)
    }
    return () => { pushFn = null }
  }, [])
  return (
    <div className="toast-host">
      {list.map((t) => <div key={t.id} className="toast-item">{t.msg}</div>)}
    </div>
  )
}
