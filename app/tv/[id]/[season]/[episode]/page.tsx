import { getTVDetails } from '@/lib/tmdb'
import { TVDetailContent } from '../../tv-detail-content'
import { MediaRow } from '@/components/media-row'
import { getRecommendations, getImageUrl } from '@/lib/tmdb'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const show = await getTVDetails(parseInt(params.id))

  return {
    description: show.overview,
    openGraph: {
      title: show.name || '',
      description: show.overview,
      images: [getImageUrl(show.backdrop_path, 'original')],
    },
  }
}

export default async function EpisodePage({ 
  params,
  searchParams 
}: { 
  params: { id: string; season: string; episode: string }
  searchParams: { watch?: string }
}) {
  const show = await getTVDetails(parseInt(params.id))
  const recommendations = await getRecommendations(show.id, 'tv')
  const seasonNumber = parseInt(params.season)
  const episodeNumber = parseInt(params.episode)
  
  return (
    <main className="min-h-screen pt-16">
      <TVDetailContent 
        show={show}
        initialSeason={seasonNumber}
        initialEpisode={episodeNumber}
        isWatchMode={searchParams.watch === 'true'}
      />
      
      {recommendations.length > 0 && (
        <div className="py-12">
          <MediaRow title="You May Also Like" items={recommendations} />
        </div>
      )}
    </main>
  )
}
