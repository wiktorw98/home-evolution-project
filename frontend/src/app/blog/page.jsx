// frontend/src/app/blog/page.jsx
import { Suspense } from 'react';
import BlogPageClient from './BlogPageClient'; // Importujemy nasz nowy komponent kliencki

// Metadane SEO dla strony
export const metadata = {
  title: 'Blog i Aktualności - Wiedza o OZE | Home Evolution',
  description: 'Czytaj najnowsze artykuły i porady z branży odnawialnych źródeł energii. Bądź na bieżąco z informacjami o fotowoltaice, dotacjach i nowoczesnych technologiach.',
};

// KLUCZOWA ZMIANA: Zmuszamy Next.js do dynamicznego renderowania tej strony
export const dynamic = 'force-dynamic';

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <BlogPageClient />
    </Suspense>
  );
}