import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getAllCharacters } from '../lib/character-descriptions'

const prisma = new PrismaClient()
const characters = getAllCharacters()

// Load character prices (0-100 berries/token) - used for initial pool state
const pricesPath = join(__dirname, '../scripts/character-prices.json')
const characterPrices: Record<string, number> = (() => {
  try {
    return JSON.parse(readFileSync(pricesPath, 'utf-8'))
  } catch {
    return {}
  }
})()

function getStartingPrice(slug: string): Decimal {
  const price = characterPrices[slug] ?? 50
  const clamped = Math.max(0, Math.min(100, price))
  return new Decimal(clamped)
}

async function main() {
  console.log('Starting seed...')

  // Create characters and pools
  for (const char of characters) {
    const character = await prisma.character.upsert({
      where: { slug: char.slug },
      update: {
        displayName: char.displayName,
        isActive: true,
      },
      create: {
        slug: char.slug,
        displayName: char.displayName,
        isActive: true,
      },
    })

    // Initialize pool with starting reserves from character-prices.json (0-100 berries/token)
    const baseReserve = new Decimal(100000)
    const startingPrice = getStartingPrice(char.slug)
    const startingTokens = baseReserve.div(startingPrice)

    await prisma.pool.upsert({
      where: { characterId: character.id },
      update: {
        feeBps: 100,
        reserveBerries: baseReserve,
        reserveTokens: startingTokens,
      },
      create: {
        characterId: character.id,
        reserveBerries: baseReserve,
        reserveTokens: startingTokens,
        feeBps: 100, // 1% fee
      },
    })

    // Delete existing price candles so we regenerate with the new starting price
    await prisma.priceCandle.deleteMany({ where: { characterId: character.id } })

    // Create initial price candles for chart display (last 7 days, one per day)
    // Simulate realistic price movements from the new starting price
    const now = new Date()
    let currentPrice = startingPrice
    
    for (let i = 6; i >= 0; i--) {
      const bucketStart = new Date(now)
      bucketStart.setDate(bucketStart.getDate() - i)
      bucketStart.setHours(12, 0, 0, 0) // Set to noon for consistency

      // Simulate price movement: random walk with slight trend
      // Each day, price can change by -15% to +15%
      const changePercent = (Math.random() - 0.5) * 0.3 // -15% to +15%
      const priceChange = currentPrice.mul(changePercent)
      const newPrice = currentPrice.plus(priceChange)
      
      // Ensure price doesn't go below 10 or above 200
      const minPrice = new Decimal(10)
      const maxPrice = new Decimal(200)
      const clampedPrice = Decimal.min(Decimal.max(newPrice, minPrice), maxPrice)
      
      // Create OHLC (Open, High, Low, Close) with intraday variation
      const open = currentPrice
      const volatility = clampedPrice.mul(0.05) // 5% intraday volatility
      const high = Decimal.min(clampedPrice.plus(volatility.mul(Math.random())), maxPrice)
      const low = Decimal.max(clampedPrice.minus(volatility.mul(Math.random())), minPrice)
      const close = clampedPrice
      
      // Simulate some volume (random between 1000-10000 berries)
      const volumeBerries = new Decimal(Math.random() * 9000 + 1000)
      const volumeTokens = volumeBerries.div(clampedPrice)

      await prisma.priceCandle.upsert({
        where: {
          characterId_bucketStart: {
            characterId: character.id,
            bucketStart: bucketStart,
          },
        },
        update: {},
        create: {
          characterId: character.id,
          bucketStart: bucketStart,
          open: open,
          high: high,
          low: low,
          close: close,
          volumeBerries: volumeBerries,
          volumeTokens: volumeTokens,
        },
      })
      
      // Update current price for next iteration
      currentPrice = close
    }

    console.log(`Created ${char.displayName} (${char.slug}) - Price: ${startingPrice.toFixed(2)} berries/token`)
  }

  // All characters appear in trading - those without images show colored avatar placeholders
  // (No longer marking any characters as inactive based on image availability)

  // Create a default season
  const season = await prisma.season.upsert({
    where: { id: 'default-season' },
    update: {},
    create: {
      id: 'default-season',
      name: 'Season 1',
      startsAt: new Date(),
      endsAt: null,
    },
  })

  // Initialize market config (open by default)
  await prisma.marketConfig.upsert({
    where: { id: 'market' },
    update: {},
    create: {
      id: 'market',
      isOpen: true,
    },
  })
  console.log('✅ Market config initialized')

  console.log(`Created season: ${season.name}`)
  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
