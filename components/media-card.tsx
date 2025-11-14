'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Play } from 'lucide-react'
import { getImageUrl, type Movie } from '@/lib/tmdb'
import { cn } from '@/lib/utils'

interface MediaCardProps {
  item: Movie
  showPlay?: boolean
  href?: string
}

export function MediaCard({ item, showPlay, href }: MediaCardProps) {
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv')
  const title = item.title || item.name || 'Untitled'
  const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]
  const rating = item.vote_average || 0
  const posterUrl = getImageUrl(item.poster_path, 'w500')

  const linkHref = href || (mediaType === 'person' ? undefined : `/${mediaType}/${item.id}`)

  const content = (
    <>
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted glass-hover">
        {posterUrl ? (
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {showPlay && mediaType !== 'person' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Play className="h-8 w-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {rating > 0 && (
          <div className="absolute top-2 right-2 glass px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-medium line-clamp-1 text-sm group-hover:text-primary transition-colors">
          {title}
        </h3>
        {year && (
          <p className="text-xs text-muted-foreground">{year}</p>
        )}
      </div>
    </>
  )

  if (mediaType === 'person') {
    return (
      <div className="group relative block transition-all duration-300">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={linkHref!}
      className="group relative block transition-all duration-300"
    >
      {content}
    </Link>
  )
}
