import { Component, Suspense, lazy, useCallback, useMemo, useState } from 'react'
import { algorithmBySlug, algorithms, categories, categoryById, leetcodeUrl } from '../data/index.js'
import { fileName, pad } from '../lib/files.js'
import Panel, { Meter, Segs } from './Panel.jsx'
import { ActivityChart } from './Charts.jsx'

const StationScene = lazy(() => import('./StationScene.jsx'))

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const totalProblems = new Set(algorithms.flatMap((a) => a.problems.map((p) => p.id))).size

const fmtTime = (ts) => {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Home({ done, log, onToggle, onReset }) {
  const [rotating, setRotating] = useState(true)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [filter, setFilter] = useState('all')

  const nextUp = algorithms.find((a) => !done.has(a.slug))
  const doneCount = done.size
  const featured = (a) => a.problems.find((p) => p.id === a.solution.problemId)

  const byDiff = useMemo(() => {
    const r = { Easy: [0, 0], Medium: [0, 0], Hard: [0, 0] }
    algorithms.forEach((a) => {
      const d = featured(a).difficulty
      r[d][1]++
      if (done.has(a.slug)) r[d][0]++
    })
    return r
  }, [done])

  const recent = useMemo(
    () =>
      Object.entries(log)
        .filter(([s, t]) => t && algorithmBySlug[s])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4),
    [log],
  )
  const firstTs = useMemo(() => Math.min(...Object.values(log).filter(Boolean)), [log])

  const curCat = nextUp ? nextUp.category : 'tree'
  const curItems = algorithms.filter((a) => a.category === curCat)
  const curDone = curItems.filter((a) => done.has(a.slug)).length

  const list = algorithms.filter(
    (a) => filter === 'all' || a.category === filter || (a.alsoIn || []).includes(filter),
  )

  const onPick = useCallback((slug) => {
    window.location.hash = `#/algo/${slug}`
  }, [])

  return (
    <div className="mc">
      <h1 className="sr-only">DSA mỗi ngày: bảng điều khiển học thuật toán</h1>

      <Panel
        id="station"
        title="Trạm DSA · 40 khối = 40 ngày"
        className="mc__station"
        action={
          !sceneFailed && (
            <button type="button" className="btn btn--xs" aria-pressed={!rotating} onClick={() => setRotating((r) => !r)}>
              {rotating ? 'Dừng xoay' : 'Xoay tiếp'}
            </button>
          )
        }
      >
        {sceneFailed ? (
          <div className="state state--error" role="alert">
            <p>Trình duyệt không bật được WebGL nên không vẽ được mô hình 3D.</p>
            <p className="dim">Danh sách nhiệm vụ bên dưới vẫn dùng bình thường.</p>
          </div>
        ) : (
          <SceneBoundary
            fallback={
              <div className="state state--error" role="alert">
                <p>Không tải được mô hình 3D.</p>
                <p className="dim">Tải lại trang hoặc dùng danh sách nhiệm vụ bên dưới.</p>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="state" role="status">
                  <p className="blink">Đang khởi tạo mô hình 3D...</p>
                </div>
              }
            >
              <StationScene
                done={done}
                nextSlug={nextUp?.slug}
                rotating={rotating}
                onPick={onPick}
                onError={() => setSceneFailed(true)}
              />
            </Suspense>
          </SceneBoundary>
        )}
        <p className="station__hint">Kéo để xoay · cuộn để phóng to · bấm vào một khối để mở ngày học</p>
        <ul className="station-legend">
          {categories.map((c) => {
            const items = algorithms.filter((a) => a.category === c.id)
            const n = items.filter((a) => done.has(a.slug)).length
            return (
              <li key={c.id}>
                <span>{c.id.toUpperCase()}</span>
                <Segs total={items.length} on={n} label={`${c.name}: ${n} trên ${items.length}`} />
                <span className="dim">
                  {n}/{items.length}
                </span>
              </li>
            )
          })}
        </ul>
      </Panel>

      <div className="mc__side">
        <Panel id="progress" title="Tiến độ">
          <Meter label="Tổng số ngày" value={doneCount} max={algorithms.length} />
          {Object.entries(byDiff).map(([d, [v, m]]) => (
            <Meter key={d} label={`Bài chính mức ${d}`} value={v} max={m} />
          ))}
        </Panel>

        <div className="mc__pair">
          <Panel
            id="next"
            title="Nhiệm vụ kế tiếp"
            action={
              nextUp && (
                <a href={`#/algo/${nextUp.slug}`} className="iconlink" aria-label={`Mở ${nextUp.name}`}>
                  ↗
                </a>
              )
            }
          >
            {nextUp ? (
              <>
                <dl className="kv kv--3">
                  <div>
                    <dt>Ngày</dt>
                    <dd>{pad(nextUp.day)}</dd>
                  </div>
                  <div>
                    <dt>Dạng</dt>
                    <dd>{nextUp.category}</dd>
                  </div>
                  <div>
                    <dt>LeetCode</dt>
                    <dd>{nextUp.solution.problemId}</dd>
                  </div>
                </dl>
                <a href={`#/algo/${nextUp.slug}`} className="next__name">
                  {nextUp.name}
                </a>
                <p className="dim small">{featured(nextUp).title}</p>
              </>
            ) : (
              <p>Đã hoàn thành cả {algorithms.length} ngày.</p>
            )}
          </Panel>

          <Panel id="activity" title="Hoạt động 14 ngày">
            <ActivityChart log={log} />
          </Panel>
        </div>
      </div>

      <div className="mc__bottom">
        <Panel id="info" title="Hồ sơ lộ trình" className="mc__info">
          <p className="callsign">
            DSA-40 <span className="status-dot">{doneCount === algorithms.length ? 'HOÀN THÀNH' : 'ĐANG HỌC'}</span>
          </p>
          <dl className="kv kv--2">
            <div>
              <dt>Số ngày</dt>
              <dd>{algorithms.length}</dd>
            </div>
            <div>
              <dt>Số dạng</dt>
              <dd>{categories.length}</dd>
            </div>
            <div>
              <dt>Bài LeetCode</dt>
              <dd>{totalProblems} bài khác nhau</dd>
            </div>
            <div>
              <dt>Ngôn ngữ</dt>
              <dd>Java</dd>
            </div>
            <div>
              <dt>Bắt đầu</dt>
              <dd>{Number.isFinite(firstTs) ? fmtTime(firstTs).slice(0, 10) : 'chưa bắt đầu'}</dd>
            </div>
            <div>
              <dt>Lưu tại</dt>
              <dd>trình duyệt này</dd>
            </div>
          </dl>
        </Panel>

        <Panel id="scan" title={`Đang học: ${categoryById[curCat].name}`}>
          <div className="scan">
            <span className="scan__name">{curCat.toUpperCase()}</span>
            <span className="scan__pct">{Math.round((curDone / curItems.length) * 100)}%</span>
          </div>
          <div className="scan__bars">
            {curItems.map((a) => (
              <a
                key={a.slug}
                href={`#/algo/${a.slug}`}
                className={done.has(a.slug) ? 'scan__seg on' : a.slug === nextUp?.slug ? 'scan__seg cur' : 'scan__seg'}
                aria-label={`Ngày ${a.day}: ${a.name}${done.has(a.slug) ? ', đã học' : ''}`}
                title={a.name}
              />
            ))}
          </div>
        </Panel>

        <Panel
          id="logs"
          title="Nhật ký"
          action={
            doneCount > 0 && (
              <button type="button" className="btn btn--xs" onClick={onReset}>
                Xóa tiến độ
              </button>
            )
          }
        >
          {recent.length === 0 ? (
            <p className="dim">Chưa có mục nào. Mỗi lần bạn đánh dấu một ngày đã học, nhật ký ghi lại ở đây.</p>
          ) : (
            <ol className="logs">
              {recent.map(([slug, ts]) => (
                <li key={slug}>
                  <span className="dim">{fmtTime(ts)}</span> <span className="mint">Done</span>{' '}
                  <a href={`#/algo/${slug}`}>{fileName(algorithmBySlug[slug])}</a>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Panel id="missions" title="Danh sách nhiệm vụ" className="mc__list">
        <div className="chips" role="group" aria-label="Lọc theo dạng">
          {[{ id: 'all', name: 'Tất cả' }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              className={filter === c.id ? 'chip is-on' : 'chip'}
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.id === 'all' ? c.name : c.id.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th scope="col">Ngày</th>
                <th scope="col">Thuật toán</th>
                <th scope="col">Dạng</th>
                <th scope="col">LeetCode</th>
                <th scope="col">
                  <span className="sr-only">Đã học</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const p = featured(a)
                const isDone = done.has(a.slug)
                return (
                  <tr key={a.slug} className={isDone ? 'is-done' : a.slug === nextUp?.slug ? 'is-next' : undefined}>
                    <td className="num">{pad(a.day)}</td>
                    <td>
                      <a href={`#/algo/${a.slug}`} className="tbl__name">
                        {a.name}
                      </a>
                    </td>
                    <td className="dim">{a.category}</td>
                    <td>
                      <a href={leetcodeUrl(p.slug)} target="_blank" rel="noopener noreferrer" className="ext">
                        {p.id}. {p.title}
                        <span className="sr-only"> (mở tab mới)</span>
                      </a>{' '}
                      <span className={`diff diff--${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                    </td>
                    <td className="cell-check">
                      <label className="check">
                        <input type="checkbox" checked={isDone} onChange={() => onToggle(a.slug)} />
                        <span className="sr-only">Đánh dấu ngày {a.day} đã học</span>
                      </label>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
