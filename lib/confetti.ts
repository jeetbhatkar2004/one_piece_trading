import confetti from 'canvas-confetti'

export const celebrateTrade = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: NodeJS.Timeout = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    // One Piece colors: red, orange, yellow, black
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#dc2626', '#ea580c', '#fbbf24', '#000000'],
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#dc2626', '#ea580c', '#fbbf24', '#000000'],
    })
  }, 250)
}

export const celebrateProfit = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#ea580c'],
  })
}

export const celebrateRank = (rank: number) => {
  if (rank > 3) return
  
  const colors = rank === 1 ? ['#fbbf24'] : rank === 2 ? ['#ffffff', '#000000'] : ['#ea580c']
  
  confetti({
    particleCount: 200,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors,
  })
  
  confetti({
    particleCount: 200,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors,
  })
}
