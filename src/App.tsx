import { useEffect, useState } from 'react'
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
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return window.localStorage.getItem('wormhole-language') === 'en' ? 'en' : 'fa'
    } catch {
      return 'fa'
    }
  })

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
    document.title = language === 'fa' ? 'ورم‌هول — آزمایشگاه هرج‌ومرج' : 'Wormhole — Chaos Playground'
    try {
      window.localStorage.setItem('wormhole-language', language)
    } catch {
      // Language selection still works when storage is unavailable.
    }
  }, [language])

  return (
    <>
      <LanguageToggle language={language} onChange={setLanguage} />
      <AdolfoRonaldo language={language} />
      <aside className="wormhole-glitch-launcher" aria-label={language === 'fa' ? 'آزمایش گلیچ' : 'Glitch experiment'}>
        <GlitchButton language={language} label={language === 'fa' ? 'ورود به خلأ' : 'ENTER THE VOID'} />
      </aside>
      <RickrollLauncher language={language} />
      <HiringForm language={language} />
    </>
  )
}
