import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createPortal } from 'react-dom'
import './HiringForm.css'

// Put the user-supplied 1000104059.mp4 at public/hiring-video.mp4.
// Both positions intentionally display the exact same clip.
const HIRING_VIDEO = '/hiring-video.mp4'

const positions = [
  { id: '10-cents', label: '10 cents for 1 hour', number: '01' },
  { id: 'wage-slave', label: 'Iranian wage slave', number: '02' },
] as const

type Position = (typeof positions)[number]['id']

export function HiringForm() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | ''>('')
  const [resume, setResume] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [preview, setPreview] = useState(false)
  const [videoMissing, setVideoMissing] = useState(false)
  const [localVideo, setLocalVideo] = useState<string | null>(null)
  const launchRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const videoSource = localVideo ?? HIRING_VIDEO

  useEffect(() => {
    return () => {
      if (localVideo) URL.revokeObjectURL(localVideo)
    }
  }, [localVideo])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      launchRef.current?.focus()
    }
  }, [open])

  const chooseLocalVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    setVideoMissing(false)
    setLocalVideo(URL.createObjectURL(file))
  }

  const chooseResume = (event: ChangeEvent<HTMLInputElement>) => {
    setResume(event.currentTarget.files?.[0] ?? null)
    setPreview(false)
  }

  const submitPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!position || !resume) return
    // There is intentionally no backend. Never imply the resume was sent.
    setPreview(true)
  }

  return (
    <>
      <footer className="wh-hiring-footer">
        <span className="wh-hiring-footer__eyebrow">WORMHOLE // CAREERS // DEFINITELY LEGIT</span>
        <button
          ref={launchRef}
          className="wh-hiring-footer__button"
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span>WE ARE HIRING</span>
          <span aria-hidden="true">↗</span>
        </button>
        <span className="wh-hiring-footer__fineprint">GREAT OPPORTUNITIES. QUESTIONABLE COMPENSATION.</span>
      </footer>

      {open && createPortal(
        <div
          className="wh-hiring-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <div
            ref={dialogRef}
            className="wh-hiring-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wh-hiring-title"
          >
            <button ref={closeRef} className="wh-hiring-dialog__close" type="button" onClick={() => setOpen(false)} aria-label="Close application form">×</button>

            <header className="wh-hiring-dialog__head">
              <span className="wh-hiring-dialog__overline">OFFICIAL WORMHOLE RECRUITMENT PORTAL</span>
              <h2 id="wh-hiring-title">JOIN THE <em>TEAM.</em></h2>
              <p>Two career paths. One extremely suspicious benefits package.</p>
            </header>

            <form onSubmit={submitPreview}>
              <fieldset className="wh-hiring-positions">
                <legend>CHOOSE YOUR DESTINY <span aria-hidden="true">↓</span></legend>
                <div className="wh-hiring-positions__grid">
                  {positions.map((item) => (
                    <label key={item.id} className={position === item.id ? 'wh-hiring-position wh-hiring-position--selected' : 'wh-hiring-position'}>
                      <div className="wh-hiring-position__clip">
                        {videoMissing && !localVideo ? (
                          <div className="wh-hiring-position__missing" aria-label="Video preview unavailable">
                            <span aria-hidden="true">▶</span>
                            <small>PREVIEW OFFLINE</small>
                          </div>
                        ) : (
                          <video
                            src={videoSource}
                            playsInline
                            muted
                            autoPlay
                            loop
                            preload="metadata"
                            onError={() => setVideoMissing(true)}
                          />
                        )}
                        <span className="wh-hiring-position__number">{item.number} / 02</span>
                      </div>
                      <div className="wh-hiring-position__option">
                        <input
                          type="radio"
                          name="position"
                          value={item.id}
                          checked={position === item.id}
                          onChange={() => { setPosition(item.id); setPreview(false) }}
                          required
                        />
                        <strong>{item.label}</strong>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {videoMissing && !localVideo && (
                <label className="wh-hiring-dialog__video-fallback">
                  The hosted video isn't available yet. Preview the supplied clip locally:
                  <input type="file" accept="video/mp4,video/*" onChange={chooseLocalVideo} />
                </label>
              )}

              <div className="wh-hiring-fields">
                <label>
                  YOUR NAME
                  <input type="text" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setPreview(false) }} placeholder="Your full name" required />
                </label>
                <label>
                  EMAIL ADDRESS
                  <input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setPreview(false) }} placeholder="you@the-void.com" required />
                </label>
              </div>

              <div className="wh-hiring-resume">
                <div>
                  <span className="wh-hiring-resume__eyebrow">THE PAPERWORK</span>
                  <h3>YOUR RÉSUMÉ <span>↗</span></h3>
                  <p>Upload a CV. We promise to look at the filename.</p>
                </div>
                <label className="wh-hiring-resume__upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={chooseResume}
                    required
                  />
                  <span>+ CHOOSE FILE</span>
                  <small>{resume ? resume.name : 'PDF, DOC, DOCX OR TXT'}</small>
                </label>
              </div>

              <button className="wh-hiring-submit" type="submit">
                PREVIEW APPLICATION <span aria-hidden="true">↗</span>
              </button>
              {preview && (
                <p className="wh-hiring-feedback" role="status">
                  You selected {positions.find((item) => item.id === position)?.label}.
                  Your résumé ({resume?.name}) is selected locally — nothing was uploaded or sent.
                </p>
              )}
              <p className="wh-hiring-disclaimer">PARODY / DEMO FORM ONLY — NO APPLICATION DATA IS TRANSMITTED.</p>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
