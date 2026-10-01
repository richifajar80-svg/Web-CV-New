import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'cvbagus.id - Buat CV ATS Friendly & Profesional',
    short_name: 'cvbagus.id',
    description: 'Platform pembuat CV online standar ATS modern di cvbagus.id dengan 10+ pilihan templat profesional, skor ATS otomatis, dan unduh PDF instan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
