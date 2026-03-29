import './ProgressIndicator.css'

const LABELS = [
  'Title',
  'Intro',
  'Scene 1',
  'Skip',
  'Scene 2',
  'Cut',
  'Debrief',
]

export default function ProgressIndicator({ phase }) {
  const phaseIndex = {
    landing: 0,
    track_intro: 1,
    scenario1: 2,
    transition: 3,
    scenario2: 4,
    outcome: 5,
    reflection: 6,
  }
  const current = phaseIndex[phase] ?? 0
  const total = LABELS.length - 1

  return (
    <div className="progress-indicator" role="status" aria-live="polite">
      <div className="progress-indicator__track">
        <div
          className="progress-indicator__fill"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="progress-indicator__label">{LABELS[current]}</span>
    </div>
  )
}
