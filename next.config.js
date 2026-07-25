/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Disable linting during build to debug
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Standalone build - only for Docker, not Vercel
    // output: 'standalone',

    // Image optimization domains
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.businessbook.cm',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.up.railway.app',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'businessbookr-production.up.railway.app',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
        // Optimize for mobile-first
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },

    // Headers for security
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ];
    },

    // Experimental features
    experimental: {
        // Enable optimized package imports
        optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
    },

    // Proxy API requests to backend
    async rewrites() {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/api/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${backendUrl}/uploads/:path*`,
            },
        ];
    },
};

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
});

// i18n (fr/en) — locale résolue par cookie, pas de préfixe d'URL
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

module.exports = withNextIntl(withPWA(nextConfig));
