import { prisma } from './prisma'
import Decimal from 'decimal.js'

export async function isMarketOpen(): Promise<boolean> {
  const config = await prisma.marketConfig.findUnique({
    where: { id: 'market' },
  })
  
  return config?.isOpen ?? true // Default to open if not set
}

export async function getMarketStatus() {
  const config = await prisma.marketConfig.findUnique({
    where: { id: 'market' },
  })
  
  return {
    isOpen: config?.isOpen ?? true,
    lastEvent: config?.lastEvent ?? null,
    closedAt: config?.closedAt ?? null,
    reopenedAt: config?.reopenedAt ?? null,
  }
}

export async function closeMarket(eventName: string) {
  return await prisma.marketConfig.upsert({
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
}

export async function reopenMarket() {
  const config = await prisma.marketConfig.findUnique({
    where: { id: 'market' },
  })

  // Apply price gaps when reopening
  if (config && !config.isOpen) {
    await applyPriceGaps()
  }

  return await prisma.marketConfig.upsert({
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
}

async function applyPriceGaps() {
  // Get all active characters and their pools
  const characters = await prisma.character.findMany({
    where: { isActive: true },
    include: { pool: true },
  })

  // Apply random price movements (gaps) to simulate market events
  for (const char of characters) {
    if (!char.pool) continue

    const reserveBerries = new Decimal(char.pool.reserveBerries)
    const reserveTokens = new Decimal(char.pool.reserveTokens)
    const currentPrice = reserveBerries.div(reserveTokens)

    // Random gap: -20% to +30% (favoring positive gaps for excitement)
    const gapPercent = (Math.random() * 0.5 - 0.2) // -0.2 to 0.3
    const newPrice = currentPrice.mul(1 + gapPercent)

    // Adjust reserves to create the price gap
    // Keep k constant (constant product formula)
    const k = reserveBerries.mul(reserveTokens)
    // newPrice = newReserveBerries / newReserveTokens
    // k = newReserveBerries * newReserveTokens
    // Solving: newReserveTokens = sqrt(k / newPrice), newReserveBerries = k / newReserveTokens
    const newReserveTokens = k.div(newPrice).sqrt()
    const newReserveBerries = k.div(newReserveTokens)

    await prisma.pool.update({
      where: { characterId: char.id },
      data: {
        reserveBerries: newReserveBerries.toString(),
        reserveTokens: newReserveTokens.toString(),
      },
    })

    // Create a price candle to record the gap
    const now = new Date()
    const bucketStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
    
    const oldPrice = currentPrice
    const highPrice = Decimal.max(oldPrice, newPrice)
    const lowPrice = Decimal.min(oldPrice, newPrice)
    
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
        open: oldPrice.toString(),
        high: highPrice.toString(),
        low: lowPrice.toString(),
        close: newPrice.toString(),
        volumeBerries: '0',
        volumeTokens: '0',
      },
    })
  }
}
