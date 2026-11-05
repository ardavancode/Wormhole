import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './RickrollLauncher.css'

const VIDEO_URL =
  'rickroll.mp4'

export function RickrollLauncher({ language = 'en' }: { language?: 'fa' | 'en' }) {
  const fa = language === 'fa'
  const [open, setOpen] = useState(false)
  const [needsTap, setNeedsTap] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const close = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setOpen(false)
    setNeedsTap(false)
  }

  const start = () => {
    const video = videoRef.current
    setOpen(true)
    setNeedsTap(false)
    if (!video) return

    video.currentTime = 0
    video.muted = false

    // Start from the actual click/touch event so sound can play on mobile.
    void video.play().catch(() => setNeedsTap(true))
  }

  useEffect(() => {
    if (!open) return

    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        videoRef.current?.pause()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <button
        className="rr-launcher"
        type="button"
        onClick={start}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span aria-hidden="true" className="rr-launcher__spark">✳</span>
        {fa ? "شروع" : "START"}
        <span aria-hidden="true">↗</span>
      </button>
      {createPortal(
        <div
          className={open ? 'rr-overlay rr-overlay--open' : 'rr-overlay'}
          role={open ? 'dialog' : undefined}
          aria-label={open ? (fa ? 'ویدیو' : 'Video') : undefined}
          aria-modal={open ? true : undefined}
          aria-hidden={!open}
        >
          <video
            ref={videoRef}
            className="rr-overlay__video"
            src={VIDEO_URL}
            playsInline
            preload="auto"
            onEnded={close}
          />
          <button className="rr-overlay__close" type="button" onClick={close}>
            {fa ? "بستن ×" : "CLOSE ×"}
          </button>
          {needsTap && (
            <button
              className="rr-overlay__resume"
              type="button"
              onClick={() => {
                void videoRef.current?.play().then(() => setNeedsTap(false))
              }}
            >
              {fa ? "▶ پخش ویدیو" : "▶ PLAY VIDEO"}
            </button>
          )}
        </div>,
        document.body,
      )}
    </>
  )
}
