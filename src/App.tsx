import { AdolfoRonaldo } from '@wormhole/adolfo-ronaldo'
import { GlitchButton } from '@wormhole/glitch-button'
import { RickrollLauncher } from '@wormhole/rickroll-launcher'
import { HiringForm } from '@wormhole/hiring-form'
import '@wormhole/adolfo-ronaldo/style.css'
import '@wormhole/glitch-button/style.css'
import '@wormhole/rickroll-launcher/style.css'
import '@wormhole/hiring-form/style.css'

export default function App() {
  return (
    <>
      <AdolfoRonaldo />
      <aside className="wormhole-glitch-launcher" aria-label="Glitch experiment">
        <GlitchButton label="ENTER THE VOID" />
      </aside>
      <RickrollLauncher />
      <HiringForm />
    </>
  )
}
