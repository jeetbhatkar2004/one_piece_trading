import { Navbar } from '@/components/Navbar'
import { FriendsView } from '@/components/FriendsView'

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-display text-6xl text-black">FRIENDS</h1>
          <div className="accent-line flex-1"></div>
        </div>
        <FriendsView />
      </main>
    </div>
  )
}
