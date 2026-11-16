import { useMemo, useState } from 'react'

const DAY = 86400000
const startOfDay = (t) => {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}
const fmt = (t) => {
  const d = new Date(t)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Số ngày học đã đánh dấu theo từng ngày lịch, 14 ngày gần nhất. Dữ liệu thật từ localStorage.
export function ActivityChart({ log }) {
  const [hover, setHover] = useState(null)
  const days = useMemo(() => {
    const today = startOfDay(Date.now())
    const buckets = Array.from({ length: 14 }, (_, i) => ({ t: today - (13 - i) * DAY, n: 0 }))
    Object.values(log).forEach((ts) => {
      if (!ts) return
      const idx = 13 - Math.round((today - startOfDay(ts)) / DAY)
      if (idx >= 0 && idx < 14) buckets[idx].n++
    })
    return buckets
  }, [log])

  const total = days.reduce((s, d) => s + d.n, 0)
  const max = Math.max(2, ...days.map((d) => d.n))
  const W = 280
  const H = 120
  const bw = W / 14

  if (total === 0) {
    return (
      <div className="chart-empty">
        <p>Chưa có hoạt động trong 14 ngày qua.</p>
        <p className="dim">Đánh dấu một ngày đã học, cột đầu tiên sẽ hiện ở đây.</p>
      </div>
    )
  }

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={`Số bài đã học mỗi ngày, 14 ngày gần nhất. Tổng ${total}.`}>
        {[0.5, 1].map((f) => (
          <line key={f} x1="0" x2={W} y1={H - f * H} y2={H - f * H} className="chart__grid" />
        ))}
        <line x1="0" x2={W} y1={H} y2={H} className="chart__axis" />
        {days.map((d, i) => {
          const h = (d.n / max) * (H - 8)
          const x = i * bw + 3
          return (
            <g key={d.t} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={i * bw} y="0" width={bw} height={H} fill="transparent" />
              {d.n > 0 && (
                <path
                  className={hover === i ? 'chart__bar is-hover' : 'chart__bar'}
                  d={`M${x},${H} V${H - h + 3} q0,-3 3,-3 h${bw - 12} q3,0 3,3 V${H} Z`}
                />
              )}
            </g>
          )
        })}
        {[0, 6, 13].map((i) => (
          <text key={i} x={i * bw + bw / 2} y={H + 14} textAnchor="middle" className="chart__tick">
            {fmt(days[i].t)}
          </text>
        ))}
      </svg>
      {hover !== null && (
        <div className="chart__tip" style={{ left: `${((hover + 0.5) / 14) * 100}%` }} role="status">
          {fmt(days[hover].t)}: {days[hover].n} bài
        </div>
      )}
      <table className="sr-only">
        <caption>Số bài đã học theo ngày</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.t}>
              <th scope="row">{fmt(d.t)}</th>
              <td>{d.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

const CLASSES = [
  { id: '1', label: 'O(1)', f: () => 1 },
  { id: 'log', label: 'O(log n)', f: (n) => Math.log2(n) },
  { id: 'n', label: 'O(n)', f: (n) => n },
  { id: 'nlog', label: 'O(n log n)', f: (n) => n * Math.log2(n) },
  { id: 'n2', label: 'O(n²)', f: (n) => n * n },
]

export function classOf(expr) {
  const e = expr.replace(/\s/g, '')
  if (/n²|n\^2|n·n|V³|n³|2\^|9\^|n!/.test(e)) return 'n2'
  if (/nlogn|ElogE|ElogV|\(V\+E\)logV|nloglogn/.test(e)) return 'nlog'
  if (/log/.test(e)) return 'log'
  if (/^O\(1\)$/.test(e)) return '1'
  return 'n'
}

// Đường cong tăng trưởng của các lớp độ phức tạp, tô sáng lớp của thuật toán hiện tại.
export function ComplexityChart({ highlight }) {
  const [n, setN] = useState(null)
  const W = 320
  const H = 130
  const N = 32
  const maxY = N * Math.log2(N) * 1.15
  const y = (v) => H - Math.min(v / maxY, 1) * H
  const x = (i) => (i / N) * W

  const paths = CLASSES.map((c) => {
    let d = ''
    for (let i = 1; i <= N; i += 0.5) {
      const v = c.f(i)
      d += `${d ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`
      if (v > maxY) break
    }
    return { ...c, d }
  })

  return (
    <figure className="chart chart--cx">
      <svg
        viewBox={`0 0 ${W + 80} ${H + 6}`}
        role="img"
        aria-label={`Tốc độ tăng của các lớp độ phức tạp. Thuật toán này thuộc lớp ${CLASSES.find((c) => c.id === highlight)?.label}.`}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * (W + 80)
          setN(px <= W ? Math.max(1, Math.round((px / W) * N)) : null)
        }}
        onMouseLeave={() => setN(null)}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="chart__grid" />
        ))}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={`v${f}`} y1="0" y2={H} x1={W * f} x2={W * f} className="chart__grid" />
        ))}
        <line x1="0" x2={W} y1={H} y2={H} className="chart__axis" />
        {paths.map((p) => (
          <path key={p.id} d={p.d} className={p.id === highlight ? 'chart__line is-on' : 'chart__line'} />
        ))}
        {(() => {
          // Nhãn ở cuối mỗi đường, giãn ra tối thiểu 12px để không chồng nhau.
          const labels = paths.map((p) => ({
            ...p,
            lx: p.id === 'n2' ? x(Math.sqrt(maxY)) + 6 : W + 6,
            ly: p.id === 'n2' ? 8 : y(Math.min(p.f(N), maxY)) + 3,
          }))
          const right = labels.filter((l) => l.id !== 'n2').sort((a, b) => b.ly - a.ly)
          right.forEach((l, i) => {
            if (i === 0) l.ly = Math.min(l.ly, H)
            else l.ly = Math.min(l.ly, right[i - 1].ly - 12)
          })
          return labels.map((l) => (
            <text key={l.id} x={l.lx} y={l.ly} className={l.id === highlight ? 'chart__label is-on' : 'chart__label'}>
              {l.label}
            </text>
          ))
        })()}
        {n && <line x1={x(n)} x2={x(n)} y1="0" y2={H} className="chart__cross" />}
      </svg>
      {n && (
        <div className="chart__tip chart__tip--cx" role="status">
          n = {n}:{' '}
          {CLASSES.map((c) => `${c.label} ≈ ${Math.round(c.f(n))}`).join(' · ')}
        </div>
      )}
    </figure>
  )
}
