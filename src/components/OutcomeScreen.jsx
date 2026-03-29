import './OutcomeScreen.css'

export default function OutcomeScreen({ title, body, feedbackTags, onReflect, onBack, canGoBack }) {
  return (
    <div className="outcome-screen">
      <div className="outcome-screen__inner animate-slide-up">
        {onBack ? (
          <nav className="flow-nav flow-nav--card flow-nav--single" aria-label="Story navigation">
            <button
              type="button"
              className="btn-ghost flow-nav__btn"
              onClick={onBack}
              disabled={!canGoBack}
            >
              ← Previous
            </button>
          </nav>
        ) : null}
        <span className="outcome-screen__stamp">Cut scene</span>
        <h1 className="outcome-screen__title">{title}</h1>
        <p className="outcome-screen__body">{body}</p>
        {feedbackTags.length > 0 && (
          <div className="outcome-screen__tags" aria-label="Moments along the way">
            <span className="outcome-screen__tags-label">Little flags along the way</span>
            <ul>
              {feedbackTags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" className="btn-primary" onClick={onReflect}>
          Debrief →
        </button>
      </div>
    </div>
  )
}
