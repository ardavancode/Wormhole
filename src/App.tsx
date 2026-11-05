import { useCallback, useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { GlitchButton } from '@wormhole/glitch-button'
import { RickrollLauncher } from '@wormhole/rickroll-launcher'
import { HiringForm } from '@wormhole/hiring-form'
import { DemolitionTeaser } from '@wormhole/page-demolition'
import { MouseVirusTeaser } from '@wormhole/mouse-virus'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/adolfo-ronaldo/style.css'
import '@wormhole/glitch-button/style.css'
import '@wormhole/rickroll-launcher/style.css'
import '@wormhole/hiring-form/style.css'
import '@wormhole/language-toggle/style.css'
import '@wormhole/page-demolition/style.css'
import '@wormhole/mouse-virus/style.css'

export default function App() {
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
  // Give every language its own real URL, so search engines can index both.
  const language: Language = /\/en\/?(?:index\.html)?$/.test(window.location.pathname) ? 'en' : 'fa'

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
    window.location.assign(import.meta.env.BASE_URL + (next === 'en' ? 'en/' : ''))
  }

  return (
    <>
      <LanguageToggle language={language} onChange={switchLanguage} />
      <main>
        {Reel ? <Reel language={language} /> : (
          <section className="ar-stage" aria-label={language === 'fa' ? 'آدولفو رونالدو' : 'Adolfo Ronaldo'}>
            <p className="ar-corner ar-corner--top">WORMHOLE // SAFE MODE</p>
            <div className="ar-title-block">
              <h1>{language === 'fa' ? 'آدولفو' : 'ADOLFO'}<br /><em>{language === 'fa' ? 'رونالدو' : 'RONALDO'}</em></h1>
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
        <section className="wormhole-about" aria-labelledby="wormhole-about-title">
          <div>
            <p className="wormhole-about__eyebrow">{language === 'fa' ? 'WORMHOLE // آزمایشگاه اینترنتی' : 'WORMHOLE // INTERNET LAB'}</p>
            <h2 id="wormhole-about-title">{language === 'fa' ? 'اینجا قوانین واقعیت یکم فرق می‌کنه.' : 'Reality has a few bugs here.'}</h2>
            <p>{language === 'fa'
              ? 'ورم‌هول یک زمین بازی تعاملی با React است؛ با افکت‌های گلیچ، ویدیوهای میم، غافلگیری ریک‌رول و یک فرم استخدام طنز. چیزهای عجیب اینجا جدی گرفته می‌شن.'
              : 'Wormhole is an experimental React playground packed with glitches, meme videos, Rickroll surprises, and a parody hiring form. Strange ideas are welcome.'}</p>
            <DemolitionTeaser language={language} href={import.meta.env.BASE_URL + (language === "en" ? "en/" : "") + "experiments/page-demolition/"} />
            <MouseVirusTeaser language={language} href={import.meta.env.BASE_URL + (language === "en" ? "en/" : "") + "experiments/mouse-virus/"} />
            <a href="#hiring">{language === 'fa' ? 'فرم استخدام غیرجدی ↓' : 'The extremely serious careers portal ↓'}</a>
          </div>
        </section>
        <aside className="wormhole-glitch-launcher" aria-label={language === 'fa' ? 'آزمایش گلیچ' : 'Glitch experiment'}>
          <GlitchButton language={language} label={language === 'fa' ? 'ورود به خلأ' : 'ENTER THE VOID'} />
        </aside>
        <RickrollLauncher language={language} />
      </main>
      <HiringForm language={language} />
    </>
  )
}
