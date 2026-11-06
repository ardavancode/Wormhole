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
  const [fileName, setFileName] = useState('')
  const [started, setStarted] = useState(false)
  const [solved, setSolved] = useState(false)
  const [stage, setStage] = useState(0)
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [notice, setNotice] = useState('')
  const [playing, setPlaying] = useState(false)
  const [fakeJump, setFakeJump] = useState(0)
  const [exitRequests, setExitRequests] = useState(0)
  // The supplied public MP3 is included in the deployed site.
  // Start playing synchronously inside the user's START click.
  const source = localAudio ?? audioSrc

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
    setNotice(fa ? 'موسیقی جایگزین پذیرفته شد.' : 'Replacement soundtrack accepted.')
  }

  const play = () => {
    const audio = audioRef.current
    if (!audio || !source) return
    audio.volume = 0.7
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
    setNotice(fa ? 'سیستم خروج موقتاً در دست تعمیره. لطفاً خونسرد باش.' : 'The exit system is temporarily under maintenance. Remain calm.')
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
    setExitRequests(0)
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
        src={source}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false)
          setNotice(fa ? 'فایل صوتی پخش نشد؛ یک فایل دیگه امتحان کن.' : 'Audio failed to load. Try another file.')
        }}
      />

      <div className="cs-hero">
        <span className="cs-topline">WORMHOLE / EXPERIMENT 004 / SOUNDTRAP.EXE</span>
        <h1 id="cs-title">{fa ? 'آهنگ نفرین‌شده' : 'THE CURSED SONG'}</h1>
        <p>{fa
          ? 'فقط یه موزیک‌پلیر معمولیه. یه دکمه داره. بزن ببین چی می‌شه…'
          : 'Just an ordinary music player. One button. What could possibly go wrong?'}</p>
      </div>

      {/* Safety controls always work; they are low-key rather than the punchline. */}
      <div className="cs-quiet-controls">
        <button type="button" className="cs-quiet-button" onClick={playing ? stop : play}
          disabled={!source} aria-label={playing ? (fa ? 'قطع واقعی صدا' : 'Actually pause audio') : (fa ? 'پخش صدا' : 'Play audio')}>
          {playing ? '❚❚' : '▶'} <span>{fa ? 'صدا' : 'AUDIO'}</span>
        </button>
        <a className="cs-quiet-exit" href={homeHref} onClick={stop}
          aria-label={fa ? 'خروج واقعی از بازی و توقف آهنگ' : 'Really exit the game and stop audio'}>
          <span aria-hidden="true">↩</span> {fa ? 'بازگشت به سایت' : 'Back to site'}
        </a>
        <details className="cs-music-settings">
          <summary aria-label={fa ? 'تنظیمات آهنگ' : 'Audio settings'}>⚙</summary>
          <label className="cs-upload">
            <span>{fa ? 'انتخاب موسیقی دیگر' : 'CHOOSE OTHER AUDIO'}</span>
            <input type="file" accept="audio/*" onChange={selectAudio} />
          </label>
          <span className="cs-track" title={fileName || undefined}>{fileName || 'Master Baiter — Havexy'}</span>
        </details>
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
            <span className="cs-door__tag">JUKEBOX // READY</span>
            <h2>{fa ? 'فقط یه آهنگه :)' : 'IT’S JUST A SONG :)'}</h2>
            <p>{fa ? 'شما با ورود به این صفحه رسماً هیچ‌چیزی رو قبول نکردی. احتمالاً.' : 'You definitely did not agree to anything by coming here. Probably.'}</p>
            <button className="cs-primary" type="button" onClick={start} disabled={!source}>
              {fa ? '▶ ورود' : '▶ ENTER'}
            </button>
            {!source && <span className="cs-no-track">{fa ? 'فایل آهنگ موجود نیست؛ از تنظیمات پایین آهنگ انتخاب کن.' : 'Soundtrack missing. Choose an audio file from settings.'}</span>}
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
        {started && <div className="cs-progress" aria-label={fa ? 'پیشرفت معما' : 'Puzzle progress'}>
          {riddles.map((_, i) => <span key={i} className={i < stage || solved ? 'cs-progress--open' : ''}>{i < stage || solved ? '✓' : '✕'}</span>)}
        </div>}
      </div>

      <p className="cs-message" aria-live="polite">{notice || (fa ? 'برای شروع، روی دکمهٔ بزرگ بزن.' : 'Press the big button to begin.')}</p>
    </section>
  )
}
