import Decimal from 'decimal.js'

// Configure Decimal.js for high precision
Decimal.set({ precision: 36, rounding: Decimal.ROUND_DOWN })

export interface PoolReserves {
  reserveBerries: Decimal
  reserveTokens: Decimal
  feeBps: number
}

export interface QuoteResult {
  amountOut: Decimal
  fee: Decimal
  priceBefore: Decimal
  priceAfter: Decimal
  newReserveBerries: Decimal
  newReserveTokens: Decimal
}

/**
 * Calculate spot price (berries per token)
 */
export function getSpotPrice(reserveBerries: Decimal, reserveTokens: Decimal): Decimal {
  if (reserveTokens.isZero()) {
    return new Decimal(0)
  }
  return reserveBerries.div(reserveTokens)
}

/**
 * Quote for buying tokens with berries
 * User inputs ΔB (berries in)
 */
export function quoteBuy(
  reserveBerries: Decimal,
  reserveTokens: Decimal,
  berriesIn: Decimal,
  feeBps: number
): QuoteResult {
  if (berriesIn.lte(0)) {
    throw new Error('Berries in must be positive')
  }

  const feeDecimal = new Decimal(feeBps).div(10000)
  const berriesInEffective = berriesIn.mul(new Decimal(1).minus(feeDecimal))
  const fee = berriesIn.mul(feeDecimal)

  const priceBefore = getSpotPrice(reserveBerries, reserveTokens)

  // Constant product: k = Rb * Rt
  const k = reserveBerries.mul(reserveTokens)

  // New reserves after adding berries
  const newReserveBerries = reserveBerries.plus(berriesInEffective)
  const newReserveTokens = k.div(newReserveBerries)
  const tokensOut = reserveTokens.minus(newReserveTokens)

  const priceAfter = getSpotPrice(newReserveBerries, newReserveTokens)

  return {
    amountOut: tokensOut,
    fee,
    priceBefore,
    priceAfter,
    newReserveBerries,
    newReserveTokens,
  }
}

/**
 * Quote for selling tokens for berries
 * User inputs ΔT (tokens in)
 */
export function quoteSell(
  reserveBerries: Decimal,
  reserveTokens: Decimal,
  tokensIn: Decimal,
  feeBps: number
): QuoteResult {
  if (tokensIn.lte(0)) {
    throw new Error('Tokens in must be positive')
  }

  const feeDecimal = new Decimal(feeBps).div(10000)
  const tokensInEffective = tokensIn.mul(new Decimal(1).minus(feeDecimal))
  const fee = tokensIn.mul(feeDecimal).mul(getSpotPrice(reserveBerries, reserveTokens))

  const priceBefore = getSpotPrice(reserveBerries, reserveTokens)

  // Constant product: k = Rb * Rt
  const k = reserveBerries.mul(reserveTokens)

  // New reserves after adding tokens
  const newReserveTokens = reserveTokens.plus(tokensInEffective)
  const newReserveBerries = k.div(newReserveTokens)
  const berriesOut = reserveBerries.minus(newReserveBerries)

  const priceAfter = getSpotPrice(newReserveBerries, newReserveTokens)

  return {
    amountOut: berriesOut,
    fee,
    priceBefore,
    priceAfter,
    newReserveBerries,
    newReserveTokens,
  }
}

/**
 * Calculate minimum output with slippage protection
 */
export function applySlippage(amountOut: Decimal, slippageBps: number): Decimal {
  const slippageDecimal = new Decimal(slippageBps).div(10000)
  return amountOut.mul(new Decimal(1).minus(slippageDecimal))
}
