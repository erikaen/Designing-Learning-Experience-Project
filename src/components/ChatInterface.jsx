import { useEffect, useRef } from 'react'
import CharacterSprite from './CharacterSprite.jsx'
import './ChatInterface.css'

const NAMES = {
  jordan: 'Jordan',
  taylor: 'Taylor',
  alex: 'Alex',
  you: 'You',
}

function TypingBubble({ role }) {
  const label = NAMES[role] || role
  return (
    <div className="chat-line chat-line--them animate-pop-in">
      <CharacterSprite role={role} size="md" />
      <div className="chat-bubble chat-bubble--them chat-bubble--typing">
        <span className="chat-name">{label}</span>
        <div className="typing-dots" aria-label="Typing">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

export default function ChatInterface({ messages, typingAs }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingAs])

  return (
    <div className="chat-interface">
      <div className="chat-interface__label" aria-hidden>
        <span className="chat-interface__pin" />
        Group chat
      </div>
      <div className="chat-scroll">
        {messages.map((m) => (
          <Message key={m.id} msg={m} />
        ))}
        {typingAs ? <TypingBubble role={typingAs} /> : null}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function Message({ msg }) {
  const { role, text } = msg
  if (role === 'system') {
    return (
      <div className="chat-narration animate-pop-in">
        <CharacterSprite role="narrator" size="sm" className="chat-narration__icon" />
        <div className="chat-narration__box">
          <span className="chat-narration__tag">Scene</span>
          <p>{text}</p>
        </div>
      </div>
    )
  }

  if (role === 'thought') {
    return (
      <div className="chat-thought animate-pop-in">
        <div className="chat-thought__box">
          <span className="chat-thought__tag">Private thought</span>
          <p className="chat-thought__text">{text}</p>
        </div>
      </div>
    )
  }

  const isYou = role === 'you'
  const name = NAMES[role] || 'You'

  return (
    <div className={`chat-line ${isYou ? 'chat-line--you' : 'chat-line--them'} animate-pop-in`}>
      {!isYou && <CharacterSprite role={role} size="md" />}
      <div className={`chat-bubble ${isYou ? 'chat-bubble--you' : 'chat-bubble--them'}`}>
        <span className="chat-name">{name}</span>
        <p className="chat-text">{text}</p>
      </div>
      {isYou && <CharacterSprite role="you" size="md" />}
    </div>
  )
}
