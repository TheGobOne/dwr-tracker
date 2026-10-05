import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DWR Tracker',
    short_name: 'DWR Tracker',
    description: 'DWR Tracker',
    start_url: '/',
    display: 'standalone',
    background_color: '#08080f',
    theme_color: '#08080f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
