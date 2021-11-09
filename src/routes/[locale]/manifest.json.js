const DICTIONARY = {
  ja: {
    name: '商店ガイド',
    short_name: '商店ガイド',
  },
  en: {
    name: 'Shoten Guide',
    short_name: 'Shoten Guide',
  },
  ko: {
    name: '상가 가이드',
    short_name: '상가 가이드',
  },
}

export function get(req, res, next) {
  const { locale } = req.params
  const translations = DICTIONARY[locale] || {}
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(
    JSON.stringify({
      background_color: '#0d0d0d',
      theme_color: '#0099ff',
      name: translations.name,
      short_name: translations.short_name,
      display: 'standalone',
      start_url: `/${locale}/`,
      icons: [
        {
          src: '/media/logo-180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: '/media/logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/media/logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    })
  )
}
