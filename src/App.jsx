import { useState } from 'react'

export default function App() {
  const [experiments, setExperiments] = useState(0)

  return (
    <main className="page">
      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />

      <header className="header">
        <a className="brand" href="/" aria-label="Wormhole home">
          <span className="brand-icon" aria-hidden="true">✳</span>
          <span>WORMHOLE<span className="brand-dot">.</span></span>
        </a>
        <span className="status"><span className="status-light" /> Playground online</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="orbit" aria-hidden="true">
          <div className="orbit-ring orbit-ring-one" />
          <div className="orbit-ring orbit-ring-two" />
          <div className="orbit-core">✳</div>
        </div>

        <p className="eyebrow">THE EXPERIMENTS BEGIN HERE</p>
        <h1 id="hero-title">Reality is<br /><em>optional.</em></h1>
        <p className="intro">
          A little corner of the internet for big, weird ideas.
          React is ready. The rules are not.
        </p>

        <button
          className="experiment-button"
          type="button"
          onClick={() => setExperiments((count) => count + 1)}
        >
          <span>Run an experiment</span>
          <span aria-hidden="true">↗</span>
        </button>

        <p className="experiment-count" role="status" aria-live="polite">
          {experiments === 0
            ? 'No experiments yet. You know what to do.'
            : `${experiments} experiment${experiments === 1 ? '' : 's'} launched. Keep going.`}
        </p>
      </section>

      <footer className="footer">
        <span>REACT + VITE</span>
        <span>BUILT FOR CHAOS <span aria-hidden="true">✦</span></span>
      </footer>
    </main>
  )
}
