import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bistrosaimaa.fi',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://bistrosaimaa.fi/menu',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://bistrosaimaa.fi/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://bistrosaimaa.fi/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];
}
