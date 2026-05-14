import type { MetadataRoute } from 'next';

const BASE = 'https://bistrosaimaa.fi';

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const pages: Entry[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/menu', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/gallery', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.1 },
];

function fiUrl(path: string) {
  return `${BASE}${path === '/' ? '' : path}`;
}

function enUrl(path: string) {
  return `${BASE}/en${path === '/' ? '' : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return pages.flatMap(({ path, changeFrequency, priority }) => {
    const alternates = {
      languages: {
        fi: fiUrl(path),
        en: enUrl(path),
        'x-default': fiUrl(path),
      },
    };
    return [
      { url: fiUrl(path), lastModified: now, changeFrequency, priority, alternates },
      { url: enUrl(path), lastModified: now, changeFrequency, priority, alternates },
    ];
  });
}
