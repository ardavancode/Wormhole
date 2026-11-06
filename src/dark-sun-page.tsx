import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { DarkSunMotion } from '@wormhole/dark-sun-motion'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/dark-sun-motion/style.css'
import '@wormhole/language-toggle/style.css'
import './index.css'
import './dark-sun-page.css'

function DarkSunPage() {
  const language: Language = window.location.pathname.includes('/en/experiments/') ? 'en' : 'fa'
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
  }, [language])

  const home = import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '')
  const route = (next: Language) => import.meta.env.BASE_URL +
    (next === 'en' ? 'en/' : '') + 'experiments/dark-sun/'

  return (
    <>
      <LanguageToggle language={language} onChange={(next) => {
        if (next !== language) window.location.assign(route(next))
      }} />
      <main>
        <DarkSunMotion
          language={language}
          imageSrc={import.meta.env.BASE_URL + 'dark-sun-monarch.webp'}
          returnHref={home + '#adolfo-entry'}
        />
      </main>
      <footer className="ds-page-footer">
        <a href={home + '#adolfo-entry'}>{language === 'fa' ? 'بازگشت به ورم‌هول ↓' : 'BACK TO WORMHOLE ↓'}</a>
      </footer>
    </>
  )
}

const root = document.getElementById('root')
if (root) createRoot(root).render(<StrictMode><DarkSunPage /></StrictMode>)
