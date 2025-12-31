'use client'

import { useState, useEffect } from 'react'
import { getGenres, getByGenre, getTrending, getPopular, type Genre, type Movie } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Film, Tv, Filter, X, TrendingUp, Star, Calendar } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DiscoverPage() {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([])
  const [tvGenres, setTVGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [trending, setTrending] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [minRating, setMinRating] = useState([0])
  const [minYear, setMinYear] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  useEffect(() => {
    Promise.all([
      getGenres('movie'),
      getGenres('tv'),
      getTrending('all', 'week')
    ]).then(([movies, tv, trendingItems]) => {
      setMovieGenres(movies)
      setTVGenres(tv)
      setTrending(trendingItems)
    })
  }, [])
  
  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true)
      const params = new URLSearchParams({
        api_key: 'a222e5eda9654d1c6974da834e756c12',
        language: 'en-US',
        query: searchQuery
      })
      fetch('https://api.themoviedb.org/3/search/multi?' + params.toString())
        .then(res => res.json())
        .then(data => setResults(data.results?.filter(item => item.media_type === mediaType || (mediaType === 'movie' && item.title) || (mediaType === 'tv' && item.name)) || []))
        .finally(() => setLoading(false))
    } else if (selectedGenre) {
      setLoading(true)
      const params = new URLSearchParams({
        api_key: 'a222e5eda9654d1c6974da834e756c12',
        language: 'en-US',
        with_genres: selectedGenre.toString(),
        sort_by: sortBy,
        'vote_average.gte': minRating[0].toString(),
        ...(minYear && { 'primary_release_date.gte': `${minYear}-01-01` })
      })
      fetch('https://api.themoviedb.org/3/discover/' + mediaType + '?' + params.toString())
        .then(res => res.json())
        .then(data => setResults(data.results || []))
        .finally(() => setLoading(false))
    } else {
      setResults([])
    }
  }, [selectedGenre, mediaType, sortBy, minRating, minYear, searchQuery])
  
  const currentGenres = mediaType === 'movie' ? movieGenres : tvGenres
  
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Discover
          </h1>
          <p className="text-muted-foreground">
            Explore {mediaType === 'movie' ? 'movies' : 'TV shows'} by genre
          </p>
        </div>

        {trending.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Trending Now
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {trending.slice(0, 5).map(item => (
                <MediaCard key={item.id} item={{ ...item, media_type: 'movie' }} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant={mediaType === 'movie' ? 'default' : 'secondary'}
                onClick={() => {
                  setMediaType('movie')
                  setSelectedGenre(null)
                  setResults([])
                }}
                className="gap-2"
              >
                <Film className="h-4 w-4" />
                Movies
              </Button>
              <Button
                variant={mediaType === 'tv' ? 'default' : 'secondary'}
                onClick={() => {
                  setMediaType('tv')
                  setSelectedGenre(null)
                  setResults([])
                }}
                className="gap-2"
              >
                <Tv className="h-4 w-4" />
                TV Shows
              </Button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters && <X className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="glass rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Minimum Rating
                  </label>
                  <Slider
                    value={minRating}
                    onValueChange={setMinRating}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{minRating[0]}</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Release Year From
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 2020"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity.desc">Popularity</SelectItem>
                      <SelectItem value="vote_average.desc">Rating</SelectItem>
                      <SelectItem value="release_date.desc">Release Date</SelectItem>
                      <SelectItem value="title.asc">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Select a Genre</h2>
            <div className="flex flex-wrap gap-2">
              {currentGenres.map(genre => (
                <Button
                  key={genre.id}
                  variant={selectedGenre === genre.id ? 'default' : 'outline'}
                  onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
                  className={cn(
                    "transition-all",
                    selectedGenre === genre.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  size="sm"
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground">Loading {mediaType === 'movie' ? 'movies' : 'TV shows'}...</p>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {results.length} {mediaType === 'movie' ? 'movie' : 'TV show'}{results.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map(item => (
                  <MediaCard key={item.id} item={{ ...item, media_type: mediaType }} />
                ))}
              </div>
            </div>
          )}

          {!loading && !selectedGenre && (
            <div className="text-center py-20 glass rounded-lg">
              <p className="text-muted-foreground text-lg">
                Select a genre above to discover {mediaType === 'movie' ? 'movies' : 'TV shows'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
