// Character image mapping - handles different file formats
// Maps character slugs to their image file paths

const characterImageMap: Record<string, string> = {
  // Direct image files
  chopper: '/images/characters/chopper.webp',
  sanji: '/images/characters/sanji.webp',
  zoro: '/images/characters/zoro.jpg',
  
  // HTML files with base64 images - we'll extract or convert these
  // For now, using a fallback approach
  brook: '/images/characters/brook.htm',
  blackbeard: '/images/characters/blackbeard.htm',
  'boa-hancock': '/images/characters/boahancock.htm',
  boa: '/images/characters/boahancock.htm',
  buggy: '/images/characters/buggy.htm',
  carrot: '/images/characters/carrot.htm',
  crocodile: '/images/characters/crocodile.htm',
  doflamingo: '/images/characters/doflamingo.htm',
  fujitora: '/images/characters/fujitora.htm',
  gaban: '/images/characters/gaban.htm',
  imu: '/images/characters/imu.htm',
  kaido: '/images/characters/kaido.htm',
  kid: '/images/characters/kid.htm',
  kizaru: '/images/characters/kizaru.htm',
  kuma: '/images/characters/kuma.htm',
  law: '/images/characters/law.htm',
  loki: '/images/characters/loki.htm',
  lucci: '/images/characters/lucci.htm',
  mihawk: '/images/characters/mihawk.htm',
  rayleigh: '/images/characters/rayleigh.htm',
  rocks: '/images/characters/rocks.htm',
  roger: '/images/characters/roger.htm',
  sabo: '/images/characters/sabo.htm',
  shamrock: '/images/characters/shamrock.htm',
  shanks: '/images/characters/shanks.htm',
  usopp: '/images/characters/ussop.htm',
  ussop: '/images/characters/ussop.htm',
  vivi: '/images/characters/vivi.htm',
  yamato: '/images/characters/yamato.htm',
}

// Get image URL for a character slug
export function getCharacterImageUrl(slug: string): string | null {
  // Try exact match first
  if (characterImageMap[slug]) {
    return characterImageMap[slug]
  }
  
  // Try variations
  const variations = [
    slug.toLowerCase(),
    slug.replace(/-/g, ''),
    slug.replace(/_/g, '-'),
  ]
  
  for (const variant of variations) {
    if (characterImageMap[variant]) {
      return characterImageMap[variant]
    }
  }
  
  return null
}

// Check if image is an HTML file (needs special handling)
export function isHtmlImage(path: string | null): boolean {
  return path?.endsWith('.htm') || path?.endsWith('.html') || false
}

// Extract base64 image from HTML file (will be handled client-side)
export async function extractImageFromHtml(htmlPath: string): Promise<string | null> {
  try {
    const response = await fetch(htmlPath)
    const html = await response.text()
    
    // Try to find base64 image data
    const base64Match = html.match(/data:image\/[^;]+;base64,[^"']+/)
    if (base64Match) {
      return base64Match[0]
    }
    
    // Try to find img src with data URL
    const imgMatch = html.match(/<img[^>]+src=["'](data:image\/[^"']+)["']/i)
    if (imgMatch) {
      return imgMatch[1]
    }
  } catch (error) {
    console.error('Error extracting image from HTML:', error)
  }
  
  return null
}
