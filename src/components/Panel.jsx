export default function Panel({ title, id, action, className = '', children }) {
  const hid = id ? `${id}-title` : undefined
  return (
    <section className={`panel ${className}`} aria-labelledby={hid}>
      <header className="panel__head">
        <h2 className="panel__title" id={hid}>
          {title}
        </h2>
        {action}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  )
}

export function Segs({ total, on, label }) {
  return (
    <span className="segbar" role="img" aria-label={label || `${on} trên ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < on ? 'on' : undefined} />
      ))}
    </span>
  )
}

export function Meter({ label, value, max, left, right }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="meter">
      <div className="meter__row">
        <span className="meter__label">{label}</span>
        <span className="meter__pct">{pct}%</span>
      </div>
      <div className="meter__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <div className="meter__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="meter__row meter__scale">
        <span>{left ?? 0}</span>
        <span>{right ?? max}</span>
      </div>
    </div>
  )
}
