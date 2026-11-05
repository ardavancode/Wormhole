import './LanguageToggle.css'

export type Language = 'fa' | 'en'

export function LanguageToggle({
  language,
  onChange,
}: {
  language: Language
  onChange: (next: Language) => void
}) {
  return (
    <nav className="wh-language-toggle" aria-label={language === 'fa' ? 'انتخاب زبان' : 'Choose language'} dir="ltr">
      <button type="button" lang="fa" aria-pressed={language === 'fa'} onClick={() => onChange('fa')}>فارسی</button>
      <span aria-hidden="true">/</span>
      <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => onChange('en')}>EN</button>
    </nav>
  )
}
