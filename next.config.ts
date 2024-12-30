import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.airbusdefenceandspacenetherlands.nl',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
            },
        ],
    },
    // https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
    output: 'standalone',
};

export default nextConfig;
