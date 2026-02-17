import { Navbar } from '@/components/Navbar'
import { SocialFeed } from '@/components/SocialFeed'
import { FriendsTradesFeed } from '@/components/FriendsTradesFeed'

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-display text-6xl text-black">FEED</h1>
          <div className="accent-line flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <SocialFeed />
          </div>
          
          {/* Friends Trades Sidebar */}
          <div className="lg:col-span-1">
            <FriendsTradesFeed />
          </div>
        </div>
      </main>
    </div>
  )
}
