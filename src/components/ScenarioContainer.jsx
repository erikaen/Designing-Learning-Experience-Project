import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react'
import ChatInterface from './ChatInterface.jsx'
import DecisionCard from './DecisionCard.jsx'
import FeedbackStrip from './FeedbackStrip.jsx'
import SceneStage from './SceneStage.jsx'
import { useNarrative } from '../context/NarrativeContext.jsx'
import {
  FEEDBACK_BY_CHOICE,
  getAlexTone,
  getScenario1ClosingNarrative,
} from '../lib/narrative.js'
import './ScenarioContainer.css'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

let msgSeq = 0
function mid() {
  msgSeq += 1
  return `m-${msgSeq}`
}

const D1 = [
  {
    id: 'reactive',
    text: 'They’re probably not putting in effort—I can feel myself getting annoyed.',
  },
  {
    id: 'neutral',
    text: 'I don’t actually know yet. Silence isn’t the same as a full story.',
  },
  {
    id: 'dismissive',
    text: 'Maybe it’s fine for now. I’ll give it a beat before I spin out.',
  },
]

const D2 = [
  { id: 'doc_history', text: 'Sneak a look at the doc history—see if anything actually moved.' },
  {
    id: 'private_message',
    text: 'DM Alex. Keep it one-on-one instead of public pressure.',
    surface: 'chat',
  },
  {
    id: 'group_chat',
    text: 'Ask in the group thread what everyone thinks is going on.',
    surface: 'chat',
  },
]

const D3 = [
  { id: 'quality', text: 'The project has to land well. That’s what’s keeping me up.' },
  { id: 'dynamics', text: 'Keeping us from resenting each other matters as much as the slides.' },
  { id: 'avoid_conflict', text: 'I want to steer around a blow-up if I can help it.' },
]

const D4 = [
  {
    id: 'confront',
    text: 'Call Alex out directly in the chat—enough tiptoeing.',
    surface: 'chat',
  },
  {
    id: 'redistribute',
    text: 'Suggest we reshuffle sections so work doesn’t crush two people.',
    surface: 'chat',
  },
  { id: 'wait', text: 'Hold off… watch what happens in the next day or two.' },
]

const D5 = [
  { id: 'grade', text: 'We could eat the grade—or turn in something half-baked.' },
  { id: 'dynamic', text: 'The group could split into camps that don’t trust each other.' },
  { id: 'alex', text: 'Alex could fall further behind and feel singled out.' },
]

const D6 = [
  { id: 'no_care', text: 'That Alex simply didn’t care about the class.' },
  { id: 'not_urgent', text: 'That we had more runway than we really did.' },
  { id: 'others_handle', text: 'That Jordan or Taylor would eventually “handle it.”' },
]

const D7 = [
  { id: 'honest_talk', text: 'Pull Alex aside (IRL or call) and have a straight, kind conversation.' },
  { id: 'professor', text: 'Email the professor, explain the stall, ask how to proceed fairly.' },
  { id: 'without_them', text: 'Split Alex’s parts among us and push the doc to the finish line.' },
]

function feedbackForD1(id) {
  if (id === 'reactive') return FEEDBACK_BY_CHOICE.assumption_reactive
  if (id === 'neutral') return FEEDBACK_BY_CHOICE.assumption_neutral
  return FEEDBACK_BY_CHOICE.assumption_dismissive
}

function feedbackForD2(id) {
  if (id === 'doc_history') return FEEDBACK_BY_CHOICE.info_doc
  if (id === 'private_message') return FEEDBACK_BY_CHOICE.info_private
  return FEEDBACK_BY_CHOICE.info_group
}

function feedbackForD3(id) {
  if (id === 'quality') return FEEDBACK_BY_CHOICE.priority_quality
  if (id === 'dynamics') return FEEDBACK_BY_CHOICE.priority_dynamics
  return FEEDBACK_BY_CHOICE.priority_avoid
}

function feedbackForD4(id) {
  if (id === 'confront') return FEEDBACK_BY_CHOICE.action_confront
  if (id === 'redistribute') return FEEDBACK_BY_CHOICE.action_redistribute
  return FEEDBACK_BY_CHOICE.action_wait
}

