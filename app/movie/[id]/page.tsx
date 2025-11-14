import { getMovieDetails, getRecommendations, getImageUrl } from '@/lib/tmdb'
import { MovieDetailContent } from './movie-detail-content'
import { MediaRow } from '@/components/media-row'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const movie = await getMovieDetails(parseInt(params.id))
  
  return {
    title: `${movie.title} - CineFlow`,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [getImageUrl(movie.backdrop_path, 'original')],
    },
  }
}

export default async function MoviePage({ params, searchParams }: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ watch?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const movie = await getMovieDetails(parseInt(resolvedParams.id))
  const recommendations = await getRecommendations(movie.id, 'movie')
  
  return (
    <main className="min-h-screen pt-16">
      <MovieDetailContent movie={movie} isWatchMode={resolvedSearchParams.watch === 'true'} />
      
      {recommendations.length > 0 && (
        <div className="py-12">
          <MediaRow title="You May Also Like" items={recommendations} />
        </div>
      )}
    </main>
  )
}
