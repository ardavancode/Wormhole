import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { CursedSong } from '@wormhole/cursed-song'
import { LanguageToggle } from '@wormhole/language-toggle'
import type { Language } from '@wormhole/language-toggle'
import '@wormhole/cursed-song/style.css'
import '@wormhole/language-toggle/style.css'
import './index.css'
import './cursed-song-page.css'

function CursedSongPage() {
  const language: Language = window.location.pathname.includes('/en/experiments/') ? 'en' : 'fa'
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
  }, [language])

  const home = import.meta.env.BASE_URL + (language === 'en' ? 'en/' : '')
  const langPath = (lang: Language) => import.meta.env.BASE_URL +
    (lang === 'en' ? 'en/' : '') + 'experiments/cursed-song/'

  return (
    <>
      <LanguageToggle language={language} onChange={(next) => {
        if (next !== language) window.location.assign(langPath(next))
      }} />
      <header className="cs-pagebar">
        <span className="cs-pagebar__label">{language === 'fa' ? 'دستگاه موسیقی شمارهٔ ۰۰۴' : 'JUKEBOX UNIT 004'}</span>
        <span>THE CURSED JUKEBOX / 004</span>
      </header>
      <main>
        <CursedSong language={language} homeHref={home} audioSrc={import.meta.env.BASE_URL + 'cursed-song.mp3'} />
      </main>
      <footer className="cs-pagefooter">
        <span>WORMHOLE // EXIT REQUESTS ARE CURRENTLY UNDER REVIEW</span>
      </footer>
    </>
  )
}

const root = document.getElementById('root')
if (root) createRoot(root).render(<StrictMode><CursedSongPage /></StrictMode>)
