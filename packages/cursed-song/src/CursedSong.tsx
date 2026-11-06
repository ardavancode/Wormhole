import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ChangeEvent, FormEvent } from 'react'
import './CursedSong.css'

type Language = 'fa' | 'en'

const riddles = [
  {
    fa: 'همیشه پشت سرت می‌آیم، اما وقتی چراغ‌ها خاموش شوند ناپدید می‌شوم. کیستم؟',
    en: 'I follow you wherever you go, but vanish when the lights go out. What am I?',
    hintFa: 'زیر نور خورشید کنار پایت پیدایش می‌کنی.',
    hintEn: 'You see it beside your feet in the sunshine.',
    answers: ['سایه', 'shadow'],
  },
  {
    fa: 'هرچه بیشتر از من برداری، بزرگ‌تر می‌شوم. چی هستم؟',
    en: 'The more you take away from me, the bigger I get. What am I?',
    hintFa: 'با بیل هم می‌توانی درستش کنی.',
    hintEn: 'You could create one using a shovel.',
    answers: ['چاله', 'گودال', 'حفره', 'hole', 'pit'],
  },
  {
    fa: 'وقتی اسمم را می‌گویی، مرا می‌شکنی. من چی‌ام؟',
    en: 'Speak my name and you break me. What am I?',
    hintFa: 'نبودِ صدا.',
    hintEn: 'The absence of sound.',
    answers: ['سکوت', 'خاموشی', 'silence', 'quiet'],
  },
] as const

const cleanAnswer = (value: string) => value
  .normalize('NFKC')
  .toLocaleLowerCase()
  .replace(/[\u064B-\u065F\u0670\u0640\u200c]/g, '')
  .replace(/[يى]/g, 'ی')
  .replace(/ك/g, 'ک')
  .replace(/[\s\p{P}\p{S}]+/gu, '')

export function CursedSongTeaser({ language, href }: { language: Language; href: string }) {
  const fa = language === 'fa'
  return (
    <a className="cs-teaser" href={href}>
      <span className="cs-teaser__serial">EXPERIMENT 004 / ESCAPE THE LOOP</span>
      <strong>{fa ? '♫ آهنگ نفرین‌شده' : '♫ THE CURSED SONG'}</strong>
      <span>{fa ? 'برای خروج سه معمای متنی حل کن... اگر دکمه‌ها بذارن!' : 'Solve three riddles to unlock the exit. The buttons may disagree.'}</span>
      <span className="cs-teaser__arrow" aria-hidden="true">↗</span>
    </a>
  )
}

