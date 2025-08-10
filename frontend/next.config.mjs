// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'home-evolution-backend.onrender.com',
        port: '', // Domyślny port dla https (443), więc zostawiamy puste
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;