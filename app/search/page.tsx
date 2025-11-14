'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { searchMulti, type Movie } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'movie' | 'tv' | 'person'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [filteredResults, setFilteredResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const debouncedQuery = useDebounce(query, 500)
  
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      setLoading(true)
      searchMulti(debouncedQuery)
        .then(setResults)
        .finally(() => setLoading(false))
    } else {
      setResults([])
    }
  }, [debouncedQuery])
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredResults(results.filter(item => item.media_type !== 'person'))
    } else {
      setFilteredResults(results.filter(item => {
        if (filter === 'movie') return item.media_type === 'movie' || (item.title && !item.media_type)
        if (filter === 'tv') return item.media_type === 'tv' || (item.name && !item.title && !item.media_type)
        return true
      }))
    }
  }, [results, filter])
  
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for movies, TV shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-lg glass"
              autoFocus
            />
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant={filter === 'all' ? 'default' : 'secondary'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'movie' ? 'default' : 'secondary'}
              onClick={() => setFilter('movie')}
              size="sm"
            >
              Movies
            </Button>
            <Button
              variant={filter === 'tv' ? 'default' : 'secondary'}
              onClick={() => setFilter('tv')}
              size="sm"
            >
              TV Shows
            </Button>
          </div>
        </div>
        
        {loading && (
          <p className="text-center text-muted-foreground">Searching...</p>
        )}
        
        {!loading && filteredResults.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredResults.map(item => (
                <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
              ))}
            </div>
          </div>
        )}
        
        {!loading && query && filteredResults.length === 0 && results.length > 0 && (
          <p className="text-center text-muted-foreground">
            No {filter === 'all' ? '' : filter === 'person' ? 'people' : filter}s found for "{query}"
          </p>
        )}
        
        {!loading && query && results.length === 0 && (
          <p className="text-center text-muted-foreground">No results found for "{query}"</p>
        )}
      </div>
    </main>
  )
}