export function CursedSong({ language, homeHref, audioSrc }: {
  language: Language
  homeHref: string
  audioSrc?: string
}) {
  const fa = language === 'fa'
  const audioRef = useRef<HTMLAudioElement>(null)
  const localUrlRef = useRef<string | null>(null)
  const [localAudio, setLocalAudio] = useState<string | null>(null)
  const [hostedAvailable, setHostedAvailable] = useState(false)
  const [fileName, setFileName] = useState('')
  const [started, setStarted] = useState(false)
  const [solved, setSolved] = useState(false)
  const [stage, setStage] = useState(0)
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [notice, setNotice] = useState('')
  const [playing, setPlaying] = useState(false)
  const [fakeJump, setFakeJump] = useState(0)
  // A missing static asset must not replace the game with a 404/HTML audio error.
  // Once public/cursed-song.mp3 exists on the host it becomes the default track.
  const source = localAudio ?? (hostedAvailable ? audioSrc : undefined)

  useEffect(() => {
    if (!audioSrc) {
      setHostedAvailable(false)
      return
    }
    const controller = new AbortController()
    void fetch(audioSrc, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
        if (!controller.signal.aborted) {
          setHostedAvailable(response.ok && contentType.startsWith('audio/'))
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setHostedAvailable(false)
      })
    return () => controller.abort()
  }, [audioSrc])

  useEffect(() => () => {
    audioRef.current?.pause()
    if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current)
  }, [])

  const selectAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (!file.type.startsWith('audio/')) {
      setNotice(fa ? 'یک فایل صوتی انتخاب کن.' : 'Please select an audio file.')
      return
    }
    audioRef.current?.pause()
    if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current)
    const next = URL.createObjectURL(file)
    localUrlRef.current = next
    setLocalAudio(next)
    setFileName(file.name)
    setPlaying(false)
    setNotice(fa ? 'آهنگ انتخاب شد. برای پخش، «پخش صدا» رو بزن.' : 'Audio selected. Hit PLAY AUDIO to hear it.')
  }

  const play = () => {
    const audio = audioRef.current
    if (!audio || !source) return
    audio.volume = 0.55
    void audio.play().catch(() => {
      setPlaying(false)
      setNotice(fa ? 'مرورگر پخش صدا رو نپذیرفت؛ با دکمهٔ پخش دوباره امتحان کن.' : 'Playback was blocked. Try the play button again.')
    })
  }

  const stop = () => {
    audioRef.current?.pause()
    setPlaying(false)
  }

  const start = () => {
    setStarted(true)
    setSolved(false)
    setStage(0)
    setAnswer('')
    setAttempts(0)
    setNotice(fa ? 'سه قفل. سه جواب. یک خروج.' : 'Three locks. Three answers. One exit.')
    if (source) play()
  }

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!started || solved || !answer.trim()) return
    const expected = riddles[stage].answers as readonly string[]
    if (expected.some((candidate) => cleanAnswer(candidate) === cleanAnswer(answer))) {
      setAnswer('')
      setAttempts(0)
      if (stage === riddles.length - 1) {
        setSolved(true)
        setNotice(fa ? 'قفل شکسته شد؛ در خروج بازه!' : 'The final lock is broken. Exit unlocked!')
        stop()
      } else {
        setStage((current) => current + 1)
        setNotice(fa ? 'درست بود! قفل بعدی فعال شد.' : 'Correct! The next lock is active.')
      }
    } else {
      setAttempts((count) => count + 1)
      setNotice(fa ? 'نه! قفل هنوز بسته‌ست. دوباره تلاش کن.' : 'Not quite! The lock is still closed.')
    }
  }

  const restart = () => {
    stop()
    setStarted(false)
    setSolved(false)
    setStage(0)
    setAnswer('')
    setAttempts(0)
    setNotice('')
    setFakeJump(0)
  }

  const teaseMute = () => {
    setFakeJump((n) => (n + 1) % 5)
    setNotice(fa ? 'عه، این دکمه تقلبیه! کنترل واقعی صدا بالای صفحه‌ست 😂' : 'Oops, fake button! The real audio controls are above. 😂')
  }

  return (
    <section className="cs-lab" dir={fa ? 'rtl' : 'ltr'} aria-labelledby="cs-title">
      <audio
        ref={audioRef}
        src={source}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false)
          if (!localAudio) setHostedAvailable(false)
          setNotice(fa ? 'فایل صوتی پخش نشد؛ یک فایل دیگه امتحان کن.' : 'Audio failed to load. Try another file.')
        }}
      />

      <div className="cs-hero">
        <span className="cs-topline">WORMHOLE / EXPERIMENT 004 / SOUNDTRAP.EXE</span>
        <h1 id="cs-title">{fa ? 'آهنگ نفرین‌شده' : 'THE CURSED SONG'}</h1>
        <p>{fa
          ? 'یه اتاق فرار موسیقیایی. برای باز کردن خروجی اصلی باید سه معمای متنی رو حل کنی؛ آهنگ هم می‌تونه تا اون موقع تکرار بشه.'
          : 'A musical escape room. Solve three text riddles to unlock the secret exit while the song loops in the background.'}</p>
        <p className="cs-disclaimer">{fa
          ? 'این فقط یه بازیه: صدا با انتخاب خودت شروع می‌شه و همیشه می‌تونی متوقفش کنی یا فوراً خارج بشی.'
          : 'A harmless game: audio starts only when you choose, and real pause and emergency exit always work.'}</p>
      </div>

      <div className="cs-control-strip">
        <div className="cs-media-control">
          <label className="cs-upload">
            <span>{fa ? '♫ انتخاب آهنگ آزمایشی' : '♫ CHOOSE A TEST SONG'}</span>
            <input type="file" accept="audio/*" onChange={selectAudio} />
          </label>
          <span className="cs-track" title={fileName || undefined}>
            {fileName || (hostedAvailable ? 'Master Baiter — Havexy' : (fa ? 'فایل صوتی رو از دستگاهت انتخاب کن' : 'CHOOSE AN AUDIO FILE TO PLAY'))}
          </span>
          <button type="button" className="cs-audio" onClick={playing ? stop : play} disabled={!source}>
            {playing ? (fa ? '❚❚ توقف واقعی صدا' : '❚❚ PAUSE AUDIO') : (fa ? '▶ پخش صدا' : '▶ PLAY AUDIO')}
          </button>
        </div>
        <a className="cs-emergency" href={homeHref} onClick={stop}>
          {fa ? '↗ خروج اضطراری واقعی' : '↗ REAL EMERGENCY EXIT'}
        </a>
      </div>

      <div className={'cs-room' + (started ? ' cs-room--started' : '') + (solved ? ' cs-room--solved' : '')}>
        <div className="cs-windowbar" dir="ltr">
          <span>◉ ◉ ◉</span>
          <span>ESCAPE_PROTOCOL / LOCKED</span>
          <span>{solved ? 'ACCESS GRANTED' : started ? 'ACCESS DENIED' : 'STANDBY'}</span>
        </div>
        <div className="cs-decor cs-decor--a" aria-hidden="true">♫</div>
        <div className="cs-decor cs-decor--b" aria-hidden="true">◉</div>
        <div className="cs-soundwave" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i key={i} style={{ '--wave-index': i } as CSSProperties} className={playing ? 'cs-soundwave--active' : ''} />
          ))}
        </div>

        {!started ? (
          <div className="cs-door cs-door--intro">
            <span className="cs-door__tag">LOCK STATUS: 3 / 3</span>
            <h2>{fa ? 'جرئت داری وارد شی؟' : 'ENTER THE LOOP?'}</h2>
            <p>{fa ? 'درها فقط وقتی باز می‌شن که معماها رو حل کرده باشی.' : 'The ordinary exit opens only after you solve the riddles.'}</p>
            <button className="cs-primary" type="button" onClick={start}>
              {fa ? '⟶ شروع نفرین' : '⟶ START THE CURSE'}
            </button>
            {!source && <span className="cs-no-track">{fa ? 'فعلاً بدون آهنگ هم می‌تونی معما رو بازی کنی.' : 'You can play the puzzles without audio for now.'}</span>}
          </div>
        ) : solved ? (
          <div className="cs-door cs-door--victory" role="status">
            <span className="cs-door__tag">LOCKS: 0 / 3 · ACCESS GRANTED</span>
            <h2>{fa ? 'تبریک! نفرین شکسته شد.' : 'CURSE BROKEN. YOU ESCAPED.'}</h2>
            <p>{fa ? 'معماها رو حل کردی و آهنگ هم متوقف شد. حالا درِ خروج اصلی بازه.' : 'Every riddle solved. The song has stopped. The main exit is finally unlocked.'}</p>
            <a className="cs-primary" href={homeHref} onClick={stop}>{fa ? '🚪 خروج از اتاق' : '🚪 EXIT THE ROOM'}</a>
            <button type="button" className="cs-secondary" onClick={restart}>{fa ? '↻ دوباره بازی کن' : '↻ PLAY AGAIN'}</button>
          </div>
        ) : (
          <div className="cs-door cs-door--puzzle">
            <span className="cs-door__tag">{fa ? 'قفل' : 'LOCK'} {stage + 1} / {riddles.length}</span>
            <h2>{fa ? 'معمای خروج' : 'THE EXIT RIDDLE'}</h2>
            <p className="cs-riddle">{fa ? riddles[stage].fa : riddles[stage].en}</p>
            <form className="cs-answer" onSubmit={submitAnswer}>
              <label htmlFor="cs-answer-input">{fa ? 'جواب معما رو بنویس:' : 'Type the answer:'}</label>
              <div className="cs-answer__line">
                <input
                  id="cs-answer-input"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={70}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder={fa ? 'حدست چیه؟' : 'Your guess…'}
                  required
                />
                <button className="cs-primary" type="submit">{fa ? 'باز کردن قفل ↗' : 'UNLOCK ↗'}</button>
              </div>
            </form>
            {attempts >= 2 && <p className="cs-hint">{fa ? 'راهنما: ' + riddles[stage].hintFa : 'HINT: ' + riddles[stage].hintEn}</p>}
            <button type="button" className={'cs-fake-mute cs-fake-mute--' + fakeJump} onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') teaseMute()
            }} onClick={teaseMute} aria-label={fa ? 'دکمهٔ تقلبی قطع آهنگ' : 'Fake mute button'}>
              {fa ? '✕ قطع آهنگ؟' : '✕ STOP SONG?'}
            </button>
          </div>
        )}
        {started && <div className="cs-progress" aria-label={fa ? 'پیشرفت معما' : 'Puzzle progress'}>
          {riddles.map((_, i) => <span key={i} className={i < stage || solved ? 'cs-progress--open' : ''}>{i < stage || solved ? '✓' : '✕'}</span>)}
        </div>}
      </div>

      <p className="cs-message" aria-live="polite">{notice || (fa ? 'برای شروع، روی دکمهٔ بزرگ بزن.' : 'Press the big button to begin.')}</p>
    </section>
  )
}
