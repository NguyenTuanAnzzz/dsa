import { useEffect, useMemo, useState } from 'react'
import { buildSteps, isSearchViz, randomArray } from '../viz/steps.js'

const SPEEDS = [
  { label: 'Chậm', ms: 1100 },
  { label: 'Vừa', ms: 600 },
  { label: 'Nhanh', ms: 250 },
]

export default function Visualizer({ kind }) {
  const search = isSearchViz(kind)
  const [arr, setArr] = useState(() => randomArray(kind))
  const [target, setTarget] = useState(() => (search ? arr[Math.floor(arr.length * 0.7)] : 0))
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const steps = useMemo(() => buildSteps(kind, arr, Number(target)), [kind, arr, target])
  const step = steps[Math.min(i, steps.length - 1)]
  const max = Math.max(...arr, 1)
  const atEnd = i >= steps.length - 1

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setI((x) => x + 1), SPEEDS[speed].ms)
    return () => clearTimeout(id)
  }, [playing, i, atEnd, speed])

  const shuffle = () => {
    const next = randomArray(kind)
    setArr(next)
    if (search) setTarget(next[Math.floor(Math.random() * next.length)])
    setI(0)
    setPlaying(false)
  }

  const onTarget = (e) => {
    setTarget(e.target.value)
    setI(0)
    setPlaying(false)
  }

  const cls = (idx) => {
    const c = ['bar']
    if (step.found === idx) c.push('is-found')
    else if (step.swap.includes(idx)) c.push('is-swap')
    else if (step.compare.includes(idx)) c.push('is-compare')
    else if (step.pointer === idx) c.push('is-pointer')
    else if (step.done.includes(idx)) c.push('is-done')
    if (step.range && (idx < step.range[0] || idx > step.range[1])) c.push('is-out')
    return c.join(' ')
  }

  return (
    <section className="panel viz" aria-labelledby="viz-title">
      <header className="panel__head">
        <h2 id="viz-title" className="panel__title">
          Mô phỏng từng bước
        </h2>
        <span className="panel__meta">
          STEP {String(i + 1).padStart(2, '0')}/{steps.length}
        </span>
      </header>
      <p className="viz__sub">Bấm Bước tiếp để đi từng bước như debugger, hoặc Tự chạy. Mảng mới tạo dữ liệu ngẫu nhiên.</p>

      <div className="viz__stage" role="img" aria-label={`Trạng thái mảng: ${step.arr.join(', ')}`}>
        {step.arr.map((v, idx) => (
          <div key={idx} className={cls(idx)}>
            <div className="bar__fill" style={{ height: `${Math.max(8, (v / max) * 100)}%` }} />
            <span className="bar__val">{v}</span>
            <span className="bar__idx">{idx}</span>
          </div>
        ))}
      </div>

      <p className="viz__msg" aria-live="polite">
        <span className="viz__count">
          {i + 1}/{steps.length}
        </span>
        {step.msg}
      </p>

      <div className="viz__controls">
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>
            Lùi
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              if (atEnd) setI(0)
              setPlaying((p) => !p)
            }}
          >
            {playing ? 'Tạm dừng' : atEnd ? 'Chạy lại' : 'Tự chạy'}
          </button>
          <button type="button" className="btn" onClick={() => setI((x) => Math.min(steps.length - 1, x + 1))} disabled={atEnd}>
            Bước tiếp
          </button>
          <button type="button" className="btn btn--ghost" onClick={shuffle}>
            Mảng mới
          </button>
        </div>

        <div className="viz__opts">
          {search && (
            <label className="field">
              <span>Giá trị cần tìm</span>
              <input type="number" value={target} onChange={onTarget} inputMode="numeric" />
            </label>
          )}
          <fieldset className="seg">
            <legend>Tốc độ</legend>
            {SPEEDS.map((s, k) => (
              <label key={s.label} className={k === speed ? 'seg__opt is-on' : 'seg__opt'}>
                <input type="radio" name={`speed-${kind}`} checked={k === speed} onChange={() => setSpeed(k)} />
                {s.label}
              </label>
            ))}
          </fieldset>
        </div>
      </div>

      <ul className="legend" aria-label="Chú thích màu">
        <li><i className="sw sw--compare" />Đang so sánh</li>
        <li><i className="sw sw--swap" />Vừa thay đổi</li>
        <li><i className="sw sw--done" />Đã đúng vị trí</li>
        {search && <li><i className="sw sw--found" />Tìm thấy</li>}
      </ul>
    </section>
  )
}
