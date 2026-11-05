import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import './AdolfoRonaldo.css'

// The soundtrack and six uploaded photos are edited into one synchronized reel.
// Source media belongs in this package's media/ directory.
const hostedReel = 'adolfo-ronaldo.mp4'

export function AdolfoRonaldo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const localUrl = useRef<string | null>(null)
  const [source, setSource] = useState(hostedReel)
  const [unavailable, setUnavailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => () => {
    if (localUrl.current) URL.revokeObjectURL(localUrl.current)
  }, [])

  const play = () => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video || !audio) return

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
      .then(() => setPlaying(true))
      .catch(() => {
        video.pause()
        audio.pause()
        setPlaying(false)
      })
  }

  const onChooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (localUrl.current) URL.revokeObjectURL(localUrl.current)
    const next = URL.createObjectURL(file)
    localUrl.current = next
    setUnavailable(false)
    setPlaying(false)
    setSource(next)
  }

  const toggleMute = () => {
    const next = !muted
    if (audioRef.current) audioRef.current.muted = next
    setMuted(next)
  }

  return (
    <section className="ar-stage" aria-label="Adolfo Ronaldo meme reel">
      <video
        ref={videoRef}
        className="ar-video"
        src={source}
        playsInline
        muted
        loop
        preload="auto"
        onError={() => { setUnavailable(true); setPlaying(false) }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <audio ref={audioRef} src={source} loop preload="auto" />
      <div className="ar-grain" aria-hidden="true" />
      <div className="ar-shade" aria-hidden="true" />
      <p className="ar-corner ar-corner--top">WORMHOLE // LOST TIMELINE</p>
      <div className="ar-title-block" aria-hidden="true">
        <span className="ar-before">a very serious presentation of</span>
        <h1>ADOLFO<br /><em>RONALDO</em></h1>
        <span className="ar-after">TIME IS AN ILLUSION ↗</span>
      </div>

      {!playing && (
        <div className="ar-start">
          <span className="ar-start__index">EXHIBIT 001 — 00:10</span>
          {unavailable ? (
            <>
              <p className="ar-start__help">
                Media isn't hosted yet. Choose the supplied video to watch locally.
              </p>
              <label className="ar-start__button ar-start__upload">
                CHOOSE THE REEL ↗
                <input type="file" accept="video/mp4,video/*" onChange={onChooseFile} />
              </label>
            </>
          ) : (
            <button className="ar-start__button" onClick={play} type="button">
              PLAY WITH SOUND ↗
            </button>
          )}
          <span className="ar-start__hint">tap to enter the timeline</span>
        </div>
      )}

      <div className="ar-controls">
        {playing && <button type="button" onClick={toggleMute}>{muted ? 'SOUND OFF ◻' : 'SOUND ON ◉'}</button>}
        <span>06 FRAGMENTS / 01 SONG</span>
      </div>
    </section>
  )
}
