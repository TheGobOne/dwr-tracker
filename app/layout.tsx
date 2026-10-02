import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Pixelify_Sans, Press_Start_2P } from 'next/font/google'
import './globals.css'

const pixelify = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixelify' })
const pressStart = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start' })

export const metadata: Metadata = {
  title: 'DWR Overworld Tracker — Dragon Warrior Randomizer',
  description:
    'Map out the randomized Dragon Warrior (NES, 1986) overworld: paint terrain, pin towns, caves and shrines, and track key items and spells for your seed.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#08080f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pixelify.variable} ${pressStart.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
