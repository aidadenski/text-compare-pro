import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://textcompare.pro/sitemap.xml',
    host: 'https://textcompare.pro',
  };
}
