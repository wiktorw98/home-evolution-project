/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // NOWY WPIS: Pozwalamy na ładowanie obrazów z naszej biblioteki Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Pozwalamy na dowolną ścieżkę w tej domenie
      },
      // Stare wpisy pozostają, aby umożliwić działanie starych linków (jeśli będzie potrzeba)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'home-evolution-backend.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;