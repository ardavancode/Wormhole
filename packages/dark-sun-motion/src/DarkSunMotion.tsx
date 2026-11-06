import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import './DarkSunMotion.css'

type Language = 'fa' | 'en'

export function DarkSunMotion({ language, imageSrc, fullHref, returnHref }: {
  language: Language
  imageSrc: string
  fullHref?: string
  returnHref?: string
}) {
  const fa = language === 'fa'
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const [overdrive, setOverdrive] = useState(false)
  const [paused, setPaused] = useState(false)
  const [imageMissing, setImageMissing] = useState(false)

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
  }, [])

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (paused || event.pointerType === 'touch' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const element = rootRef.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2))
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2))
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = window.requestAnimationFrame(() => {
      element.style.setProperty('--ds-x', x.toFixed(3))
      element.style.setProperty('--ds-y', y.toFixed(3))
      frameRef.current = null
    })
  }

  const resetTilt = () => {
    const element = rootRef.current
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    element?.style.setProperty('--ds-x', '0')
    element?.style.setProperty('--ds-y', '0')
  }

  return (
    <section
      ref={rootRef}
      className={'ds-world' + (overdrive ? ' ds-world--awake' : '') + (paused ? ' ds-world--paused' : '')}
      dir={fa ? 'rtl' : 'ltr'}
      onPointerMove={move}
      onPointerLeave={resetTilt}
      aria-labelledby="dark-sun-title"
    >
      <div className="ds-ambient ds-ambient--one" aria-hidden="true" />
      <div className="ds-ambient ds-ambient--two" aria-hidden="true" />
      <div className="ds-crosshair ds-crosshair--one" aria-hidden="true">✳</div>
      <div className="ds-crosshair ds-crosshair--two" aria-hidden="true">⊹</div>

      <header className="ds-heading">
        <span className="ds-index">WORMHOLE / EXPERIMENT 005 / THE DARK SUN</span>
        <h1 id="dark-sun-title">
          {fa ? 'خورشیدِ' : 'THE DARK'}<br />
          <em>{fa ? 'سیاه' : 'SUN'}</em>
        </h1>
        <p>{fa
          ? 'پادشاه خورشید سیاه. تاج ثابت می‌مونه، اما جهان پشتش نه. با حرکت نشانگر، جهت هاله رو عوض کن؛ با یک لمس خورشید رو بیدار کن.'
          : 'The monarch stays still. The universe behind the crown does not. Move your pointer to bend the halo, or wake the sun with a tap.'}</p>
        <div className="ds-actions">
          <button type="button" className="ds-awaken" onClick={() => setOverdrive(value => !value)} aria-pressed={overdrive}>
            <span aria-hidden="true">✳</span> {overdrive
              ? (fa ? 'آرامش قبل طوفان' : 'CALM THE STORM')
              : (fa ? 'بیدار کردن خورشید' : 'WAKE THE SUN')}
          </button>
          <button type="button" className="ds-pause" onClick={() => {
            setPaused(value => !value)
            resetTilt()
          }} aria-pressed={paused}>
            {paused ? (fa ? '▶ ادامهٔ حرکت' : '▶ RESUME MOTION') : (fa ? 'Ⅱ توقف حرکت' : 'Ⅱ PAUSE MOTION')}
          </button>
        </div>
      </header>

      <div className="ds-portrait" aria-label={fa ? 'قاب متحرک پادشاه خورشید سیاه' : 'Animated Dark Sun Monarch portrait'}>
        <div className="ds-orbit ds-orbit--outer" aria-hidden="true" />
        <div className="ds-orbit ds-orbit--inner" aria-hidden="true" />
        <div className="ds-portrait__plate">
          {imageMissing ? (
            <div className="ds-placeholder" role="img" aria-label={fa ? 'قاب عکس منتظر فایل پادشاه خورشید سیاه است' : 'The portrait image file is not installed yet'}>
              <span aria-hidden="true">♛</span>
              <strong>THE DARK SUN</strong>
              <small>{fa ? 'برای نمایش عکس اصلی، فایل dark-sun-monarch.webp را به public اضافه کنید.' : 'Upload dark-sun-monarch.webp to the public directory to display the portrait.'}</small>
            </div>
          ) : (
            <img
              className="ds-portrait__photo"
              src={imageSrc}
              alt={fa ? 'پرترهٔ هنری با تاج شاخ‌دار، لباس سیاه و سفید و هاله‌ای از رشته‌های تاریک' : 'Artistic portrait with a horned crown, embroidered black-and-white robes, and a black branching halo'}
              loading="lazy"
              decoding="async"
              onError={() => setImageMissing(true)}
            />
          )}
          <div className="ds-ink ds-ink--a" aria-hidden="true" />
          <div className="ds-ink ds-ink--b" aria-hidden="true" />
          <div className="ds-scanline" aria-hidden="true" />
          <div className="ds-photo-grain" aria-hidden="true" />
          <div className="ds-sun-ring" aria-hidden="true" />
        </div>
        <div className="ds-crown-label" aria-hidden="true">MONARCH<br />NO. 005</div>
        <div className="ds-sparks" aria-hidden="true">
          {Array.from({ length: 22 }, (_, i) => (
            <i key={i} style={{
              '--particle': i,
              left: `${5 + (i * 37) % 90}%`,
              top: `${6 + (i * 29) % 84}%`,
            } as CSSProperties} />
          ))}
        </div>
        <span className="ds-border-code" aria-hidden="true">BLACK SUN / 005 / STILL ALIVE</span>
      </div>

      <footer className="ds-footline">
        <span>© WORMHOLE // REALITY IS OPTIONAL</span>
        {fullHref && <a href={fullHref}>{fa ? 'نمایش مستقل ↗' : 'FULLSCREEN EXPERIMENT ↗'}</a>}
        {returnHref && <a href={returnHref}>{fa ? 'بازگشت به آدولفو ↓' : 'BACK TO ADOLFO ↓'}</a>}
        <span className="ds-coordinate" dir="ltr">SOLAR ERROR: 0x005</span>
      </footer>
    </section>
  )
}
