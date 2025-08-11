// frontend/src/app/blog/page.jsx
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog i Aktualności - Wiedza o OZE | Home Evolution',
  description: 'Czytaj najnowsze artykuły i porady z branży odnawialnych źródeł energii. Bądź na bieżąco z informacjami o fotowoltaice, dotacjach i nowoczesnych technologiach.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}