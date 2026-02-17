import { Navbar } from '@/components/Navbar'
import { PortfolioView } from '@/components/PortfolioView'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-display text-6xl text-black">PORTFOLIO</h1>
          <div className="accent-line flex-1"></div>
        </div>
        <PortfolioView />
      </main>
    </div>
  )
}
