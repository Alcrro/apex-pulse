import { ApexPulseLogo } from '../../atoms/ApexPulseLogo'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
        <ApexPulseLogo width={120} height={40} className="text-white" />
      </div>
    </header>
  )
}
