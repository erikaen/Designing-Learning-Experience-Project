/** Derive Alex's tone in scenario 2 from earlier choices (deterministic). */
export function getAlexTone(d) {
  if (d.info_strategy === 'private_message' && d.assumption_style === 'neutral') {
    return 'honest'
  }
  if (
    d.assumption_style === 'reactive' ||
    d.info_strategy === 'group_chat' ||
    d.action_style === 'confront'
  ) {
    return 'defensive'
  }
  if (d.assumption_style === 'dismissive' && d.action_style === 'wait') {
    return 'defensive'
  }
  return 'honest'
}

export function getScenario1ClosingNarrative(d) {
  const tense =
    d.info_strategy === 'group_chat' ||
    d.action_style === 'confront' ||
    d.assumption_style === 'reactive'
  if (tense) {
    return 'The thread stays polite on the surface, but you can feel the pressure building. People are watching the doc more often than they admit.'
  }
  return 'Things stay quiet for now. The group is waiting—on Alex, on the deadline, on someone to name what everyone is thinking.'
}

export function getOutcomeNarrative(d) {
  const { final_decision, priority, assumption_style, action_style } = d

  if (final_decision === 'honest_talk') {
    return {
      title: 'What happened next',
      body: [
        'You find a moment to talk with Alex without an audience. They explain what’s been going on—not perfectly, but honestly enough that the story makes sense.',
        priority === 'quality'
          ? 'You and Taylor adjust the plan so the work still holds together. Jordan stays a little wary, but the group ships something you can stand behind.'
          : 'The plan shifts slightly so nobody is carrying everything alone. The work gets done; the mood is uneven but workable.',
        'It doesn’t feel like a movie ending. It feels like a real group that had a rough week and figured out how to keep moving.',
      ].join(' '),
    }
  }

  if (final_decision === 'professor') {
    return {
      title: 'What happened next',
      body: [
        'You reach out to the professor. The conversation is shorter than you expected—mostly logistics, partly advice.',
        'The group gets an extension, but the trust between you four doesn’t magically reset. Jordan is relieved; Alex is embarrassed; Taylor tries to keep things neutral.',
        'The project crosses the finish line. You’re not sure everyone would choose to work together again.',
      ].join(' '),
    }
  }

  if (final_decision === 'without_them') {
    return {
      title: 'What happened next',
      body: [
        'You redistribute Alex’s sections. The doc fills in fast because the deadline is real.',
        assumption_style === 'reactive' || action_style === 'confront'
          ? 'Nobody says anything sharp in the chat, but the silence has an edge to it.'
          : 'People are tired, not triumphant.',
        'You submit on time. The grade is fine. Later, you wonder whether “fine” was the only thing you were aiming for.',
      ].join(' '),
    }
  }

  return {
    title: 'What happened next',
    body: 'The story pauses here—your choices didn’t map to an ending we expected. Try another path from the start.',
  }
}

export const FEEDBACK_BY_CHOICE = {
  assumption_reactive: 'You named what worried you',
  assumption_neutral: 'You left room for more than one explanation',
  assumption_dismissive: 'You noticed how easy it is to downplay tension',
  info_doc: 'You looked for evidence in the work itself',
  info_private: 'You went to the source directly',
  info_group: 'You brought the group into the loop',
  priority_quality: 'You kept the work in focus',
  priority_dynamics: 'You weighed how people feel, not just the output',
  priority_avoid: 'You noticed the pull to keep things smooth',
  action_confront: 'You chose directness',
  action_redistribute: 'You tried to solve it structurally',
  action_wait: 'You paused before pushing',
  bias_no_care: 'You questioned whether “they don’t care” was the whole story',
  bias_not_urgent: 'You reconsidered how urgent this felt early on',
  bias_others: 'You noticed expectations about who would step in',
  consequences_grade: 'You traced what the timeline could cost',
  consequences_dynamic: 'You thought about relationships, not only tasks',
  consequences_alex: 'You kept one person’s situation in view',
  final_honest: 'You chose a private, human conversation',
  final_professor: 'You looked for outside structure when stuck',
  final_without: 'You protected the deadline under pressure',
}