function feedbackForD5(id) {
  if (id === 'grade') return FEEDBACK_BY_CHOICE.consequences_grade
  if (id === 'dynamic') return FEEDBACK_BY_CHOICE.consequences_dynamic
  return FEEDBACK_BY_CHOICE.consequences_alex
}

function feedbackForD6(id) {
  if (id === 'no_care') return FEEDBACK_BY_CHOICE.bias_no_care
  if (id === 'not_urgent') return FEEDBACK_BY_CHOICE.bias_not_urgent
  return FEEDBACK_BY_CHOICE.bias_others
}

function feedbackForD7(id) {
  if (id === 'honest_talk') return FEEDBACK_BY_CHOICE.final_honest
  if (id === 'professor') return FEEDBACK_BY_CHOICE.final_professor
  return FEEDBACK_BY_CHOICE.final_without
}

function lineForChoice(choices, id) {
  const c = choices.find((x) => x.id === id)
  return c?.text ?? ''
}

/** `chat` = shows as a sent group message; default = private thought (not posted). */
function surfaceForChoice(choices, id) {
  const c = choices.find((x) => x.id === id)
  return c?.surface === 'chat' ? 'chat' : 'thought'
}

function pushPlayerLine(push, choices, id) {
  const text = lineForChoice(choices, id)
  if (!text) return
  const surface = surfaceForChoice(choices, id)
  push({
    id: mid(),
    role: surface === 'chat' ? 'you' : 'thought',
    text,
  })
}

