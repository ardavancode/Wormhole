import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createPortal } from 'react-dom'
import './HiringForm.css'

// Put the user-supplied 1000104059.mp4 at public/hiring-video.mp4.
// Both positions intentionally display the exact same clip.
const HIRING_VIDEO = 'hiring-video.mp4'

const positions = [
  { id: '10-cents', label: '10 cents for 1 hour', labelFa: '۱۰ سنت برای یک ساعت', number: '01' },
  { id: 'wage-slave', label: 'Iranian wage slave', labelFa: 'بردهٔ دستمزدبگیر ایرانی', number: '02' },
] as const

type Position = (typeof positions)[number]['id']

export function HiringForm({ language = 'en' }: { language?: 'fa' | 'en' }) {
  const fa = language === 'fa'
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
  const videoRefs = useRef<Record<Position, HTMLVideoElement | null>>({
    '10-cents': null,
    'wage-slave': null,
  })
  const videoSource = localVideo ?? HIRING_VIDEO

  const stopVideos = () => {
    Object.values(videoRefs.current).forEach((video) => {
      if (!video) return
      video.pause()
      video.currentTime = 0
    })
  }

  const closeForm = () => {
    stopVideos()
    setPosition('')
    setOpen(false)
  }

  const choosePosition = (next: Position) => {
    setPosition(next)
    setPreview(false)

    for (const [id, video] of Object.entries(videoRefs.current)) {
      if (!video) continue
      video.pause()
      video.currentTime = 0
      if (id === next) {
        // A radio click is a user gesture, so start immediately with sound.
        video.muted = false
        void video.play().catch(() => {
          // Some browsers may still restrict sound; keep the clip playing muted.
          video.muted = true
          void video.play().catch(() => {})
        })
      }
    }
  }

  useEffect(() => {
    return () => {
      if (localVideo) URL.revokeObjectURL(localVideo)
    }
  }, [localVideo])

  useEffect(() => {
    if (!open || !position || !localVideo) return
    const video = videoRefs.current[position]
    if (!video) return
    // New local media is inserted on render, so start it once the source updates.
    video.muted = true
    void video.play().catch(() => {})
  }, [localVideo, open, position])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeForm()
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
      <footer className="wh-hiring-footer" dir={fa ? "rtl" : "ltr"}>
        <span className="wh-hiring-footer__eyebrow">{fa ? "ورم‌هول // فرصت‌های شغلی // کاملاً معتبر!" : "WORMHOLE // CAREERS // DEFINITELY LEGIT"}</span>
        <button
          ref={launchRef}
          className="wh-hiring-footer__button"
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span>{fa ? "ما استخدام می‌کنیم" : "WE ARE HIRING"}</span>
          <span aria-hidden="true">↗</span>
        </button>
        <span className="wh-hiring-footer__fineprint">{fa ? "فرصت‌های عالی؛ دستمزدهای مشکوک." : "GREAT OPPORTUNITIES. QUESTIONABLE COMPENSATION."}</span>
      </footer>

      {createPortal(
        <div
          className="wh-hiring-backdrop"
          aria-hidden={!open}
          inert={!open}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm()
          }}
        >
          <div
            ref={dialogRef}
            className="wh-hiring-dialog"
            dir={fa ? "rtl" : "ltr"}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wh-hiring-title"
          >
            <button ref={closeRef} className="wh-hiring-dialog__close" type="button" onClick={closeForm} aria-label={fa ? "بستن فرم استخدام" : "Close application form"}>×</button>

            <header className="wh-hiring-dialog__head">
              <span className="wh-hiring-dialog__overline">{fa ? "درگاه رسمی استخدام ورم‌هول" : "OFFICIAL WORMHOLE RECRUITMENT PORTAL"}</span>
              <h2 id="wh-hiring-title">{fa ? "به " : "JOIN THE "}<em>{fa ? "تیم بپیوند!" : "TEAM."}</em></h2>
              <p>{fa ? "دو مسیر شغلی. مزایایی به‌شدت مشکوک." : "Two career paths. One extremely suspicious benefits package."}</p>
            </header>

            <form onSubmit={submitPreview}>
              <fieldset className="wh-hiring-positions">
                <legend>{fa ? "سرنوشتت رو انتخاب کن" : "CHOOSE YOUR DESTINY"} <span aria-hidden="true">↓</span></legend>
                <div className="wh-hiring-positions__grid">
                  {positions.map((item) => (
                    <label key={item.id} className={position === item.id ? 'wh-hiring-position wh-hiring-position--selected' : 'wh-hiring-position'}>
                      <div className="wh-hiring-position__clip">
                        {videoMissing && !localVideo ? (
                          <div className="wh-hiring-position__missing" aria-label="Video preview unavailable">
                            <span aria-hidden="true">▶</span>
                            <small>{fa ? "پیش‌نمایش در دسترس نیست" : "PREVIEW OFFLINE"}</small>
                          </div>
                        ) : (
                          <video
                            ref={(element) => { videoRefs.current[item.id] = element }}
                            src={videoSource}
                            playsInline
                            loop
                            preload="auto"
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
                          onChange={() => choosePosition(item.id)}
                          required
                        />
                        <strong title={item.label}>{fa ? item.labelFa : item.label}</strong>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {videoMissing && !localVideo && (
                <label className="wh-hiring-dialog__video-fallback">
                  {fa ? "ویدیو فعلاً روی سایت در دسترس نیست؛ از دستگاهت انتخابش کن:" : "The hosted video isn't available yet. Preview the supplied clip locally:"}
                  <input type="file" accept="video/mp4,video/*" onChange={chooseLocalVideo} />
                </label>
              )}

              <div className="wh-hiring-fields">
                <label>
                  {fa ? "نام شما" : "YOUR NAME"}
                  <input type="text" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setPreview(false) }} placeholder={fa ? "نام و نام خانوادگی" : "Your full name"} required />
                </label>
                <label>
                  {fa ? "ایمیل" : "EMAIL ADDRESS"}
                  <input type="email" dir="ltr" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setPreview(false) }} placeholder="you@the-void.com" required />
                </label>
              </div>

              <div className="wh-hiring-resume">
                <div>
                  <span className="wh-hiring-resume__eyebrow">{fa ? "کاغذبازی" : "THE PAPERWORK"}</span>
                  <h3>{fa ? "رزومهٔ شما" : "YOUR RÉSUMÉ"} <span>↗</span></h3>
                  <p>{fa ? "رزومه‌ات رو آپلود کن. قول می‌دیم اسم فایلش رو نگاه کنیم." : "Upload a CV. We promise to look at the filename."}</p>
                </div>
                <label className="wh-hiring-resume__upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={chooseResume}
                    required
                  />
                  <span>{fa ? "+ انتخاب فایل" : "+ CHOOSE FILE"}</span>
                  <small>{resume ? resume.name : (fa ? 'فایل PDF، DOC، DOCX یا TXT' : 'PDF, DOC, DOCX OR TXT')}</small>
                </label>
              </div>

              <button className="wh-hiring-submit" type="submit">
                {fa ? "پیش‌نمایش درخواست" : "PREVIEW APPLICATION"} <span aria-hidden="true">↗</span>
              </button>
              {preview && (
                <p className="wh-hiring-feedback" role="status">
                  {fa ? (
                    <>گزینهٔ {positions.find((item) => item.id === position)?.labelFa} انتخاب شد.
                    رزومهٔ ({resume?.name}) فقط روی دستگاه شما انتخاب شده؛ چیزی ارسال نشده.</>
                  ) : (
                    <>You selected {positions.find((item) => item.id === position)?.label}.
                    Your résumé ({resume?.name}) is selected locally — nothing was uploaded or sent.</>
                  )}
                </p>
              )}
              <p className="wh-hiring-disclaimer">{fa ? "این فرم فقط طنز و نمایشی است؛ هیچ اطلاعاتی ارسال نمی‌شود." : "PARODY / DEMO FORM ONLY — NO APPLICATION DATA IS TRANSMITTED."}</p>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
