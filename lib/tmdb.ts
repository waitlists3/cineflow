const TMDB_API_KEY = 'a222e5eda9654d1c6974da834e756c12'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface Movie {
  id: number
  title: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  media_type?: 'movie' | 'tv'
}

export interface MovieDetails extends Movie {
  runtime?: number
  genres: { id: number; name: string }[]
  credits?: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos?: {
    results: Video[]
  }
  revenue?: number
  budget?: number
  number_of_seasons?: number
  number_of_episodes?: number
  seasons?: Season[]
  images?: {
    logos: Logo[]
  }
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface Season {
  id: number
  season_number: number
  name: string
  episode_count: number
  air_date: string
  poster_path: string | null
  overview: string
}

export interface Episode {
  id: number
  episode_number: number
  name: string
  overview: string
  air_date: string
  still_path: string | null
  vote_average: number
  runtime: number
}

export interface PersonDetails {
  id: number
  name: string
  biography: string
  birthday: string
  place_of_birth: string
  profile_path: string | null
  known_for_department: string
  combined_credits?: {
    cast: Movie[]
  }
}

export interface Logo {
  file_path: string
  aspect_ratio: number
  width: number
  height: number
}

export interface Genre {
  id: number
  name: string
}

export const getImageUrl = (path: string | null, size: string = 'original') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`)
  const data = await res.json()
  return data.results || []
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images`)
  return res.json()
}

export const getTVDetails = async (id: number): Promise<MovieDetails> => {
  const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images`)
  return res.json()
}

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> => {
  const res = await fetch(`${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`)
  return res.json()
}

export const getPersonDetails = async (id: number): Promise<PersonDetails> => {
  const res = await fetch(`${TMDB_BASE_URL}/person/${id}?api_key=${TMDB_API_KEY}&append_to_response=combined_credits`)
  return res.json()
}

export const searchMulti = async (query: string): Promise<Movie[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
  const data = await res.json()
  return data.results || []
}

export const getPopular = async (mediaType: 'movie' | 'tv'): Promise<Movie[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}`)
  const data = await res.json()
  return data.results || []
}

export const getByGenre = async (genreId: number, mediaType: 'movie' | 'tv'): Promise<Movie[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_genres=${genreId}`)
  const data = await res.json()
  return data.results || []
}

export const getGenres = async (mediaType: 'movie' | 'tv'): Promise<Genre[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${TMDB_API_KEY}`)
  const data = await res.json()
  return data.genres || []
}

export const getRecommendations = async (id: number, mediaType: 'movie' | 'tv'): Promise<Movie[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/recommendations?api_key=${TMDB_API_KEY}`)
  const data = await res.json()
  return data.results || []
}

export const getSimilar = async (id: number, mediaType: 'movie' | 'tv'): Promise<Movie[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/similar?api_key=${TMDB_API_KEY}`)
  const data = await res.json()
  return data.results || []
}
