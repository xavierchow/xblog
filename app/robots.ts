import type { MetadataRoute } from 'next';

const host = process.env.APP_HOST || 'https://xavierz.dev';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${host}/sitemap.xml`,
  };
}
