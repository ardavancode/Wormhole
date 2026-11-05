import type { ButtonHTMLAttributes } from 'react'
import './GlitchButton.css'

export type GlitchButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Visible button label, also used by the glitch overlay. */
  label?: string
}

export function GlitchButton({
  label = 'ENTER THE VOID',
  className = '',
  type = 'button',
  ...props
}: GlitchButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={['wh-glitch-button', className].filter(Boolean).join(' ')}
      data-text={label}
    >
      <span className="wh-glitch-button__text">{label}</span>
      <span className="wh-glitch-button__arrow" aria-hidden="true">↗</span>
    </button>
  )
}
