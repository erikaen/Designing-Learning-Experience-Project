import { useState } from 'react'
import './ReflectionScreen.css'

const SUGGESTIONS = {
  understanding: [
    'I realized I was filling in blanks without meaning to.',
    'Hearing Alex’s side changed how heavy the silence felt.',
    'The deadline made everything feel more personal than it was.',
  ],
  information: [
    'What people said in the group chat.',
    'What showed up in the doc history.',
    'The one-to-one message, even though it came late.',
  ],
  nextTime: [
    'I’d check in sooner, but more privately.',
    'I’d name the tension earlier, with less heat.',
    'I’d ask what “fair” looks like for everyone, not just the grade.',
  ],
}

export default function ReflectionScreen({ onRestart, onBack, canGoBack }) {
  const [open, setOpen] = useState({ u: false, i: false, n: false })
  const [text, setText] = useState({ u: '', i: '', n: '' })

  const pick = (field, value) => {
    setText((t) => ({ ...t, [field]: value }))
  }

  return (
    <div className="reflection-screen">
      <div className="reflection-screen__inner animate-slide-up">
        {onBack ? (
          <nav className="flow-nav flow-nav--card flow-nav--single" aria-label="Debrief navigation">
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
        <h1 className="reflection-screen__title">A moment to pause</h1>
        <p className="reflection-screen__lede">
          No scoring—just your own debrief. What shifted for you?
        </p>

        <section className="reflection-block">
          <label className="reflection-q" htmlFor="ref-u">
            What changed your understanding of the situation?
          </label>
          <textarea
            id="ref-u"
            rows={3}
            className="reflection-input"
            placeholder="Type something, or pick a starting point below…"
            value={text.u}
            onChange={(e) => setText((t) => ({ ...t, u: e.target.value }))}
          />
          <button
            type="button"
            className="reflection-toggle"
            onClick={() => setOpen((o) => ({ ...o, u: !o.u }))}
          >
            {open.u ? 'Hide suggestions' : 'Show suggestions'}
          </button>
          {open.u && (
            <div className="reflection-chips">
              {SUGGESTIONS.understanding.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => pick('u', s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="reflection-block">
          <label className="reflection-q" htmlFor="ref-i">
            What information mattered most?
          </label>
          <textarea
            id="ref-i"
            rows={3}
            className="reflection-input"
            placeholder="Your turn…"
            value={text.i}
            onChange={(e) => setText((t) => ({ ...t, i: e.target.value }))}
          />
          <button
            type="button"
            className="reflection-toggle"
            onClick={() => setOpen((o) => ({ ...o, i: !o.i }))}
          >
            {open.i ? 'Hide suggestions' : 'Show suggestions'}
          </button>
          {open.i && (
            <div className="reflection-chips">
              {SUGGESTIONS.information.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => pick('i', s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="reflection-block">
          <label className="reflection-q" htmlFor="ref-n">
            Would you approach this differently next time?
          </label>
          <textarea
            id="ref-n"
            rows={3}
            className="reflection-input"
            placeholder="Optional—whatever feels true…"
            value={text.n}
            onChange={(e) => setText((t) => ({ ...t, n: e.target.value }))}
          />
          <button
            type="button"
            className="reflection-toggle"
            onClick={() => setOpen((o) => ({ ...o, n: !o.n }))}
          >
            {open.n ? 'Hide suggestions' : 'Show suggestions'}
          </button>
          {open.n && (
            <div className="reflection-chips">
              {SUGGESTIONS.nextTime.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => pick('n', s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="reflection-actions">
          <button type="button" className="btn-ghost" onClick={onRestart}>
            Start over
          </button>
        </div>
      </div>
    </div>
  )
}
