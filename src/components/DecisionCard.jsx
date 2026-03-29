import './DecisionCard.css'

const ACCENTS = ['#ff7043', '#42a5f5', '#66bb6a']

export default function DecisionCard({ prompt, choices, onChoose, disabled }) {
  return (
    <div className="decision-card animate-slide-up">
      <div className="decision-card__scene">
        <span className="decision-card__ribbon">Your move</span>
        <p className="decision-card__prompt">{prompt}</p>
      </div>
      <ul className="decision-card__choices">
        {choices.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className="decision-card__btn"
              style={{ '--choice-accent': ACCENTS[i % ACCENTS.length] }}
              disabled={disabled}
              onClick={() => onChoose(c.id)}
            >
              <span className="decision-card__num" aria-hidden>
                {i + 1}
              </span>
              <span className="decision-card__text">{c.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
