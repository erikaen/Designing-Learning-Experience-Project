import CharacterSprite, { CAST } from './CharacterSprite.jsx'
import './TrackIntro.css'

export default function TrackIntro({ onBegin, onBack, canGoBack }) {
  return (
    <div className="track-intro">
      <div className="track-intro__card animate-slide-up">
        {onBack ? (
          <nav className="flow-nav flow-nav--card flow-nav--single" aria-label="Episode navigation">
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
        <div className="track-intro__cast">
          {CAST.map((c) => (
            <div key={c.role} className="track-intro__actor">
              <CharacterSprite role={c.role} size="md" />
              <span className="track-intro__name">{c.name}</span>
            </div>
          ))}
        </div>
        <p className="track-intro__label">Episode: Group project</p>
        <p className="track-intro__text">
          You’ve just been assigned a group project worth 40% of your final grade. At first,
          everything seems normal—until it isn’t.
        </p>
        <button type="button" className="btn-primary" onClick={onBegin}>
          Enter the scene
        </button>
      </div>
    </div>
  )
}
