import { useEffect, useMemo, useRef, useState } from 'react'
import { algorithms, categoryById } from '../data/index.js'
import { fileName } from '../lib/files.js'

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')

export default function QuickOpen({ open, onClose }) {
  const dialogRef = useRef(null)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) {
      setQ('')
      setSel(0)
      d.showModal()
    }
    if (!open && d.open) d.close()
  }, [open])

  const results = useMemo(() => {
    const n = normalize(q.trim())
    if (!n) return algorithms
    return algorithms.filter((a) =>
      normalize(
        [fileName(a), a.name, categoryById[a.category].name, ...a.problems.map((p) => `${p.id} ${p.title}`)].join(' '),
      ).includes(n),
    )
  }, [q])

  const go = (a) => {
    window.location.hash = `#/algo/${a.slug}`
    onClose()
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => Math.min(results.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => Math.max(0, s - 1))
    } else if (e.key === 'Enter' && results[sel]) {
      e.preventDefault()
      go(results[sel])
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="qo"
      aria-label="Mở nhanh"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <label className="qo__field">
        <span className="sr-only">Tìm thuật toán hoặc số bài LeetCode</span>
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setSel(0)
          }}
          onKeyDown={onKey}
          placeholder="Gõ tên thuật toán hoặc số bài, ví dụ: dijkstra, 704"
          role="combobox"
          aria-expanded="true"
          aria-controls="qo-list"
          aria-activedescendant={results[sel] ? `qo-${results[sel].slug}` : undefined}
        />
      </label>
      {results.length === 0 ? (
        <p className="qo__empty" role="status">
          Không có file nào khớp "{q}". Thử tên tiếng Anh hoặc số bài LeetCode.
        </p>
      ) : (
        <ul id="qo-list" className="qo__list" role="listbox" aria-label="Kết quả">
          {results.map((a, i) => (
            <li
              key={a.slug}
              id={`qo-${a.slug}`}
              role="option"
              aria-selected={i === sel}
              className={i === sel ? 'is-sel' : undefined}
              onMouseEnter={() => setSel(i)}
              onClick={() => go(a)}
            >
              <span className="qo__file">{fileName(a)}</span>
              <span className="qo__dir">{a.category}/</span>
            </li>
          ))}
        </ul>
      )}
      <p className="qo__hint">
        <kbd>↑</kbd> <kbd>↓</kbd> chọn · <kbd>Enter</kbd> mở · <kbd>Esc</kbd> đóng
      </p>
    </dialog>
  )
}
