import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { GlitchButton } from '@wormhole/glitch-button'
import { RickrollLauncher } from '@wormhole/rickroll-launcher'
import { HiringForm } from '@wormhole/hiring-form'
import { DemolitionTeaser } from '@wormhole/page-demolition'
import { MouseVirusTeaser } from '@wormhole/mouse-virus'
import { CursedSong, CursedSongTeaser, activateCursedSong } from '@wormhole/cursed-song'
import { DarkSunMotion } from '@wormhole/dark-sun-motion'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/adolfo-ronaldo/style.css'
import '@wormhole/glitch-button/style.css'
import '@wormhole/rickroll-launcher/style.css'
import '@wormhole/hiring-form/style.css'
import '@wormhole/language-toggle/style.css'
import '@wormhole/page-demolition/style.css'
import '@wormhole/mouse-virus/style.css'
import '@wormhole/cursed-song/style.css'
import '@wormhole/dark-sun-motion/style.css'

export default function App() {
  const [inCursedSong, setInCursedSong] = useState(false)

  useEffect(() => {
    const syncRoute = () => setInCursedSong(window.location.pathname.endsWith('/experiments/cursed-song/'))
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const enterCursedSong = (event: import('react').MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    // Start audio before changing the UI or navigating: this uses the real click.
    activateCursedSong(import.meta.env.BASE_URL + 'cursed-song.mp3')
    const path = import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '') + 'experiments/cursed-song/'
    window.history.pushState({ wormhole: 'cursed-song' }, '', path)
    setInCursedSong(true)
    window.scrollTo(0, 0)
  }

  // Keep the rest of the site usable even if the reel chunk cannot load.
  const [Reel, setReel] = useState<ComponentType<{ language?: Language }> | null>(null)
  const [reelFailed, setReelFailed] = useState(false)

  const loadReel = useCallback(() => {
    setReelFailed(false)
    void import('@wormhole/adolfo-ronaldo')
      .then(({ AdolfoRonaldo }) => setReel(() => AdolfoRonaldo))
      .catch(() => setReelFailed(true))
  }, [])

  useEffect(() => { loadReel() }, [loadReel])

  // The site's starting point is in the middle of an extensible vertical canvas.
  // Preserve explicit anchors (and browser back/forward scroll restoration).
  useLayoutEffect(() => {
    if (window.location.hash) return
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (navigation?.type === 'back_forward') return
    const frame = window.requestAnimationFrame(() => {
      const startingSection = document.getElementById('adolfo-entry')
      if (startingSection) window.scrollTo(0, startingSection.offsetTop)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])
  // Give every language its own real URL, so search engines can index both.
  const language: Language = /\/en(?:\/|$)/.test(window.location.pathname) ? 'en' : 'fa'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
    try {
      window.localStorage.setItem('wormhole-language', language)
    } catch {
      // URL-based language selection works without storage.
    }
  }, [language])

  const switchLanguage = (next: Language) => {
    if (next === language) return
    // BASE_URL is / on Cloudflare and /Wormhole/ on GitHub Pages.
    window.location.assign(import.meta.env.BASE_URL + (next === 'en' ? 'en/' : '') + (inCursedSong ? 'experiments/cursed-song/' : ''))
  }

  return (
    <>
      <LanguageToggle language={language} onChange={switchLanguage} />
      {inCursedSong ? (
        <main>
          <CursedSong language={language} homeHref={import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '')} audioSrc={import.meta.env.BASE_URL + 'cursed-song.mp3'} />
        </main>
      ) : (
        <>
      <main>
        <div id="wormhole-upcoming">
          <DarkSunMotion
            language={language}
            imageSrc={import.meta.env.BASE_URL + 'dark-sun-monarch.webp'}
            fullHref={import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '') + 'experiments/dark-sun/'}
            returnHref="#adolfo-entry"
          />
        </div>
        <div id="adolfo-entry" className="wormhole-entry">
          {Reel ? <Reel language={language} /> : (
          <section className="ar-stage" aria-label={language === 'fa' ? 'آدولفو کریسلر' : 'Adolfo Chrysler'}>
            <p className="ar-corner ar-corner--top">WORMHOLE // SAFE MODE</p>
            <div className="ar-title-block">
              <h1>{language === 'fa' ? 'آدولفو' : 'ADOLFO'}<br /><em>{language === 'fa' ? 'کریسلر' : 'CHRYSLER'}</em></h1>
            </div>
            <div className="ar-start">
              <p className="ar-start__help">{reelFailed
                ? (language === 'fa' ? 'ویدیو بارگذاری نشد، ولی بقیهٔ ورم‌هول فعاله.' : "The reel couldn't load, but the rest of Wormhole still works.")
                : (language === 'fa' ? 'در حال آماده‌سازی ویدیو…' : 'Preparing the reel…')}</p>
              {reelFailed && <button type="button" className="ar-start__button" onClick={loadReel}>
                {language === 'fa' ? '↻ تلاش دوباره' : '↻ RETRY'}
              </button>}
              <a href="#wormhole-about-title" className="ar-start__button" style={{ textDecoration: 'none' }}>
                {language === 'fa' ? 'برو به آزمایش‌ها ↓' : 'EXPLORE EXPERIMENTS ↓'}
              </a>
            </div>
          </section>
          )}
        </div>
        <section className="wormhole-about" aria-labelledby="wormhole-about-title">
          <div>
            <p className="wormhole-about__eyebrow">{language === 'fa' ? 'WORMHOLE // آزمایشگاه اینترنتی' : 'WORMHOLE // INTERNET LAB'}</p>
            <h2 id="wormhole-about-title">{language === 'fa' ? 'اینجا قوانین واقعیت یکم فرق می‌کنه.' : 'Reality has a few bugs here.'}</h2>
            <p>{language === 'fa'
              ? 'ورم‌هول یک زمین بازی تعاملی با React است؛ با افکت‌های گلیچ، ویدیوهای میم، غافلگیری ریک‌رول و یک فرم استخدام طنز. چیزهای عجیب اینجا جدی گرفته می‌شن.'
              : 'Wormhole is an experimental React playground packed with glitches, meme videos, Rickroll surprises, and a parody hiring form. Strange ideas are welcome.'}</p>
            <a href="#hiring">{language === 'fa' ? 'فرم استخدام غیرجدی ↓' : 'The extremely serious careers portal ↓'}</a>
          </div>
        </section>
        <aside className="wormhole-glitch-launcher" aria-label={language === 'fa' ? 'آزمایش گلیچ' : 'Glitch experiment'}>
          <GlitchButton language={language} label={language === 'fa' ? 'ورود به خلأ' : 'ENTER THE VOID'} />
        </aside>
        <RickrollLauncher language={language} />
      </main>
      <HiringForm language={language} />
      <section className="wormhole-archive" aria-labelledby="wormhole-archive-title">
        <div className="wormhole-archive__intro">
          <span>WORMHOLE // BOTTOM OF THE RABBIT HOLE</span>
          <h2 id="wormhole-archive-title">{language === 'fa' ? 'آزمایش‌های تبعیدی' : 'THE EXILED EXPERIMENTS'}</h2>
          <p>{language === 'fa' ? 'چند خرابکاری عجیب که فرستادیم‌شون تهِ سایت.' : 'A few strange experiments banished to the bottom of the page.'}</p>
        </div>
        <div className="wormhole-archive__links">
          <DemolitionTeaser language={language} href={import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '') + 'experiments/page-demolition/'} />
          <MouseVirusTeaser language={language} href={import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '') + 'experiments/mouse-virus/'} />
          <CursedSongTeaser language={language} href={import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '') + 'experiments/cursed-song/'} onEnter={enterCursedSong} />
        </div>
      </section>
        </>
      )}
    </>
  )
}
