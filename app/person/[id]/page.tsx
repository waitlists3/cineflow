import { getPersonDetails, getImageUrl } from '@/lib/tmdb'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { MediaCard } from '@/components/media-card'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const person = await getPersonDetails(parseInt(params.id))

  return {
    description: person.biography,
  }
}

export default async function PersonPage({ params }: { params: { id: string } }) {
  const person = await getPersonDetails(parseInt(params.id))
  
  const age = person.birthday 
    ? Math.floor((new Date().getTime() - new Date(person.birthday).getTime()) / 31557600000)
    : null
  
  const knownFor = person.combined_credits?.cast
    ?.sort((a, b) => b.vote_average - a.vote_average)
    ?.slice(0, 10) || []
  
  const filmography = person.combined_credits?.cast
    ?.sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01')
      const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01')
      return dateB.getTime() - dateA.getTime()
    }) || []
  
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <Image
              src={getImageUrl(person.profile_path, 'w500') || "/placeholder.svg"}
              alt={person.name}
              width={300}
              height={450}
              className="rounded-lg glass"
            />
          </div>
          
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">{person.name}</h1>
            
            <div className="space-y-2 text-sm">
              {person.known_for_department && (
                <p>
                  <span className="text-muted-foreground">Known For: </span>
                  <span className="font-medium">{person.known_for_department}</span>
                </p>
              )}
              
              {person.birthday && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(person.birthday).toLocaleDateString()}
                    {age && ` (${age} years old)`}
                  </span>
                </div>
              )}
              
              {person.place_of_birth && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{person.place_of_birth}</span>
                </div>
              )}
            </div>
            
            {person.biography && (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Biography</h2>
                <p className="text-muted-foreground whitespace-pre-line text-pretty">
                  {person.biography}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {knownFor.length > 0 && (
          <div className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold">Known For</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {knownFor.map(item => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
        
        {filmography.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Filmography</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filmography.map(item => {
                const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]
                return (
                  <Link
                    key={item.id}
                    href={`/${item.title ? 'movie' : 'tv'}/${item.id}`}
                    className="glass-hover rounded-lg p-4 flex gap-4"
                  >
                    <Image
                      src={getImageUrl(item.poster_path, 'w92') || "/placeholder.svg"}
                      alt={item.title || item.name || ''}
                      width={60}
                      height={90}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">
                        {item.title || item.name}
                      </h3>
                      {year && (
                        <p className="text-sm text-muted-foreground">{year}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
