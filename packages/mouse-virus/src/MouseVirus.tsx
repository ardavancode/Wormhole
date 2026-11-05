import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import './MouseVirus.css'

type Language = 'fa' | 'en'
type Jump = { x: number; y: number; turn: number }

const decoys = [
  { fa: 'حذف ویروس', en: 'DELETE VIRUS', icon: '✕' },
  { fa: 'نجات موس', en: 'SAVE CURSOR', icon: '⌖' },
  { fa: 'تعمیر سیستم', en: 'FIX SYSTEM', icon: '⚙' },
  { fa: 'لغو هرج‌ومرج', en: 'CANCEL CHAOS', icon: '⏻' },
] as const

const warnings = [
  { fa: 'موسِ جعلی شمارهٔ ۲ پیدا شد.', en: 'Decoy cursor #2 detected.' },
  { fa: 'دکمه‌ها دیگر همکاری نمی‌کنند!', en: 'Buttons refuse to cooperate!' },
  { fa: 'واقعیت در حال بافر شدن است…', en: 'Reality is buffering…' },
  { fa: 'نشانگر شما دو برابر شد. مبارک است!', en: 'Your pointer has multiplied. Congrats!' },
  { fa: 'آنتی‌ویروس خیالی تسلیم شد.', en: 'Imaginary antivirus has surrendered.' },
] as const

const echoes = [
  { x: -26, y: -35, delay: '0ms' },
  { x: 44, y: 19, delay: '95ms' },
  { x: -58, y: 44, delay: '175ms' },
  { x: 77, y: -37, delay: '260ms' },
  { x: 17, y: 71, delay: '345ms' },
]

export function MouseVirusTeaser({ language, href }: { language: Language; href: string }) {
  const fa = language === 'fa'
  return (
    <a className="mv-teaser" href={href}>
      <span className="mv-teaser__index">EXPERIMENT 003 // CURSOR MUTATION</span>
      <strong>{fa ? '🖱️ موسِ ویروسی!' : '🖱️ CURSOR VIRUS!'}</strong>
      <span>{fa ? 'دکمه‌هایی که فرار می‌کنن و نشانگرهایی که تکثیر می‌شن.' : 'Runaway buttons and a suspiciously multiplying cursor.'}</span>
      <span className="mv-teaser__arrow" aria-hidden="true">↗</span>
    </a>
  )
}

