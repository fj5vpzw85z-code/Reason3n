import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/login', '/signup'],
        disallow: ['/dashboard', '/dashboard/'],
      },
    ],
    sitemap: 'https://reason3n.vercel.app/sitemap.xml',
  };
}
