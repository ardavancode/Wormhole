import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import './AdolfoRonaldo.css'

// The soundtrack and six uploaded photos are edited into one synchronized reel.
// Source media belongs in this package's media/ directory.
const hostedReel = 'adolfo-ronaldo.mp4'

export function AdolfoRonaldo({ language = 'en' }: { language?: 'fa' | 'en' }) {
  const fa = language === 'fa'
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const localUrl = useRef<string | null>(null)
  const [source, setSource] = useState(hostedReel)
  const [unavailable, setUnavailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playError, setPlayError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => () => {
    if (localUrl.current) URL.revokeObjectURL(localUrl.current)
  }, [])

  const play = () => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video || !audio) return

    setPlayError(false)
    setLoading(true)
    video.currentTime = 0
    audio.currentTime = 0
    video.playbackRate = 0.6 // Image transitions are 40% slower.
    video.muted = true
    audio.playbackRate = 1 // Keep the music at its original speed.
    audio.muted = false
    setMuted(false)

    // Both playback requests happen in the same user gesture.
    const videoStart = video.play()
    const audioStart = audio.play()
    void Promise.all([videoStart, audioStart])
      .then(() => {
        setLoading(false)
        setPlaying(true)
      })
      .catch(() => {
        video.pause()
        audio.pause()
        setLoading(false)
        setPlaying(false)
        setPlayError(true)
      })
  }

  const onChooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (localUrl.current) URL.revokeObjectURL(localUrl.current)
    const next = URL.createObjectURL(file)
    localUrl.current = next
    setUnavailable(false)
    setPlayError(false)
    setLoading(false)
    setPlaying(false)
    setSource(next)
  }

  const toggleMute = () => {
    const next = !muted
    if (audioRef.current) audioRef.current.muted = next
    setMuted(next)
  }

  return (
    <section className="ar-stage" dir={fa ? "rtl" : "ltr"} aria-label={fa ? "ویدیوی طنز آدولفو کریسلر" : "Adolfo Chrysler meme reel"}>
      <video
        ref={videoRef}
        className="ar-video"
        src={source}
        playsInline
        muted
        loop
        preload="none"
        onError={() => { setUnavailable(true); setLoading(false); setPlaying(false) }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <audio ref={audioRef} src={source} loop preload="none" />
      <div className="ar-grain" aria-hidden="true" />
      <div className="ar-shade" aria-hidden="true" />
      <p className="ar-corner ar-corner--top">{fa ? "ورم‌هول // خط زمانی گمشده" : "WORMHOLE // LOST TIMELINE"}</p>
      <div className="ar-title-block">
        <span className="ar-before">{fa ? "یک نمایش کاملاً جدی از" : "a very serious presentation of"}</span>
        <h1>{fa ? "آدولفو" : "ADOLFO"}<br /><em>{fa ? "کریسلر" : "CHRYSLER"}</em></h1>
        <span className="ar-after">{fa ? "زمان فقط یک توهمه ↗" : "TIME IS AN ILLUSION ↗"}</span>
      </div>

      {!playing && (
        <div className="ar-start">
          <span className="ar-start__index">{fa ? "نمایش ۰۰۱ — ۰۰:۱۰" : "EXHIBIT 001 — 00:10"}</span>
          {unavailable || playError ? (
            <>
              <p className="ar-start__help">
                {unavailable
                  ? (fa ? "ویدیو لود نشد؛ فایل رو از دستگاهت انتخاب کن." : "The hosted video could not be loaded. Choose a local video.")
                  : (fa ? "پخش نشد؛ دوباره تلاش کن یا ویدیوی خودت رو انتخاب کن." : "Playback failed. Try again or choose a local video.")}
              </p>
              {playError && !unavailable && <button type="button" className="ar-start__button" onClick={play}>{fa ? "↻ تلاش مجدد" : "↻ RETRY PLAYBACK"}</button>}
              <label className="ar-start__button ar-start__upload">
                {fa ? "انتخاب ویدیو ↗" : "CHOOSE THE REEL ↗"}
                <input type="file" accept="video/mp4,video/*" onChange={onChooseFile} />
              </label>
            </>
          ) : (
            <button className="ar-start__button" onClick={play} type="button" disabled={loading}>
              {loading ? (fa ? "در حال بارگذاری…" : "LOADING…") : (fa ? "پخش با صدا ↗" : "PLAY WITH SOUND ↗")}
            </button>
          )}
          <span className="ar-start__hint">{fa ? "برای ورود لمس کن" : "tap to enter the timeline"}</span>
        </div>
      )}

      <div className="ar-controls">
        {playing && <button type="button" onClick={toggleMute}>{muted ? (fa ? 'صدا خاموش ◻' : 'SOUND OFF ◻') : (fa ? 'صدا روشن ◉' : 'SOUND ON ◉')}</button>}
        <span>{fa ? "۶ تصویر / ۱ آهنگ" : "06 FRAGMENTS / 01 SONG"}</span>
      </div>
    </section>
  )
}
