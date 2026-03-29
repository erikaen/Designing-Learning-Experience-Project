import CharacterSprite, { CAST } from './CharacterSprite.jsx'
import './LandingPage.css'

const TRACKS = [
  { id: 'pro', title: 'Professional Development', locked: true, emoji: '💼' },
  { id: 'care', title: 'Self-Care', locked: true, emoji: '🌿' },
  { id: 'time', title: 'Time Management', locked: true, emoji: '⏰' },
  { id: 'conflict', title: 'Conflict Resolution', locked: false, emoji: '🤝' },
]

export default function LandingPage({ onSelectTrack }) {
  return (
    <div className="landing">
      <div className="landing__sky" aria-hidden>
        <span className="landing__sun" />
        <span className="landing__cloud landing__cloud--1" />
        <span className="landing__cloud landing__cloud--2" />
      </div>

      <div className="landing__inner">
        <header className="landing__header animate-slide-up">
          <p className="landing__kicker">Campus Stories</p>
          <h1 className="landing__title">Pick your episode</h1>
          <p className="landing__subtitle">
            Step into a scene, play as yourself, and see how the week unfolds. This isn’t a quiz—it’s
            a little role-play with consequences.
          </p>
          <div className="landing__parade" aria-hidden>
            {CAST.map((c) => (
              <CharacterSprite key={c.role} role={c.role} size="lg" />
            ))}
          </div>
        </header>

        <div className="landing__grid">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`track-card ${t.locked ? 'track-card--locked' : ''} animate-slide-up`}
              style={{ animationDelay: `${0.05 * i}s` }}
              disabled={t.locked}
              onClick={() => !t.locked && onSelectTrack(t.id)}
            >
              <span className="track-card__emoji" aria-hidden>
                {t.emoji}
              </span>
              <span className="track-card__title">{t.title}</span>
              {t.locked ? <span className="track-card__badge">Coming soon</span> : null}
              {!t.locked ? <span className="track-card__play">Tap to play →</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
