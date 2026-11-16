import { useMemo, useState } from 'react'
import { tokenize } from '../lib/highlight.js'

// Tách token theo dòng để hiển thị số dòng như trong editor.
function toLines(tokens) {
  const lines = [[]]
  tokens.forEach((t) => {
    const parts = t.text.split('\n')
    parts.forEach((p, i) => {
      if (i > 0) lines.push([])
      if (p) lines[lines.length - 1].push({ type: t.type, text: p })
    })
  })
  return lines
}

export default function CodeBlock({ code, title = 'Java' }) {
  const lines = useMemo(() => toLines(tokenize(code)), [code])
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code">
      <div className="code__bar">
        <span className="code__title">{title}</span>
        <button type="button" className="btn btn--sm" onClick={copy} aria-live="polite">
          {copied ? 'Đã chép' : 'Chép'}
        </button>
      </div>
      <pre tabIndex={0} aria-label={`Code: ${title}`}>
        <code>
          {lines.map((ln, i) => (
            <span className="ln" key={i}>
              <span className="ln__no" aria-hidden="true">
                {i + 1}
              </span>
              <span className="ln__src">
                {ln.map((t, k) =>
                  t.type === 'plain' ? t.text : <span key={k} className={`tk-${t.type}`}>{t.text}</span>,
                )}
                {'\n'}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
