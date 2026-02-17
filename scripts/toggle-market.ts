/**
 * Script to toggle market open/closed
 * Usage:
 *   npm run market:close "Grand Line Storm Event"
 *   npm run market:open
 */

import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'

const prisma = new PrismaClient()

async function applyPriceGaps() {
  const characters = await prisma.character.findMany({
    where: { isActive: true },
    include: { pool: true },
  })

  for (const char of characters) {
    if (!char.pool) continue

    const reserveBerries = new Decimal(char.pool.reserveBerries.toString())
    const reserveTokens = new Decimal(char.pool.reserveTokens.toString())
    const currentPrice = reserveBerries.div(reserveTokens)

    // Random gap: -20% to +30%
    const gapPercent = (Math.random() * 0.5 - 0.2)
    const newPrice = currentPrice.mul(1 + gapPercent)

    const k = reserveBerries.mul(reserveTokens)
    const newReserveTokens = k.div(newPrice).sqrt()
    const newReserveBerries = k.div(newReserveTokens)

    await prisma.pool.update({
      where: { characterId: char.id },
      data: {
        reserveBerries: newReserveBerries.toString(),
        reserveTokens: newReserveTokens.toString(),
      },
    })

    const now = new Date()
    const bucketStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
    
    const highPrice = Decimal.max(currentPrice, newPrice)
    const lowPrice = Decimal.min(currentPrice, newPrice)
    
    await prisma.priceCandle.upsert({
      where: {
        characterId_bucketStart: {
          characterId: char.id,
          bucketStart,
        },
      },
      update: {
        high: highPrice.toString(),
        low: lowPrice.toString(),
        close: newPrice.toString(),
      },
      create: {
        characterId: char.id,
        bucketStart,
        open: currentPrice.toString(),
        high: highPrice.toString(),
        low: lowPrice.toString(),
        close: newPrice.toString(),
        volumeBerries: '0',
        volumeTokens: '0',
      },
    })
  }
}

async function main() {
  const action = process.argv[2]
  const eventName = process.argv[3] || 'Market Closure'

  if (action === 'close') {
    await prisma.marketConfig.upsert({
      where: { id: 'market' },
      update: {
        isOpen: false,
        lastEvent: eventName,
        closedAt: new Date(),
      },
      create: {
        id: 'market',
        isOpen: false,
        lastEvent: eventName,
        closedAt: new Date(),
      },
    })
    console.log(`✅ Market closed: ${eventName}`)
  } else if (action === 'open') {
    await applyPriceGaps()
    await prisma.marketConfig.upsert({
      where: { id: 'market' },
      update: {
        isOpen: true,
        reopenedAt: new Date(),
      },
      create: {
        id: 'market',
        isOpen: true,
        reopenedAt: new Date(),
      },
    })
    console.log('✅ Market reopened with price gaps applied')
  } else {
    console.log('Usage:')
    console.log('  npm run market:close "Event Name"')
    console.log('  npm run market:open')
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
