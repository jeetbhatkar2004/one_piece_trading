'use client'

import { useState, useEffect } from 'react'
import { getCharacterGradientColor } from '@/lib/character-descriptions'

interface CharacterAvatarProps {
  slug: string
  displayName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
  '3xl': 'w-28 h-28',
  '4xl': 'w-36 h-36',
  '5xl': 'w-44 h-44',
}

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  '3xl': 112,
  '4xl': 144,
  '5xl': 176,
}

export function CharacterAvatar({ 
  slug, 
  displayName, 
  size = 'md', 
  showName = false,
  className = ''
}: CharacterAvatarProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch image from API
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/character-image/${slug}`)
        if (res.ok) {
          const data = await res.json()
          if (data.image) {
            setImageSrc(data.image)
          } else {
            // No image found, use fallback
            setImageError(true)
          }
        } else {
          setImageError(true)
        }
      } catch (error) {
        setImageError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [slug])

  const ringGradient = getCharacterGradientColor(slug)

  // Show fallback if no image or error - full gradient OK (no transparent image to blend)
  if (imageError || (!loading && !imageSrc)) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 font-bold`}
          style={{ background: ringGradient }}
          title={displayName}
        >
          <span className="text-xs">{displayName.charAt(0)}</span>
        </div>
        {showName && (
          <span className="text-white font-medium">{displayName}</span>
        )}
      </div>
    )
  }

  // Show loading state - full gradient OK (no image yet)
  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 animate-pulse`}
          style={{ background: ringGradient }}
          title={displayName}
        >
          <span className="text-xs">...</span>
        </div>
        {showName && (
          <span className="text-white font-medium">{displayName}</span>
        )}
      </div>
    )
  }

  // Colored ring around black center - thin ring for subtle character accent
  const innerSize = Math.max(16, sizePixels[size] - 4) // p-0.5 = 2px each side
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full p-0.5 shadow-lg border border-white/20 overflow-hidden flex items-center justify-center shrink-0`}
        style={{ background: ringGradient }}
        title={displayName}
      >
        <div
          className="rounded-full bg-black overflow-hidden shrink-0 group"
          style={{ width: innerSize, height: innerSize }}
        >
          <img
            src={imageSrc!}
            alt={displayName}
            width={innerSize}
            height={innerSize}
            className="block w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      {showName && (
        <span className="text-white font-medium">{displayName}</span>
      )}
    </div>
  )
}
