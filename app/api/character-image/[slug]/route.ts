import { NextRequest, NextResponse } from 'next/server'
import { getCharacterImageFilename } from '@/lib/character-image-paths'

/**
 * Resolves character slug to image path. Uses static mapping only - no fs.
 * Images are served as static assets from public/images/characters.
 * This avoids bundling 400MB+ into the serverless function on Vercel.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug.toLowerCase()
    const filename = getCharacterImageFilename(slug)
    if (filename) {
      return NextResponse.json({
        image: `/images/characters/${filename}`,
        type: 'file',
      })
    }
    // Fallback: try slug.png - client will 404 and show gradient if missing
    return NextResponse.json({
      image: `/images/characters/${slug}.png`,
      type: 'file',
    })
  } catch (error) {
    console.error('Error serving character image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
