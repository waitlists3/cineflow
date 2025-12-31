import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://cineflow.watch'),
  title: 'CineFlow – Stream Movies & TV Shows in 4K',
  description:
    'Stream the latest movies and TV series in stunning 4K. CineFlow offers trending films, new episodes, and classic titles—all free, fast, and easy to watch.',
  keywords: [
    'stream movies online',
    'watch tv shows online',
    '4k streaming',
    'free movies',
    'free tv series',
    'latest movies 2025',
    'HD movies online',
    'best streaming sites',
    'trending movies',
    'popular tv shows'
  ],
  authors: [{ name: 'CineFlow' }],
  creator: 'CineFlow',
  publisher: 'CineFlow',

  alternates: {
    canonical: 'https://cineflow.watch',
  },

  openGraph: {
    title: 'CineFlow – Watch Movies & TV Shows in 4K',
    description:
      'Watch the latest movies and TV shows online. Stream in crystal-clear HD & 4K on CineFlow.',
    url: 'https://cineflow.watch',
    siteName: 'CineFlow',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CineFlow Streaming Preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CineFlow – Stream Movies & Series in 4K',
    description:
      'Watch newly released movies and trending TV shows in HD & 4K on CineFlow.',
    images: ['/og-image.png'],
    creator: '@cineflow',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: 'large',
      maxVideoPreview: -1,
    },
  },

  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CineFlow',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
 
 
        <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='10397468',s.src='https://bvtpk.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />

        <Header />
        {children}
        <Analytics />

      </body>
    </html>
  )
}
