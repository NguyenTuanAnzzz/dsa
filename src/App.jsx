import { useEffect, useState } from 'react'
import { algorithmBySlug, algorithms } from './data/index.js'
import { useHashRoute, useProgress } from './lib/progress.js'
import { fileName } from './lib/files.js'
import QuickOpen from './components/QuickOpen.jsx'
import Home from './components/Home.jsx'
import AlgoPage from './components/AlgoPage.jsx'

export default function App() {
  const route = useHashRoute()
  const { done, log, toggle, reset } = useProgress()
  const algo = route.page === 'algo' ? algorithmBySlug[route.slug] : null
  const [quickOpen, setQuickOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setQuickOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.title = algo ? `${fileName(algo).replace('.md', '')} · DSA mỗi ngày` : 'DSA mỗi ngày'
  }, [algo])

  const confirmReset = () => {
    if (window.confirm('Xóa toàn bộ tiến độ và nhật ký đã lưu trên trình duyệt này?')) reset()
  }

  return (
    <>
      <a href="#main" className="skip">Bỏ qua tới nội dung</a>
      <header className="topbar">
        <div className="wrap topbar__inner">
          <a href="#/" className="brand">
            DSA-40
            <span className="brand__sub">mỗi ngày một thuật toán</span>
          </a>
          <button type="button" className="search-trigger" onClick={() => setQuickOpen(true)}>
            <span className="search-trigger__text">Tìm thuật toán, số bài LeetCode</span>
            <kbd>Ctrl K</kbd>
          </button>
          <p className="topbar__stat" aria-label={`Đã học ${done.size} trên ${algorithms.length} ngày`}>
            <span className="dim">Tiến độ</span> {done.size}/{algorithms.length}
          </p>
        </div>
      </header>

      <main id="main" className="wrap">
        {route.page === 'home' && <Home done={done} log={log} onToggle={toggle} onReset={confirmReset} />}
        {algo && <AlgoPage algo={algo} done={done} onToggle={toggle} />}
        {route.page === 'algo' && !algo && (
          <div className="state state--error state--page" role="alert">
            <p>Không tìm thấy nhiệm vụ "{route.slug}".</p>
            <p className="dim">Đường dẫn có thể đã đổi tên.</p>
            <a href="#/" className="btn">Về bảng điều khiển</a>
          </div>
        )}
      </main>

      <footer className="foot wrap">
        <p>Tiến độ và nhật ký lưu trong trình duyệt của bạn. Đề bài thuộc về LeetCode, liên kết mở trang gốc.</p>
      </footer>

      <QuickOpen open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  )
}
