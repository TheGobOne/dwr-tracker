import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Pixelify_Sans, Press_Start_2P } from 'next/font/google'
import './globals.css'

const pixelify = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixelify' })
const pressStart = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start' })

export const metadata: Metadata = {
  title: 'DWR Tracker',
  description: 'DWR Tracker',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/dragonlord-icon.png', type: 'image/png' }],
    apple: '/dragonlord-icon.png',
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
