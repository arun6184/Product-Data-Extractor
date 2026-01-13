/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.worldofbooks.com', 'worldofbooks.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.worldofbooks.com',
            },
        ],
    },
}

module.exports = nextConfig
