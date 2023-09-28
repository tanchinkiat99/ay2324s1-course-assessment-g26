/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          // Allow user profile images from google to be used
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/a/**',
          },
        ],
      },
}

module.exports = nextConfig
