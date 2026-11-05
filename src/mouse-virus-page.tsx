import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MouseVirusLab } from '@wormhole/mouse-virus'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/mouse-virus/style.css'
import '@wormhole/language-toggle/style.css'
import './index.css'
import './mouse-virus-page.css'

function MouseVirusPage() {
  const language: Language = window.location.pathname.includes('/en/experiments/') ? 'en' : 'fa'
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
  }, [language])

  const home = import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '')
  const route = (lang: Language) => import.meta.env.BASE_URL +
    (lang === 'en' ? 'en/' : '') + 'experiments/mouse-virus/'

  return (
    <>
      <LanguageToggle language={language} onChange={(next) => {
        if (next !== language) window.location.assign(route(next))
      }} />
      <header className="mv-page-bar">
        <a href={home}>{language === 'fa' ? '↵ برگشت به ورم‌هول' : '↵ BACK TO WORMHOLE'}</a>
        <span>CURSOR MALFUNCTION LAB / 003</span>
      </header>
      <main><MouseVirusLab language={language} /></main>
      <footer className="mv-page-footer">
        <a href={home}>{language === 'fa' ? 'آزمایش‌های عجیب‌تر' : 'MORE WEIRD EXPERIMENTS'} ↗</a>
      </footer>
    </>
  )
}

const root = document.getElementById('root')
if (root) createRoot(root).render(<StrictMode><MouseVirusPage /></StrictMode>)
