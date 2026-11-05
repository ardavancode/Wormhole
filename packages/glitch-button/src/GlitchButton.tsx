import { useEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, MouseEvent, PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import './GlitchButton.css'

type Phase = 'idle' | 'scatter' | 'void'
type Jump = { x: number; y: number; tilt: number }

const randomJump = (): Jump => ({
  x: 12 + Math.random() * 76,
  y: 12 + Math.random() * 76,
  tilt: Math.random() * 24 - 12,
})

export type GlitchButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Label shown on the button and during the glitch sequence. */
  label?: string
}

export function GlitchButton({
  label = 'ENTER THE VOID',
  className = '',
  type = 'button',
  onClick,
  ...props
}: GlitchButtonProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [jump, setJump] = useState<Jump>({ x: 50, y: 50, tilt: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const voidRef = useRef<HTMLDivElement>(null)
  const lastPointerUp = useRef(0)
  const hasOpened = useRef(false)

  useEffect(() => {
    if (phase !== 'scatter') return

    // Respect reduced-motion preferences while keeping the interaction available.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('void')
      return
    }

    const jumping = window.setInterval(() => setJump(randomJump()), 105)
    const blackout = window.setTimeout(() => setPhase('void'), 1350)

    return () => {
      window.clearInterval(jumping)
      window.clearTimeout(blackout)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'idle') {
      if (hasOpened.current) triggerRef.current?.focus()
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (phase === 'void') {
      lastPointerUp.current = 0
      voidRef.current?.focus()
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPhase('idle')
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [phase])

  const enterVoid = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || phase !== 'idle') return
    hasOpened.current = true
    setJump(randomJump())
    setPhase('scatter')
  }

  const exitVoid = () => {
    lastPointerUp.current = 0
    setPhase('idle')
  }

  const handleVoidPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const now = Date.now()
    if (now - lastPointerUp.current < 420) {
      exitVoid()
    } else {
      lastPointerUp.current = now
    }
  }

  const overlay = phase !== 'idle' && typeof document !== 'undefined'
    ? createPortal(
      phase === 'scatter' ? (
        <div className="wh-glitch-scatter" aria-hidden="true">
          <span
            className="wh-glitch-scatter__echo"
            data-text={label}
            style={{
              '--wh-x': `${jump.x}%`,
              '--wh-y': `${jump.y}%`,
              '--wh-tilt': `${jump.tilt}deg`,
            } as CSSProperties}
          >
            {label}
          </span>
        </div>
      ) : (
        <div
          ref={voidRef}
          className="wh-glitch-void"
          role="dialog"
          aria-modal="true"
          aria-label="Glitch dimension. Double click or double tap to return."
          tabIndex={-1}
          onPointerUp={handleVoidPointerUp}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              exitVoid()
            }
          }}
        >
          <div className="wh-glitch-void__noise" aria-hidden="true" />
          <div className="wh-glitch-void__content">
            <p className="wh-glitch-void__eyebrow">WORMHOLE / SIGNAL CORRUPTED</p>
            <h2 className="wh-glitch-void__title" data-text="SYSTEM // LOST">
              SYSTEM // LOST
            </h2>
            <p className="wh-glitch-void__message">REALITY.EXE HAS STOPPED RESPONDING</p>
            <p className="wh-glitch-void__return">DOUBLE CLICK / DOUBLE TAP TO RETURN</p>
            <p className="wh-glitch-void__escape">ESC TO ESCAPE</p>
          </div>
        </div>
      ),
      document.body,
    )
    : null

  return (
    <>
      <button
        {...props}
        ref={triggerRef}
        type={type}
        onClick={enterVoid}
        className={[
          'wh-glitch-button',
          phase !== 'idle' && 'wh-glitch-button--vanished',
          className,
        ].filter(Boolean).join(' ')}
        data-text={label}
      >
        <span className="wh-glitch-button__text">{label}</span>
        <span className="wh-glitch-button__arrow" aria-hidden="true">↗</span>
      </button>
      {overlay}
    </>
  )
}
