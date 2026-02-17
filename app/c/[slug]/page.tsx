import { Navbar } from '@/components/Navbar'
import { CharacterMarket } from '@/components/CharacterMarket'

export default function CharacterPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <CharacterMarket slug={params.slug} />
      </main>
    </div>
  )
}
