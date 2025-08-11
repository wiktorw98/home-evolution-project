// frontend/src/app/realizacje/[realizationId]/page.jsx
import { Suspense } from 'react';
import RealizationDetailClient from './RealizationDetailClient';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Dynamiczne generowanie metadanych SEO dla każdej realizacji
export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/realizations/${params.realizationId}`);
    const realization = await response.json();
    if (!realization) return { title: 'Realizacja - Home Evolution' };
    return {
      title: `${realization.title} - Nasze Realizacje | Home Evolution`,
      description: realization.description.substring(0, 160) + '...',
    };
  } catch (error) {
    return { title: 'Realizacja - Home Evolution' };
  }
}

export default function RealizationDetailPage() {
  return (
    <Suspense fallback={<div>Ładowanie realizacji...</div>}>
      <RealizationDetailClient />
    </Suspense>
  );
}