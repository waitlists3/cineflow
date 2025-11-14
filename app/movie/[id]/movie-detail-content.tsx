'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Bookmark, BookmarkCheck, Star, Calendar, DollarSign, Volume2, VolumeX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl, type MovieDetails } from '@/lib/tmdb'
import { addToWatchlist, removeFromWatchlist, isInWatchlist, addToContinueWatching } from '@/lib/watchlist'

export function MovieDetailContent({ movie, isWatchMode }: { movie: MovieDetails; isWatchMode: boolean }) {
  const [inWatchlist, setInWatchlist] = useState(false)
  const [muted, setMuted] = useState(true)
  const [showPlayer, setShowPlayer] = useState(isWatchMode)
  
  useEffect(() => {
    setInWatchlist(isInWatchlist(movie.id, 'movie'))
  }, [movie.id])
  
  useEffect(() => {
    setShowPlayer(isWatchMode)
  }, [isWatchMode])
  
  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie')
      setInWatchlist(false)
    } else {
      addToWatchlist({
        id: movie.id,
        mediaType: 'movie',
        title: movie.title,
        poster: movie.poster_path || '',
      })
      setInWatchlist(true)
    }
  }
  
  const handlePlay = () => {
    setShowPlayer(true)
    addToContinueWatching({
      id: movie.id,
      mediaType: 'movie',
      title: movie.title,
      poster: movie.poster_path || '',
    })
    const url = new URL(window.location.href)
    url.searchParams.set('watch', 'true')
    window.history.pushState({}, '', url.toString())
    window.dispatchEvent(new Event('continueWatchingUpdate'))
  }
  
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const logo = movie.images?.logos?.find(l => l.file_path)
  const director = movie.credits?.crew?.find(c => c.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 10) || []
  
  if (showPlayer) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button
          className="absolute top-6 right-6 z-50 text-foreground hover:opacity-80 transition-opacity"
          onClick={() => {
            setShowPlayer(false)
            const url = new URL(window.location.href)
            url.searchParams.delete('watch')
            window.history.pushState({}, '', url.toString())
          }}
          aria-label="Close player"
        >
          <X className="h-12 w-12 font-bold" />
        </button>
        <iframe
          src={`https://vidzy.luna.tattoo/embed/movie/${movie.id}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>
    )
  }
  
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')
  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const logoUrl = logo ? getImageUrl(logo.file_path, 'w500') : null
  
  return (
    <>
      <div className="relative h-[70vh] w-full overflow-hidden bg-muted">
        {trailer ? (
          <div className="absolute inset-0">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}`}
              className="absolute inset-0 w-full h-full object-cover scale-150"
              allow="autoplay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          </div>
        ) : backdropUrl ? (
          <>
            <Image
              src={backdropUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          </>
        ) : null}
        
        {trailer && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-24 right-4 glass"
            onClick={() => setMuted(!muted)}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            {posterUrl ? (
              <Image
                src={posterUrl || "/placeholder.svg"}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg glass"
              />
            ) : (
              <div className="w-[300px] h-[450px] rounded-lg glass bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Poster</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-6">
            {logoUrl ? (
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt={movie.title}
                width={400}
                height={150}
                className="w-full max-w-md h-auto object-contain"
                style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))' }}
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {movie.release_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1.5">
                  <span>{movie.runtime}m</span>
                </div>
              )}
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${(movie.revenue / 1000000).toFixed(0)}M</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="glass px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            {movie.overview && (
              <p className="text-lg text-muted-foreground text-pretty">{movie.overview}</p>
            )}
            
            {director && (
              <div>
                <span className="text-muted-foreground">Director: </span>
                <span className="font-medium">{director.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Button size="lg" onClick={handlePlay} className="gap-2">
                <Play className="h-5 w-5 fill-current" />
                Play Movie
              </Button>
              <Button size="lg" variant="secondary" onClick={toggleWatchlist} className="gap-2">
                {inWatchlist ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>
            </div>
          </div>
        </div>
        
        {cast.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map(member => {
                const profileUrl = getImageUrl(member.profile_path, 'w185')
                return (
                  <div
                    key={member.id}
                    className="space-y-2"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                      {profileUrl ? (
                        <Image
                          src={profileUrl || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{member.character}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
