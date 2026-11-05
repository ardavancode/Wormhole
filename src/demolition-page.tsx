import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { PageDemolition } from '@wormhole/page-demolition'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/page-demolition/style.css'
import '@wormhole/language-toggle/style.css'
import './index.css'
import './demolition-page.css'

function DemoPage() {
  const language: Language = window.location.pathname.includes('/en/experiments/') ? 'en' : 'fa'
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
  }, [language])
  const pagePath = 'experiments/page-demolition/'
  const homeUrl = import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '')
  const pageUrl = (lang: Language) => import.meta.env.BASE_URL + (lang === 'en' ? 'en/' : '') + pagePath
  return (
    <>
      <LanguageToggle language={language} onChange={(next) => {
        if (next !== language) window.location.assign(pageUrl(next))
      }} />
      <header className="pd-page-navigation">
        <a href={homeUrl}>{language === 'fa' ? '↵ بازگشت به ورم‌هول' : '↵ BACK TO WORMHOLE'}</a>
        <span>THE DEMOLITION LAB / 002</span>
      </header>
      <main>
        <PageDemolition language={language} />
      </main>
      <footer className="pd-page-footer">
        <a href={homeUrl}>{language === 'fa' ? 'آزمایش‌های بیشتر در ورم‌هول' : 'More experiments at Wormhole'} ↗</a>
      </footer>
    </>
  )
}

const root = document.getElementById('root')
if (root) createRoot(root).render(<StrictMode><DemoPage /></StrictMode>)
