import { getTVDetails, getRecommendations, getImageUrl } from '@/lib/tmdb'
import { TVDetailContent } from './tv-detail-content'
import { MediaRow } from '@/components/media-row'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const show = await getTVDetails(parseInt(id))

  return {
    description: show.overview,
    openGraph: {
      title: show.name || '',
      description: show.overview,
      images: [getImageUrl(show.backdrop_path, 'original')],
    },
  }
}

export default async function TVPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ watch?: string }>
}) {
  const { id } = await params
  const { watch } = await searchParams
  
  const show = await getTVDetails(parseInt(id))
  const recommendations = await getRecommendations(show.id, 'tv')
  
  return (
    <main className="min-h-screen pt-16">
      <TVDetailContent 
        show={show} 
        isWatchMode={watch === 'true'}
      />
      
      {recommendations.length > 0 && (
        <div className="py-12">
          <MediaRow title="You May Also Like" items={recommendations} />
        </div>
      )}
    </main>
  )
}
