import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/header'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Cineflow',
  description: 'Watch the latest movies and TV series in stunning 4K quality. Discover new releases, trending content, and timeless classics on CineFlow - your ultimate streaming destination.',
  keywords: [
    'stream movies',
    'watch tv shows',
    '4k movies',
    'new tv series',
    'streaming service',
    'watch movies online',
    'tv shows online',
    'latest movies',
    'movie streaming',
    'series streaming',
    'cineby.app',
    'xprime.tv',
    'free movies',
    'hd streaming',
    '4k streaming',
    'watch series',
    'movie database',
    'trending movies',
    'popular tv shows',
    'cinema online',
    'streaming platform',
    'watch online',
    'movies and series',
    'cineflow streaming',
    'lunastream',
    'free movies online',
  ],
  authors: [{ name: 'CineFlow' }],
  openGraph: {
    title: 'CineFlow - Stream Movies & TV Shows',
    description: 'Watch the latest movies and TV series',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineFlow - Stream Movies & TV Shows in 4K',
    description: 'Watch the latest movies and TV series',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CineFlow',
  },
  generator: 'cat',
  icons: {
    icon: '/favicon.png',
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <Script strategy="afterInteractive">{`(function(s){s.dataset.zone='10187427',s.src='https://bvtpk.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}</Script>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
