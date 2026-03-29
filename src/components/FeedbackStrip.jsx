import './FeedbackStrip.css'

export default function FeedbackStrip({ tags }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className="feedback-strip animate-fade-in">
      {tags.map((t) => (
        <span key={t} className="feedback-strip__tag">
          {t}
        </span>
      ))}
    </div>
  )
}