export default function ScenarioContainer({ scenario }) {
  const { decisions, setDecision, addFeedbackTag, navigateTo, goBack, canGoBack } = useNarrative()
  const [messages, setMessages] = useState([])
  const [typingAs, setTypingAs] = useState(null)
  const [step, setStep] = useState(0)
  const [decisionBusy, setDecisionBusy] = useState(false)
  const [recentTag, setRecentTag] = useState(null)
  const [spotlight, setSpotlight] = useState(null)
  const alive = useRef(true)
  const decisionsRef = useRef(decisions)
  const seqId = useRef(0)

  useLayoutEffect(() => {
    decisionsRef.current = decisions
  }, [decisions])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const push = useCallback((msg) => {
    if (!alive.current) return
    setMessages((prev) => [...prev, msg])
    if (msg.role === 'system') setSpotlight(null)
    else if (msg.role === 'thought') setSpotlight('you')
    else setSpotlight(msg.role)
  }, [])

  const showTag = useCallback(
    (tag) => {
      addFeedbackTag(tag)
      setRecentTag(tag)
      setTimeout(() => setRecentTag(null), 5000)
    },
    [addFeedbackTag],
  )

  /* ---------- Scenario 1 ---------- */
  useEffect(() => {
    if (scenario !== 1 || step !== 0) return undefined

    const id = ++seqId.current
    let cancel = false
    ;(async () => {
      await delay(400)
      if (cancel || !alive.current || id !== seqId.current) return
      push({ id: mid(), role: 'jordan', text: 'Hey team, I added my part to the doc.' })
      await delay(750)
      if (cancel || !alive.current || id !== seqId.current) return
      push({ id: mid(), role: 'taylor', text: 'Same here, just finished my section.' })
      await delay(750)
      if (cancel || !alive.current || id !== seqId.current) return
      push({ id: mid(), role: 'jordan', text: 'Alex, did you get a chance to start?' })
      await delay(900)
      if (cancel || !alive.current || id !== seqId.current) return
      setTypingAs('alex')
      await delay(1400)
      if (cancel || !alive.current || id !== seqId.current) return
      setTypingAs(null)
      push({
        id: mid(),
        role: 'system',
        text: 'No reply from Alex in the thread—at least not yet.',
      })
      await delay(500)
      if (cancel || !alive.current || id !== seqId.current) return
      setStep(1)
    })()

    return () => {
      cancel = true
    }
  }, [scenario, step, push])

  useEffect(() => {
    if (scenario !== 1 || step !== 3) return undefined
    const strat = decisions.info_strategy
    if (!strat) return undefined

    const id = ++seqId.current
    let cancel = false
    ;(async () => {
      await delay(500)
      if (cancel || !alive.current || id !== seqId.current) return

      if (strat === 'doc_history') {
        push({
          id: mid(),
          role: 'system',
          text: 'You skim the version history. Alex opened the doc once, about five days ago. No edits since.',
        })
        await delay(900)
        if (cancel || !alive.current || id !== seqId.current) return
        push({
          id: mid(),
          role: 'jordan',
          text: 'Okay… so it’s not just in my head. We’re actually waiting on real work.',
        })
      } else if (strat === 'private_message') {
        setTypingAs('alex')
        await delay(1600)
        if (cancel || !alive.current || id !== seqId.current) return
        setTypingAs(null)
        push({
          id: mid(),
          role: 'alex',
          text: 'Thanks for checking in. I’m on it—sorry I’ve been quiet.',
        })
        await delay(700)
        if (cancel || !alive.current || id !== seqId.current) return
        push({
          id: mid(),
          role: 'system',
          text: 'The message lands late, but it lands.',
        })
      } else {
        push({
          id: mid(),
          role: 'system',
          text: 'You ask the group, openly, what everyone thinks is going on.',
        })
        await delay(600)
        if (cancel || !alive.current || id !== seqId.current) return
        push({
          id: mid(),
          role: 'jordan',
          text: 'I don’t want to assume the worst, but we’re a week out. This can’t be a solo surprise at the end.',
        })
        await delay(750)
        if (cancel || !alive.current || id !== seqId.current) return
        push({
          id: mid(),
          role: 'taylor',
          text: 'Yeah… we need something from Alex. Even a rough draft would help.',
        })
      }

      await delay(450)
      if (cancel || !alive.current || id !== seqId.current) return
      setStep(4)
    })()

    return () => {
      cancel = true
    }
  }, [scenario, step, decisions.info_strategy, push])

  const onPickD1 = (id) => {
    setDecisionBusy(true)
    setDecision('assumption_style', id)
    pushPlayerLine(push, D1, id)
    showTag(feedbackForD1(id))
    setTimeout(() => {
      setStep(2)
      setDecisionBusy(false)
    }, 380)
  }

  const onPickD2 = (id) => {
    setDecisionBusy(true)
    setDecision('info_strategy', id)
    pushPlayerLine(push, D2, id)
    showTag(feedbackForD2(id))
    setTimeout(() => {
      setStep(3)
      setDecisionBusy(false)
    }, 380)
  }

  const onPickD3 = (id) => {
    setDecisionBusy(true)
    setDecision('priority', id)
    pushPlayerLine(push, D3, id)
    showTag(feedbackForD3(id))
    setTimeout(() => {
      setStep(5)
      setDecisionBusy(false)
    }, 380)
  }

  const onPickD4 = (id) => {
    setDecisionBusy(true)
    setDecision('action_style', id)
    pushPlayerLine(push, D4, id)
    showTag(feedbackForD4(id))
    setTimeout(() => {
      setStep(6)
      setDecisionBusy(false)
    }, 380)
  }

  /* ---------- Scenario 2 ---------- */
  useEffect(() => {
    if (scenario !== 2 || step !== 0) return undefined

    const tone = getAlexTone(decisionsRef.current)
    const alexLine =
      tone === 'defensive'
        ? 'I’ve been busy, okay?'
        : 'Sorry, I’ve been dealing with something personal.'

    const id = ++seqId.current
    let cancel = false
    ;(async () => {
      await delay(400)
      if (cancel || !alive.current || id !== seqId.current) return
      push({
        id: mid(),
        role: 'system',
        text: 'Deadline in two days. The group chat lights up again.',
      })
      await delay(700)
      if (cancel || !alive.current || id !== seqId.current) return
      push({ id: mid(), role: 'jordan', text: 'We can’t keep waiting.' })
      await delay(700)
      if (cancel || !alive.current || id !== seqId.current) return
      push({ id: mid(), role: 'taylor', text: 'We need a plan.' })
      await delay(800)
      if (cancel || !alive.current || id !== seqId.current) return
      setTypingAs('alex')
      await delay(1500)
      if (cancel || !alive.current || id !== seqId.current) return
      setTypingAs(null)
      push({ id: mid(), role: 'alex', text: alexLine })
      await delay(500)
      if (cancel || !alive.current || id !== seqId.current) return
      setStep(1)
    })()

    return () => {
      cancel = true
    }
  }, [scenario, step, push])

  const onPickD5 = (id) => {
    setDecisionBusy(true)
    pushPlayerLine(push, D5, id)
    showTag(feedbackForD5(id))
    setTimeout(() => {
      setStep(2)
      setDecisionBusy(false)
    }, 380)
  }

  const onPickD6 = (id) => {
    setDecisionBusy(true)
    setDecision('bias_awareness', id)
    pushPlayerLine(push, D6, id)
    showTag(feedbackForD6(id))
    setTimeout(() => {
      setStep(3)
      setDecisionBusy(false)
    }, 380)
  }

  const onPickD7 = (id) => {
    setDecisionBusy(true)
    setDecision('final_decision', id)
    pushPlayerLine(push, D7, id)
    showTag(feedbackForD7(id))
    setTimeout(() => {
      navigateTo('outcome')
      setDecisionBusy(false)
    }, 450)
  }

  const closingText =
    scenario === 1 ? getScenario1ClosingNarrative(decisions) : ''

  const sceneTitle =
    scenario === 1 ? 'Something Feels Off' : 'Now It’s Escalating'
  const sceneTag =
    scenario === 1
      ? 'You’re in the group chat: phones out, doc open, tension humming under polite emojis.'
      : 'Two days left. Everyone’s polite words are wearing thin.'

  return (
    <SceneStage
      scenario={scenario}
      sceneTitle={sceneTitle}
      tagline={sceneTag}
      spotlight={spotlight}
      onBack={goBack}
      canGoBack={canGoBack}
    >
      <ChatInterface messages={messages} typingAs={typingAs} />

      {recentTag ? <FeedbackStrip tags={[recentTag]} /> : null}

      {scenario === 1 && step === 1 && (
        <DecisionCard
          prompt="Alex still hasn’t surfaced in the thread. What’s running through your head?"
          choices={D1}
          onChoose={onPickD1}
          disabled={decisionBusy}
        />
      )}
      {scenario === 1 && step === 2 && (
        <DecisionCard
          prompt="The deadline is a week away. What’s your next play?"
          choices={D2}
          onChoose={onPickD2}
          disabled={decisionBusy}
        />
      )}
      {scenario === 1 && step === 4 && (
        <DecisionCard
          prompt="If you had to name what you care about most in this mess, what is it?"
          choices={D3}
          onChoose={onPickD3}
          disabled={decisionBusy}
        />
      )}
      {scenario === 1 && step === 5 && (
        <DecisionCard
          prompt="Time to move—or not. What do you do?"
          choices={D4}
          onChoose={onPickD4}
          disabled={decisionBusy}
        />
      )}
      {scenario === 1 && step === 6 && (
        <div className="scenario__closing animate-slide-up">
          <p className="scenario__closing-text">{closingText}</p>
          <button type="button" className="btn-primary" onClick={() => navigateTo('transition')}>
            Next beat →
          </button>
        </div>
      )}

      {scenario === 2 && step === 1 && (
        <DecisionCard
          prompt="If nothing shifts, what’s the fallout you’re picturing?"
          choices={D5}
          onChoose={onPickD5}
          disabled={decisionBusy}
        />
      )}
      {scenario === 2 && step === 2 && (
        <DecisionCard
          prompt="Flash back for a second—what did you assume a little too fast?"
          choices={D6}
          onChoose={onPickD6}
          disabled={decisionBusy}
        />
      )}
      {scenario === 2 && step === 3 && (
        <DecisionCard
          prompt="It’s now or never. What do you choose?"
          choices={D7}
          onChoose={onPickD7}
          disabled={decisionBusy}
        />
      )}
    </SceneStage>
  )
}
