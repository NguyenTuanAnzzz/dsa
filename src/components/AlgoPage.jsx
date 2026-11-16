import { useState } from 'react'
import { algorithms, categoryById, leetcodeUrl } from '../data/index.js'
import { baseName, pad } from '../lib/files.js'
import CodeBlock from './CodeBlock.jsx'
import Visualizer from './Visualizer.jsx'
import Panel from './Panel.jsx'
import { ComplexityChart, classOf } from './Charts.jsx'

const snake = (name) =>
  baseName(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toUpperCase()

export default function AlgoPage({ algo, done, onToggle }) {
  const [showSolution, setShowSolution] = useState(false)
  const cat = categoryById[algo.category]
  const prev = algorithms[algo.day - 2]
  const next = algorithms[algo.day]
  const featured = algo.problems.find((p) => p.id === algo.solution.problemId)
  const others = algo.problems.filter((p) => p.id !== featured.id)
  const isDone = done.has(algo.slug)

  return (
    <article className="algo" key={algo.slug}>
      <nav className="crumbs" aria-label="Đường dẫn">
        <a href="#/">Bảng điều khiển</a>
        <span aria-hidden="true">/</span>
        <span>{cat.id}</span>
      </nav>

      <section className="panel algo__head" aria-labelledby="algo-title">
        <div>
          <p className="callsign callsign--sm">
            DAY-{pad(algo.day)}
            <span className={isDone ? 'status-dot' : 'status-dot is-off'}>{isDone ? 'ĐÃ HỌC' : 'CHƯA HỌC'}</span>
          </p>
          <h1 id="algo-title" className="algo__title">
            {algo.name}
          </h1>
          <p className="dim mono-sub">
            {snake(algo.name)} · {cat.name}
          </p>
        </div>
        <button
          type="button"
          className={isDone ? 'btn btn--done' : 'btn btn--primary'}
          aria-pressed={isDone}
          onClick={() => onToggle(algo.slug)}
        >
          {isDone ? 'Đã học xong' : 'Đánh dấu đã học'}
        </button>
      </section>

      <div className="algo__grid">
        <div className="algo__col">
          <Panel id="theory" title="Lý thuyết">
            <p className="prose">{algo.theory}</p>
          </Panel>

          <Panel id="how" title="Cách hoạt động">
            <ol className="steps">
              {algo.steps.map((s, i) => (
                <li key={i}>
                  <span className="steps__no">{pad(i + 1)}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Panel>

          {algo.viz && <Visualizer key={algo.slug} kind={algo.viz} />}

          <Panel id="code" title="Code Java">
            <CodeBlock code={algo.code} title={`${baseName(algo.name)}.java`} />
          </Panel>
        </div>

        <div className="algo__col">
          <Panel id="cx" title="Độ phức tạp">
            <dl className="kv kv--2">
              <div>
                <dt>Tốt nhất</dt>
                <dd>{algo.complexity.best}</dd>
              </div>
              <div>
                <dt>Trung bình</dt>
                <dd>{algo.complexity.average}</dd>
              </div>
              <div>
                <dt>Xấu nhất</dt>
                <dd className="mint">{algo.complexity.worst}</dd>
              </div>
              <div>
                <dt>Bộ nhớ</dt>
                <dd>{algo.complexity.space}</dd>
              </div>
            </dl>
            <p className="dim small cx-note">Đường sáng là lớp của trường hợp xấu nhất. Rê chuột lên biểu đồ để so sánh tại từng n.</p>
            <ComplexityChart highlight={classOf(algo.complexity.worst)} />
          </Panel>

          <Panel id="tip" title="Ghi nhớ">
            <p className="prose">{algo.insight}</p>
          </Panel>

          <Panel
            id="today"
            title="Bài LeetCode hôm nay"
            className="panel--accent"
            action={
              <a href={leetcodeUrl(featured.slug)} target="_blank" rel="noopener noreferrer" className="iconlink" aria-label={`Mở bài ${featured.id} trên LeetCode (tab mới)`}>
                ↗
              </a>
            }
          >
            <a href={leetcodeUrl(featured.slug)} target="_blank" rel="noopener noreferrer" className="task">
              <span className="task__id">{featured.id}</span>
              <span className="task__title">
                {featured.title}
                <span className="sr-only"> (mở tab mới)</span>
              </span>
            </a>
            <p className="task__meta">
              <span className={`diff diff--${featured.difficulty.toLowerCase()}`}>{featured.difficulty}</span>
              {featured.premium && <span className="tag">Premium</span>}
            </p>
            <p className="prose small">{featured.note}</p>
          </Panel>

          <Panel id="more" title="Luyện thêm cùng dạng">
            <ul className="more">
              {others.map((p) => (
                <li key={p.id}>
                  <a href={leetcodeUrl(p.slug)} target="_blank" rel="noopener noreferrer" className="ext">
                    {p.id}. {p.title}
                    <span className="sr-only"> (mở tab mới)</span>
                  </a>
                  <span className="more__meta">
                    <span className={`diff diff--${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                    {p.premium && <span className="tag">Premium</span>}
                  </span>
                  <p className="dim small">{p.note}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel
        id="solution"
        title={`Lời giải · ${featured.id}. ${featured.title}`}
        className="algo__solution"
        action={
          <button
            type="button"
            className="btn btn--xs"
            aria-expanded={showSolution}
            aria-controls="solution-body"
            onClick={() => setShowSolution((v) => !v)}
          >
            {showSolution ? 'Ẩn lời giải' : 'Làm xong rồi, xem lời giải'}
          </button>
        }
      >
        {showSolution ? (
          <div id="solution-body" className="solution__body">
            <p className="prose">{algo.solution.explain}</p>
            <CodeBlock code={algo.solution.code} title={`Solution${featured.id}.java`} />
          </div>
        ) : (
          <p className="dim">Lời giải đang ẩn để bạn tự làm trước.</p>
        )}
      </Panel>

      <nav className="pager" aria-label="Chuyển ngày">
        {prev ? (
          <a href={`#/algo/${prev.slug}`} className="pager__link">
            <span className="dim">Ngày {pad(prev.day)}</span>
            {prev.name}
          </a>
        ) : (
          <a href="#/" className="pager__link">
            <span className="dim">Quay lại</span>
            Bảng điều khiển
          </a>
        )}
        {next && (
          <a href={`#/algo/${next.slug}`} className="pager__link pager__link--next">
            <span className="dim">Ngày {pad(next.day)}</span>
            {next.name}
          </a>
        )}
      </nav>
    </article>
  )
}
