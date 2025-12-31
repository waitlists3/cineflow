'use client'

import { useState, useEffect } from 'react'
import { getGenres, getByGenre, getTrending, getPopular, type Genre, type Movie } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Film, Tv, Filter, X } from 'lucide-react'

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
  
  return <div>Discover</div>
}
