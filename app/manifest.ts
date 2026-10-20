import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Skelvre Platform',
    short_name: 'Skelvre',
    description: 'Non-custodial, offline-first multi-chain subscription and agentic payment platform.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#161412',
    theme_color: '#161412',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
