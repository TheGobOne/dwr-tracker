import type { Metadata, Viewport } from 'next'
import { Pixelify_Sans, Press_Start_2P } from 'next/font/google'
import './globals.css'
import { withBase } from '@/lib/base-path'

const pixelify = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixelify' })
const pressStart = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start' })

export const metadata: Metadata = {
  title: 'DWR Tracker',
  description: 'DWR Tracker',
  generator: 'v0.app',
  icons: {
    icon: [{ url: withBase('/dragonlord-icon.png'), type: 'image/png' }],
    apple: withBase('/icon-192.png'),
  },
  appleWebApp: { capable: true, title: 'DWR Tracker', statusBarStyle: 'black-translucent' },
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
      </body>
    </html>
  )
}
