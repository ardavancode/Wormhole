import { useState } from 'react'
import './PageDemolition.css'

type Language = 'fa' | 'en'

const pieces = [
  { icon: '◈', fa: 'نوار فرمان', en: 'COMMAND BAR', tone: 'yellow' },
  { icon: '▧', fa: 'پوشه‌های محرمانه', en: 'SECRET FILES', tone: 'pink' },
  { icon: '◉', fa: 'پنجرهٔ جهان', en: 'REALITY WINDOW', tone: 'blue' },
  { icon: '⌁', fa: 'سیستم عامل', en: 'OPERATING SYSTEM', tone: 'green' },
  { icon: '✳', fa: 'تاریخچه', en: 'HISTORY', tone: 'blue' },
  { icon: '▣', fa: 'پیکسل‌های زنده', en: 'LIVING PIXELS', tone: 'yellow' },
  { icon: '☷', fa: 'اعلان‌های بی‌فایده', en: 'USELESS ALERTS', tone: 'pink' },
  { icon: '◇', fa: 'پنجرهٔ خطا', en: 'ERROR WINDOW', tone: 'green' },
  { icon: '◎', fa: 'آرشیو میم', en: 'MEME ARCHIVE', tone: 'yellow' },
  { icon: '⟡', fa: 'حافظهٔ سیستم', en: 'SYSTEM MEMORY', tone: 'pink' },
  { icon: '▥', fa: 'کنترل پنل', en: 'CONTROL PANEL', tone: 'green' },
  { icon: '※', fa: 'آخرین ذره', en: 'LAST PARTICLE', tone: 'blue' },
] as const

export function DemolitionTeaser({ language, href }: { language: Language; href: string }) {
  const fa = language === 'fa'
  return (
    <a className="pd-teaser" href={href}>
      <span className="pd-teaser__tag">EXPERIMENT 002 / NO REAL DAMAGE</span>
      <strong>{fa ? '⚒ سایت رو نابود کن' : '⚒ DESTROY A WEBSITE'}</strong>
      <span>{fa ? 'یک تخریب تمام‌عیار؛ بدون پاک شدن حتی یک فایل.' : 'Break everything. Lose absolutely nothing.'}</span>
      <span className="pd-teaser__arrow" aria-hidden="true">↗</span>
    </a>
  )
}

export function PageDemolition({ language }: { language: Language }) {
  const fa = language === 'fa'
  const [broken, setBroken] = useState<number[]>([])
  const count = broken.length
  const finished = count === pieces.length
  const destroy = (id: number) => {
    setBroken((previous) => previous.includes(id) ? previous : [...previous, id])
  }
  const detonate = () => setBroken(pieces.map((_, index) => index))
  const restore = () => setBroken([])

  return (
    <section className="pd-experiment" dir={fa ? 'rtl' : 'ltr'} aria-labelledby="pd-title">
      <div className="pd-intro">
        <p className="pd-kicker">WORMHOLE / EXPERIMENT 002 / CONTROLLED CHAOS</p>
        <h1 id="pd-title">{fa ? 'سایت رو تکه‌تکه کن.' : 'DESTROY THIS WEBSITE.'}</h1>
        <p>{fa
          ? 'به هر قطعه ضربه بزن تا از صفحه حذف بشه، یا با دکمهٔ انفجار همه‌چیز رو یک‌جا نابود کن. همهٔ خرابی‌ها فقط نمایشی‌اند.'
          : 'Tap any piece to knock it out of existence, or use TOTAL WIPE to destroy everything at once. No real files are harmed.'}</p>
      </div>
      <div className="pd-dashboard">
        <div className="pd-score" role="status" aria-live="polite">
          <span>{fa ? 'میزان تخریب' : 'DESTRUCTION LEVEL'}</span>
          <strong>{Math.round(count / pieces.length * 100)}%</strong>
          <div className="pd-meter" aria-hidden="true"><div style={{ width: count / pieces.length * 100 + '%' }} /></div>
        </div>
        <div className="pd-actions">
          <button type="button" className="pd-wipe" disabled={finished} onClick={detonate}>
            {fa ? '☄ نابودی کامل' : '☄ TOTAL WIPE'}
          </button>
          <button type="button" className="pd-restore" onClick={restore} disabled={count === 0}>
            {fa ? '↺ بازسازی دنیا' : '↺ RESTORE REALITY'}
          </button>
        </div>
      </div>
      <div className={'pd-simulation' + (finished ? ' pd-simulation--empty' : '')}>
        <div className="pd-screenbar" dir="ltr">
          <span aria-hidden="true">● ● ●</span>
          <span>UNSTABLE_REALITY.exe</span>
          <span>v0.0.404</span>
        </div>
        <div className="pd-pieces" role="group" aria-label={fa ? 'قطعات قابل‌تخریب' : 'Breakable pieces'}>
          {pieces.map((piece, index) => {
            const gone = broken.includes(index)
            return (
              <button
                type="button"
                key={index}
                className={'pd-piece pd-piece--' + piece.tone + (gone ? ' pd-piece--gone' : '')}
                disabled={gone}
                aria-label={(fa ? 'نابود کردن ' + piece.fa : 'Destroy ' + piece.en)}
                onClick={() => destroy(index)}
                tabIndex={gone ? -1 : 0}
              >
                <span className="pd-piece__icon" aria-hidden="true">{piece.icon}</span>
                <span className="pd-piece__label">{fa ? piece.fa : piece.en}</span>
                <span className="pd-piece__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>
        {finished && (
          <div className="pd-ending" role="status">
            <span>ERROR 404</span>
            <strong>{fa ? 'واقعیت پیدا نشد!' : 'REALITY NOT FOUND!'}</strong>
            <button type="button" onClick={restore}>{fa ? '↺ دنیا رو برگردون' : '↺ REBOOT THE UNIVERSE'}</button>
          </div>
        )}
      </div>
      <p className="pd-safe-note">{fa
        ? 'توجه: این فقط یک بازی تصویری است. سایت، مرورگر و فایل‌های شما دست‌نخورده می‌مانند.'
        : 'Visual destruction only. The real site, browser and your files are completely safe.'}</p>
    </section>
  )
}
