import { useCallback, useEffect, useMemo, useState } from 'react'

const KEY = 'dsa-daily:log'
const OLD_KEY = 'dsa-daily:done'

// Lưu { slug: thời điểm đánh dấu (ms) } trong localStorage của trình duyệt.
function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const obj = JSON.parse(raw)
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj
    }
    // Chuyển dữ liệu từ bản cũ (mảng slug, không có thời điểm).
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || '[]')
    if (Array.isArray(old)) return Object.fromEntries(old.map((s) => [s, null]))
  } catch {
    /* dữ liệu hỏng hoặc bị chặn: bắt đầu lại */
  }
  return {}
}

export function useProgress() {
  const [log, setLog] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(log))
    } catch {
      /* chế độ ẩn danh: chỉ giữ trong phiên */
    }
  }, [log])

  const done = useMemo(() => new Set(Object.keys(log)), [log])

  const toggle = useCallback((slug) => {
    setLog((prev) => {
      const next = { ...prev }
      if (slug in next) delete next[slug]
      else next[slug] = Date.now()
      return next
    })
  }, [])

  const reset = useCallback(() => setLog({}), [])

  return { done, log, toggle, reset }
}

export function useHashRoute() {
  const parse = () => {
    const h = window.location.hash.replace(/^#\/?/, '')
    const [path] = h.split('?')
    const [page, slug] = path.split('/')
    if (page === 'algo' && slug) return { page: 'algo', slug: decodeURIComponent(slug) }
    return { page: 'home' }
  }
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
