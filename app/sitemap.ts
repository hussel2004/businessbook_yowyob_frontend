import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://businessbook.cm';

    const routes = [
        '',
        '/search',
        '/login',
        '/register',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/promotions',
        '/categories',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
