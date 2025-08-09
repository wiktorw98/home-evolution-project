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
    ],
  },
};

// Zamiast module.exports, używamy poprawnej składni ES Modułów
export default nextConfig; 