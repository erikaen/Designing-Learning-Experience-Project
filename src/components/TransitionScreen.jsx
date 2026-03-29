import './TransitionScreen.css'

export default function TransitionScreen({ title, subtitle, onContinue, onBack, canGoBack }) {
  return (
    <div className="transition-screen">
      <div className="transition-screen__card animate-slide-up">
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
        <span className="transition-screen__stamp">Time skip</span>
        <p className="transition-screen__title">{title}</p>
        {subtitle ? <p className="transition-screen__sub">{subtitle}</p> : null}
        <button type="button" className="btn-primary" onClick={onContinue}>
          Jump ahead →
        </button>
      </div>
    </div>
  )
}
