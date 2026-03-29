import CharacterSprite, { CAST } from './CharacterSprite.jsx'
import './SceneStage.css'

export default function SceneStage({
  scenario,
  sceneTitle,
  tagline,
  spotlight,
  onBack,
  canGoBack,
  children,
}) {
  const bg = scenario === 2 ? 'scene-stage--late' : 'scene-stage--study'

  return (
    <div className={`scene-stage ${bg}`}>
      <div className="scene-stage__decor" aria-hidden>
        <span className="scene-stage__cloud scene-stage__cloud--1" />
        <span className="scene-stage__cloud scene-stage__cloud--2" />
        <span className="scene-stage__sun" />
      </div>

      <div className="scene-stage__plate">
        {onBack ? (
          <nav className="scene-stage__nav flow-nav flow-nav--single" aria-label="Scene navigation">
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
        <header className="scene-stage__header">
          <div className="scene-stage__badge">Role-play</div>
          <h1 className="scene-stage__title">{sceneTitle}</h1>
          {tagline ? <p className="scene-stage__tagline">{tagline}</p> : null}
        </header>

        <aside className="scene-stage__cast" aria-label="Characters in this scene">
          <p className="scene-stage__cast-label">Your cast</p>
          <div className="scene-stage__cast-row">
            {CAST.map((c) => (
              <div
                key={c.role}
                className={`scene-stage__actor ${
                  spotlight === c.role ? 'scene-stage__actor--lit' : ''
                }`}
              >
                <CharacterSprite role={c.role} size="sm" />
                <span className="scene-stage__actor-name">{c.name}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="scene-stage__main">{children}</div>
      </div>
    </div>
  )
}
