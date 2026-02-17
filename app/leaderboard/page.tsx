import { Navbar } from '@/components/Navbar'
import { LeaderboardView } from '@/components/LeaderboardView'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-display text-6xl text-black">LEADERBOARD</h1>
          <div className="accent-line flex-1"></div>
          <span className="text-op-red text-sm font-mono uppercase tracking-wider">🏆 TOP TRADERS</span>
        </div>
        <LeaderboardView />
      </main>
    </div>
  )
}
