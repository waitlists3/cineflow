'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Bookmark, BookmarkCheck, Star, Calendar, Volume2, VolumeX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl, getSeasonDetails, type MovieDetails, type Episode } from '@/lib/tmdb'
import { addToWatchlist, removeFromWatchlist, isInWatchlist, addToContinueWatching } from '@/lib/watchlist'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TVDetailContent({ show, initialSeason, initialEpisode, isWatchMode }: { 
  show: MovieDetails
  initialSeason?: number
  initialEpisode?: number
  isWatchMode?: boolean
}) {
  const [inWatchlist, setInWatchlist] = useState(false)
  const [muted, setMuted] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState(initialSeason || 1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(isWatchMode || false)
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode || 1)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    setInWatchlist(isInWatchlist(show.id, 'tv'))
  }, [show.id])
  
  useEffect(() => {
    const loadEpisodes = async () => {
      setLoading(true)
      try {
        const seasonData = await getSeasonDetails(show.id, selectedSeason)
        setEpisodes(seasonData.episodes || [])
      } catch (error) {
        console.error('Failed to load episodes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEpisodes()
  }, [show.id, selectedSeason])
  
  useEffect(() => {
    if (!showPlayer) return
    
    const checkEpisodeChange = setInterval(() => {
      if (iframeRef.current) {
        try {
          const iframeSrc = iframeRef.current.src
          const match = iframeSrc.match(/\/tv\/(\d+)\/(\d+)\/(\d+)/)
          
          if (match) {
            const [, , newSeason, newEpisode] = match
            const newSeasonNum = parseInt(newSeason)
            const newEpisodeNum = parseInt(newEpisode)
            
            if (newSeasonNum !== selectedSeason || newEpisodeNum !== currentEpisode) {
              setSelectedSeason(newSeasonNum)
              setCurrentEpisode(newEpisodeNum)
              window.history.pushState({}, '', `/tv/${show.id}/${newSeasonNum}/${newEpisodeNum}?watch=true`)
              
              addToContinueWatching({
                id: show.id,
                mediaType: 'tv',
                title: show.name || '',
                poster: show.poster_path || '',
                season: newSeasonNum,
                episode: newEpisodeNum,
              })
              window.dispatchEvent(new Event('continueWatchingUpdate'))
            }
          }
        } catch (e) {
          // Silently handle cross-origin errors
        }
      }
    }, 2000)
    
    return () => clearInterval(checkEpisodeChange)
  }, [show.id, show.name, show.poster_path, selectedSeason, currentEpisode, showPlayer])
  
  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(show.id, 'tv')
      setInWatchlist(false)
    } else {
      addToWatchlist({
        id: show.id,
        mediaType: 'tv',
        title: show.name || '',
        poster: show.poster_path || '',
      })
      setInWatchlist(true)
    }
  }
  
  const handlePlayEpisode = (episodeNumber: number) => {
    setCurrentEpisode(episodeNumber)
    setShowPlayer(true)
    window.history.pushState({}, '', `/tv/${show.id}/${selectedSeason}/${episodeNumber}?watch=true`)
    
    addToContinueWatching({
      id: show.id,
      mediaType: 'tv',
      title: show.name || '',
      poster: show.poster_path || '',
      season: selectedSeason,
      episode: episodeNumber,
    })
    window.dispatchEvent(new Event('continueWatchingUpdate'))
  }
  
  if (showPlayer) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button
          className="absolute top-6 right-6 z-50 text-foreground hover:opacity-80 transition-opacity"
          onClick={() => {
            setShowPlayer(false)
            window.history.pushState({}, '', `/tv/${show.id}/${selectedSeason}/${currentEpisode}`)
          }}
          aria-label="Close player"
        >
          <X className="h-12 w-12 font-bold" />
        </button>
        <iframe
          ref={iframeRef}
          src={`https://vidzy.luna.tattoo/embed/tv/${show.id}/${selectedSeason}/${currentEpisode}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>
    )
  }
  
  const trailer = show.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const logo = show.images?.logos?.find(l => l.file_path)
  const cast = show.credits?.cast?.slice(0, 10) || []
  
  return (
    <>
      <div className="relative h-[70vh] w-full overflow-hidden">
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
        ) : (
          <>
            <Image
              src={getImageUrl(show.backdrop_path, 'original') || "/placeholder.svg"}
              alt={show.name || ''}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          </>
        )}
        
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
      
      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image
              src={getImageUrl(show.poster_path, 'w500') || "/placeholder.svg"}
              alt={show.name || ''}
              width={300}
              height={450}
              className="rounded-lg glass"
            />
          </div>
          
          <div className="flex-1 space-y-6">
            {logo ? (
              <Image
                src={getImageUrl(logo.file_path, 'w500') || "/placeholder.svg"}
                alt={show.name || ''}
                width={400}
                height={150}
                className="w-full max-w-md h-auto object-contain"
                style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))' }}
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold">{show.name}</h1>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {show.first_air_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(show.first_air_date).getFullYear()}</span>
                </div>
              )}
              {show.number_of_seasons && (
                <div className="flex items-center gap-1.5">
                  <span>{show.number_of_seasons} Seasons</span>
                </div>
              )}
              {show.vote_average > 0 && (
                <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{show.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {show.genres?.map(genre => (
                <span key={genre.id} className="glass px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <p className="text-lg text-muted-foreground text-pretty">{show.overview}</p>
            
            <div className="flex items-center gap-3">
              <Button size="lg" variant="secondary" onClick={toggleWatchlist} className="gap-2">
                {inWatchlist ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>
            </div>
          </div>
        </div>
        
        {show.seasons && show.seasons.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <Select value={selectedSeason.toString()} onValueChange={(val) => setSelectedSeason(parseInt(val))}>
                <SelectTrigger className="w-[200px] glass">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {show.seasons.filter(s => s.season_number > 0).map(season => (
                    <SelectItem key={season.id} value={season.season_number.toString()}>
                      Season {season.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading episodes...</div>
            ) : (
              <div className="space-y-4">
                {episodes.map(episode => (
                  <div 
                    key={episode.id} 
                    className="glass rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all group cursor-pointer"
                    onClick={() => handlePlayEpisode(episode.episode_number)}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative sm:w-64 aspect-video flex-shrink-0">
                        <Image
                          src={getImageUrl(episode.still_path, 'w300') || "/placeholder.svg"}
                          alt={episode.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-8 w-8 fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-4 sm:py-4 sm:pr-4 sm:pl-0 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          {episode.runtime && (
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {episode.runtime}m
                            </span>
                          )}
                        </div>
                        
                        {episode.air_date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(episode.air_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {episode.overview || 'No description available.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {cast.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map(member => (
                <div
                  key={member.id}
                  className="space-y-2"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(member.profile_path, 'w185') || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