export function MouseVirusLab({ language }: { language: Language }) {
  const fa = language === 'fa'
  const [running, setRunning] = useState(false)
  const [level, setLevel] = useState(0)
  const [escapes, setEscapes] = useState(0)
  const [jumps, setJumps] = useState<Record<number, Jump>>({})
  const [notices, setNotices] = useState<{ id: number; message: string }[]>([])
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [inside, setInside] = useState(false)
  const sandboxRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const lastMoveRef = useRef(0)
  const noticeIdRef = useRef(0)

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
  }, [])

  const reset = () => {
    setRunning(false)
    setLevel(0)
    setEscapes(0)
    setJumps({})
    setNotices([])
    setInside(false)
    noticeIdRef.current = 0
    lastMoveRef.current = 0
  }

  const addNotice = () => {
    const id = ++noticeIdRef.current
    const message = warnings[(id - 1) % warnings.length]
    setNotices((previous) => [...previous.slice(-2), { id, message: fa ? message.fa : message.en }])
  }

  const launch = () => {
    if (level >= 100) reset()
    setRunning(true)
    setNotices([{ id: ++noticeIdRef.current, message: fa ? 'شبیه‌سازی آغاز شد؛ هیچ ویروس واقعی وجود ندارد.' : 'Simulation started. No actual virus is present.' }])
  }

  const jumpAway = (index: number, pointerType: string) => {
    if (!running || level >= 100 || pointerType === 'touch') return
    // Escape only within its own tile: no element can leave the simulation or block navigation.
    setJumps((previous) => ({
      ...previous,
      [index]: {
        x: Math.round((Math.random() - 0.5) * 62),
        y: Math.round((Math.random() - 0.5) * 52),
        turn: Math.round((Math.random() - 0.5) * 21),
      },
    }))
    setEscapes((previous) => previous + 1)
    setLevel((previous) => Math.min(100, previous + 8))
    addNotice()
  }

  const catchButton = (index: number) => {
    if (!running || level >= 100) return
    setLevel((previous) => Math.min(100, previous + 15))
    setEscapes((previous) => previous + 1)
    setJumps((previous) => ({
      ...previous,
      [index]: {
        x: Math.round((Math.random() - 0.5) * 44),
        y: Math.round((Math.random() - 0.5) * 42),
        turn: 10,
      },
    }))
    addNotice()
  }

  const movePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!running || level >= 100 || event.pointerType === 'touch') return
    const rect = sandboxRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top))
    setInside(true)
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(() => {
        setPointer({ x, y })
        frameRef.current = null
      })
    }
    // Keep work bounded on fast mice and never intercept input outside this box.
    if (event.timeStamp - lastMoveRef.current > 430) {
      lastMoveRef.current = event.timeStamp
      setLevel((previous) => Math.min(100, previous + 1))
    }
  }

  const overload = level >= 100

  return (
    <section className="mv-lab" dir={fa ? 'rtl' : 'ltr'} aria-labelledby="mv-title">
      <header className="mv-hero">
        <span className="mv-eyebrow">WORMHOLE // EXPERIMENT 003 // HARMLESS CHAOS</span>
        <h1 id="mv-title">{fa ? 'موست ویروسی شده! 🖱️' : 'YOUR MOUSE IS INFECTED! 🖱️'}</h1>
        <p>{fa
          ? 'دکمه‌ها از نشانگرت فرار می‌کنن، نشانگرهای تقلبی دورش ظاهر می‌شن و سطح آلودگیِ خیالی بالا می‌ره. روی موبایل هم با لمس دکمه‌ها می‌تونی بازی کنی.'
          : 'Buttons dodge your mouse, fake cursors follow it, and the imaginary infection meter fills up. On mobile, tap the buttons to play.'}</p>
        <p className="mv-safety">{fa
          ? 'فقط یک شوخی تعاملی است؛ نه ویروسی نصب می‌شود، نه نشانگر واقعی کنترل می‌شود، نه اطلاعاتی جمع می‌شود.'
          : 'Simulation only: no real malware, cursor hijacking, downloads, or data collection.'}</p>
      </header>

      <div className="mv-toolbar">
        <div className="mv-meter" role="status" aria-live="off">
          <span>{fa ? 'آلودگیِ ساختگی' : 'SIMULATED INFECTION'}</span>
          <strong>{level}%</strong>
          <div className="mv-meter__track" aria-hidden="true">
            <div style={{ width: level + '%' }} />
          </div>
          <small>{fa ? `فرار دکمه‌ها: ${escapes}` : `Button escapes: ${escapes}`}</small>
        </div>
        <div className="mv-toolbar__actions">
          <button type="button" className="mv-start" onClick={running ? () => setRunning(false) : launch}>
            {running ? (fa ? 'Ⅱ مکث' : 'Ⅱ PAUSE') : (fa ? '▶ شروع آلودگی!' : '▶ START INFECTION!')}
          </button>
          <button type="button" className="mv-reset" onClick={reset}>
            {fa ? '↺ پاکسازی / ریست' : '↺ CLEAN & RESET'}
          </button>
        </div>
      </div>

      <div
        ref={sandboxRef}
        className={'mv-sandbox' + (running ? ' mv-sandbox--active' : '') + (overload ? ' mv-sandbox--overload' : '')}
        onPointerMove={movePointer}
        onPointerLeave={() => setInside(false)}
      >
        <div className="mv-sandbox__titlebar" dir="ltr">
          <span aria-hidden="true">● ● ●</span>
          <span>mouse_virus.exe // DEMO ONLY</span>
          <span className="mv-sandbox__status">{running ? 'SIMULATING' : 'IDLE'}</span>
        </div>
        <div className="mv-sandbox__noise" aria-hidden="true" />
        <div className="mv-window mv-window--one">
          <span className="mv-window__heading" dir="ltr">MOUSE CONTROL CENTER</span>
          <span className="mv-window__pointer" aria-hidden="true">↖</span>
          <span className="mv-window__caption">{fa ? 'سیستم به‌طرز مشکوکی آرومه…' : 'Everything looks suspiciously normal…'}</span>
        </div>
        <div className="mv-window mv-window--two" aria-hidden="true">
          <span>! CLICK HERE !</span>
          <span>?</span>
          <span>404</span>
        </div>
        <div className="mv-decoys" role="group" aria-label={fa ? 'دکمه‌های فراری' : 'Runaway buttons'}>
          {decoys.map((decoy, index) => {
            const offset = jumps[index]
            return (
              <div className="mv-decoy-slot" key={index}>
                <button
                  type="button"
                  className="mv-decoy"
                  disabled={!running || overload}
                  style={{ transform: offset ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.turn}deg)` : undefined }}
                  onPointerEnter={(event) => jumpAway(index, event.pointerType)}
                  onClick={() => catchButton(index)}
                >
                  <span aria-hidden="true">{decoy.icon}</span>
                  {fa ? decoy.fa : decoy.en}
                </button>
              </div>
            )
          })}
        </div>
        <div className="mv-notices" aria-live="off" aria-hidden="true">
          {notices.map((notice) => (
            <div className="mv-notice" key={notice.id}>
              <strong>⚠ FAKE VIRUS</strong>
              <span>{notice.message}</span>
            </div>
          ))}
        </div>
        {running && inside && !overload && (
          <div className="mv-ghosts" aria-hidden="true">
            {echoes.map((echo, index) => (
              <span
                key={index}
                className="mv-ghost"
                style={{
                  left: pointer.x + echo.x,
                  top: pointer.y + echo.y,
                  animationDelay: echo.delay,
                }}
              >↖</span>
            ))}
          </div>
        )}
        {!running && level === 0 && (
          <div className="mv-idle-note">
            {fa ? '↑ اول دکمهٔ شروع رو بزن؛ بعد موس رو روی دکمه‌ها ببر.' : '↑ Hit START, then chase the buttons with your mouse.'}
          </div>
        )}
        {overload && (
          <div className="mv-overload" role="status">
            <span>404 // ERROR</span>
            <strong>{fa ? 'موس‌ها کودتا کردن!' : 'THE CURSORS HAVE TAKEN OVER!'}</strong>
            <p>{fa ? 'هیچ اتفاق واقعی‌ای نیفتاده. فقط دنیای جعلی منفجر شده!' : 'Nothing really happened. Only the fake universe exploded.'}</p>
            <button type="button" onClick={reset}>{fa ? '↺ بازگردانی واقعیت' : '↺ RESTORE REALITY'}</button>
          </div>
        )}
      </div>
      <p className="mv-footnote">{fa
        ? 'برای پایان، دکمهٔ «پاکسازی / ریست» را بزن یا از صفحه خارج شو. حرکت‌ها فقط داخل کادر آزمایش اثر دارند.'
        : 'Use CLEAN & RESET or simply leave the page. The entire effect is contained inside this experiment.'}</p>
    </section>
  )
}
