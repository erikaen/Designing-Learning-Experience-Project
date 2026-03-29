import { createContext, useContext, useMemo, useState, useCallback, useRef } from 'react'

const initialDecisions = {
  assumption_style: null,
  info_strategy: null,
  priority: null,
  action_style: null,
  bias_awareness: null,
  final_decision: null,
}

const NarrativeContext = createContext(null)

function applyBackCleanup(leavingPhase, setDecisions, setFeedbackTags) {
  if (leavingPhase === 'scenario1') {
    setDecisions(initialDecisions)
    setFeedbackTags([])
    return
  }
  if (leavingPhase === 'transition') {
    setDecisions(initialDecisions)
    setFeedbackTags([])
    return
  }
  if (leavingPhase === 'scenario2' || leavingPhase === 'outcome') {
    setDecisions((d) => ({ ...d, bias_awareness: null, final_decision: null }))
  }
}

export function NarrativeProvider({ children }) {
  const [phase, setPhaseState] = useState('landing')
  const phaseStackRef = useRef(['landing'])
  const [stackDepth, setStackDepth] = useState(1)

  const [decisions, setDecisions] = useState(initialDecisions)
  const [feedbackTags, setFeedbackTags] = useState([])

  const addFeedbackTag = useCallback((tag) => {
    if (!tag) return
    setFeedbackTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]))
  }, [])

  const navigateTo = useCallback((next) => {
    phaseStackRef.current = [...phaseStackRef.current, next]
    setStackDepth(phaseStackRef.current.length)
    setPhaseState(next)
  }, [])

  const goBack = useCallback(() => {
    const stack = phaseStackRef.current
    if (stack.length <= 1) return
    const leaving = stack[stack.length - 1]
    stack.pop()
    const dest = stack[stack.length - 1]
    applyBackCleanup(leaving, setDecisions, setFeedbackTags)
    setStackDepth(stack.length)
    setPhaseState(dest)
  }, [])

  const reset = useCallback(() => {
    phaseStackRef.current = ['landing']
    setStackDepth(1)
    setPhaseState('landing')
    setDecisions(initialDecisions)
    setFeedbackTags([])
  }, [])

  const setDecision = useCallback((key, value) => {
    setDecisions((d) => ({ ...d, [key]: value }))
  }, [])

  const canGoBack = stackDepth > 1

  const value = useMemo(
    () => ({
      phase,
      navigateTo,
      goBack,
      canGoBack,
      decisions,
      setDecision,
      feedbackTags,
      addFeedbackTag,
      reset,
    }),
    [phase, navigateTo, goBack, canGoBack, decisions, feedbackTags, setDecision, addFeedbackTag, reset],
  )

  return (
    <NarrativeContext.Provider value={value}>{children}</NarrativeContext.Provider>
  )
}

export function useNarrative() {
  const ctx = useContext(NarrativeContext)
  if (!ctx) throw new Error('useNarrative must be used within NarrativeProvider')
  return ctx
}
