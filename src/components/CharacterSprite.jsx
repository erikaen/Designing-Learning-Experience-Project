import { useState } from 'react'
import './CharacterSprite.css'

/** Roles that use your uploaded reference PNGs (public/avatars/*.png). */
const PHOTO_ROLES = new Set(['jordan', 'taylor', 'alex', 'you'])

const INK = '#151515'
const SW = 2.75

function NarratorIcon() {
  const vb = '0 0 64 64'
  return (
    <svg viewBox={vb} aria-hidden className="character-sprite__svg" preserveAspectRatio="xMidYMid meet">
      <circle cx="32" cy="32" r="28" fill="#fff9c4" stroke={INK} strokeWidth={SW} />
      <rect x="16" y="22" width="32" height="24" rx="4" fill="#fff" stroke={INK} strokeWidth={SW} />
      <line x1="20" y1="28" x2="44" y2="28" stroke={INK} strokeWidth={2} opacity="0.35" />
      <line x1="20" y1="34" x2="40" y2="34" stroke={INK} strokeWidth={2} opacity="0.35" />
      <path d="M22 46 L28 54 L30 44" fill="#fff9c4" stroke={INK} strokeWidth={SW} />
    </svg>
  )
}

/** Tiny flat fallback if PNG missing (dev / first run). */
function FallbackHead() {
  const vb = '0 0 64 64'
  return (
    <svg viewBox={vb} aria-hidden className="character-sprite__svg" preserveAspectRatio="xMidYMid meet">
      <circle cx="32" cy="32" r="28" fill="#fce4cf" stroke={INK} strokeWidth={SW} />
      <circle cx="24" cy="30" r="3" fill={INK} />
      <circle cx="40" cy="30" r="3" fill={INK} />
      <path d="M 26 40 Q 32 45 38 40" fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
    </svg>
  )
}

export default function CharacterSprite({ role, size = 'md', className = '' }) {
  const s = `character-sprite character-sprite--${role} character-sprite--${size} ${className}`.trim()
  const [imgFailed, setImgFailed] = useState(false)

  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const photoSrc = `${base}/avatars/${role}.png`

  if (role === 'narrator') {
    return (
      <span className={s} role="img" aria-hidden>
        <NarratorIcon />
      </span>
    )
  }

  if (PHOTO_ROLES.has(role) && !imgFailed) {
    return (
      <span className={s} role="img" aria-hidden>
        <img
          src={photoSrc}
          alt=""
          className="character-sprite__img"
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      </span>
    )
  }

  if (PHOTO_ROLES.has(role) && imgFailed) {
    return (
      <span className={s} role="img" aria-hidden>
        <FallbackHead />
      </span>
    )
  }

  return (
    <span className={s} role="img" aria-hidden>
      <FallbackHead />
    </span>
  )
}

export const CAST = [
  { role: 'jordan', name: 'Jordan', blurb: 'Direct, on-edge' },
  { role: 'taylor', name: 'Taylor', blurb: 'Steady, practical' },
  { role: 'alex', name: 'Alex', blurb: 'Quiet lately' },
  { role: 'you', name: 'You', blurb: 'That’s your role' },
]
