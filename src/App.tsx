import { useEffect } from 'react'
import { AdolfoRonaldo } from '@wormhole/adolfo-ronaldo'
import { GlitchButton } from '@wormhole/glitch-button'
import { RickrollLauncher } from '@wormhole/rickroll-launcher'
import { HiringForm } from '@wormhole/hiring-form'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/adolfo-ronaldo/style.css'
import '@wormhole/glitch-button/style.css'
import '@wormhole/rickroll-launcher/style.css'
import '@wormhole/hiring-form/style.css'
import '@wormhole/language-toggle/style.css'

export default function App() {
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
        <AdolfoRonaldo language={language} />
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
    </>
  )
}
