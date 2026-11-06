import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
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
  const audioStoppedRef = useRef(false)
  const [solved, setSolved] = useState(false)
  const [stage, setStage] = useState(0)
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [notice, setNotice] = useState('')
  const [playing, setPlaying] = useState(false)
  const [fakeJump, setFakeJump] = useState(0)
  const [exitRequests, setExitRequests] = useState(0)
  // Attempt sound immediately. If the browser blocks autoplay, its first
  // pointer/key interaction will unlock audio automatically, without a play button.
  const play = () => {
    const audio = audioRef.current
    if (!audio || !audioSrc || audioStoppedRef.current) return
    audio.volume = 0.7
    void audio.play().then(() => {
      setNotice('')
    }).catch(() => {
      if (!audioStoppedRef.current) {
        setNotice(fa
          ? 'مرورگر پخش خودکار صدا رو مسدود کرده؛ با اولین لمس یا کلید، آهنگ شروع می‌شه.'
          : 'Browser blocked autoplay. The first tap or key press starts the song.')
      }
    })
  }

  useEffect(() => {
    const unlockAudio = () => play()
    document.addEventListener('pointerdown', unlockAudio, { passive: true })
    document.addEventListener('keydown', unlockAudio)
    play()
    return () => {
      document.removeEventListener('pointerdown', unlockAudio)
      document.removeEventListener('keydown', unlockAudio)
      audioRef.current?.pause()
    }
  }, [audioSrc, fa])

  const stop = () => {
    audioStoppedRef.current = true
    audioRef.current?.pause()
    setPlaying(false)
  }

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (solved || !answer.trim()) return
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
    audioStoppedRef.current = false
    setSolved(false)
    setStage(0)
    setAnswer('')
    setAttempts(0)
    setNotice('')
    setFakeJump(0)
    setExitRequests(0)
    if (audioRef.current) audioRef.current.currentTime = 0
    play()
  }

  const teaseMute = () => {
    setFakeJump((n) => (n + 1) % 5)
    const lies = fa
      ? ['در حال ارسال درخواست قطع صدا به وزارت موسیقی…', 'خطا: آهنگ درخواست استعفای شما را رد کرد.', 'بلندگو خواست فعلاً تنهاش نذاری.', 'قطع صدا نیازمند تأیید واحد سکوت است.', 'دکمه پاسخگو نیست؛ لطفاً برای پیگیری شمارهٔ ۴۰۴ را بگیرید.']
      : ['Forwarding mute request to the Ministry of Music…', 'Error: the track rejected your resignation.', 'The speaker asked not to be left alone.', 'Mute request awaiting approval from Silence HQ.', 'Button not responding. Your ticket number is 404.']
    setNotice(lies[(fakeJump + 1) % lies.length])
  }

  const requestExit = () => {
    const excuses = fa
      ? ['درِ خروج برای ناهار رفته. ساعت برگشت معلوم نیست.', 'درخواست خروج شما ثبت شد. نفر ۸٬۴۳۷ صف هستید.', 'کارشناس خروج پرسید: جواب معما رو نوشتی؟', 'طبق قوانین این اتاق، خروج نیازمند سه امضاست.', 'سیستم گفت: برو معما رو حل کن، بعد صحبت می‌کنیم.']
      : ['The exit door is on lunch break. No return time provided.', 'Exit request queued. You are #8,437.', 'Exit support asks: have you answered the riddle?', 'This room requires three signatures for departure.', 'The system says: solve your riddle and we can talk.']
    setNotice(excuses[exitRequests % excuses.length])
    setExitRequests((n) => n + 1)
  }

  return (
    <section className="cs-lab" dir={fa ? 'rtl' : 'ltr'} aria-labelledby="cs-title">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false)
          setNotice(fa ? 'فایل آهنگ روی سایت بارگذاری نشد.' : 'The hosted soundtrack could not be loaded.')
        }}
      />

      <div className="cs-hero">
        <span className="cs-topline">WORMHOLE / EXPERIMENT 004 / SOUNDTRAP.EXE</span>
        <h1 id="cs-title">{fa ? 'آهنگ نفرین‌شده' : 'THE CURSED SONG'}</h1>
        <p>{fa
          ? 'آهنگ خودش شروع می‌شه. برای شکستن نفرین، سه معما رو حل کن.'
          : 'The song starts by itself. Solve three riddles to break the curse.'}</p>
      </div>

      {/* Keep a real audio stop available, but no play, file picker or direct back button. */}
      <div className="cs-quiet-controls">
        <button type="button" className="cs-quiet-button" onClick={stop}
          disabled={!playing} aria-label={fa ? 'توقف واقعی صدا' : 'Really stop audio'}>
          ❚❚ <span>{fa ? 'توقف صدا' : 'STOP AUDIO'}</span>
        </button>
      </div>

      <div className={'cs-room cs-room--started' + (solved ? ' cs-room--solved' : '')}>
        <div className="cs-windowbar" dir="ltr">
          <span>◉ ◉ ◉</span>
          <span>ESCAPE_PROTOCOL / LOCKED</span>
          <span>{solved ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</span>
        </div>
        <div className="cs-decor cs-decor--a" aria-hidden="true">♫</div>
        <div className="cs-decor cs-decor--b" aria-hidden="true">◉</div>
        <div className="cs-soundwave" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i key={i} style={{ '--wave-index': i } as CSSProperties} className={playing ? 'cs-soundwave--active' : ''} />
          ))}
        </div>

        {solved ? (
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
            <div className="cs-decoy-actions">
              <button type="button" className="cs-exit-request" onClick={requestExit}>
                {fa ? '↗ خروج' : '↗ EXIT'}
              </button>
              <button type="button" className={'cs-fake-mute cs-fake-mute--' + fakeJump}
                onPointerEnter={(event) => { if (event.pointerType === 'mouse') teaseMute() }}
                onClick={teaseMute} aria-label={fa ? 'قطع آهنگ' : 'Stop song'}>
                {fa ? '✕ قطع آهنگ' : '✕ STOP SONG'}
              </button>
            </div>
          </div>
        )}
        {<div className="cs-progress" aria-label={fa ? 'پیشرفت معما' : 'Puzzle progress'}>
          {riddles.map((_, i) => <span key={i} className={i < stage || solved ? 'cs-progress--open' : ''}>{i < stage || solved ? '✓' : '✕'}</span>)}
        </div>}
      </div>

      <p className="cs-message" aria-live="polite">{notice || (fa ? 'سه قفل تا خروج باقی مونده.' : 'Three locks remain before escape.')}</p>
    </section>
  )
}
