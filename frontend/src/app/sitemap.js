// frontend/src/app/sitemap.js

// Pobieramy adres URL backendu ze zmiennych środowiskowych
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Definiujemy główny adres URL Twojej strony
const BASE_URL = 'https://home-evolution-project.vercel.app';

export default async function sitemap() {
  // 1. Definiujemy statyczne podstrony
  const staticRoutes = [
    '',
    '/o-nas',
    '/oferta',
    '/realizacje',
    '/blog',
    '/kontakt',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // 2. Pobieramy dynamicznie wszystkie posty
  const postsResponse = await fetch(`${BACKEND_URL}/api/posts?forSitemap=true`);
  const posts = await postsResponse.json();
  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post._id}`,
    lastModified: post.updatedAt || new Date().toISOString(),
  }));

  // 3. Pobieramy dynamicznie wszystkie realizacje
  const realizationsResponse = await fetch(`${BACKEND_URL}/api/realizations?forSitemap=true`);
  const realizations = await realizationsResponse.json();
  const realizationRoutes = realizations.map((realization) => ({
    url: `${BASE_URL}/realizacje/${realization._id}`,
    lastModified: realization.updatedAt || new Date().toISOString(),
  }));

  // 4. Łączymy wszystkie trasy w jedną mapę strony
  return [...staticRoutes, ...postRoutes, ...realizationRoutes];
}