// frontend/src/app/realizacje/page.jsx
import { Suspense } from 'react';
import RealizacjePageClient from './RealizacjePageClient';

export const metadata = {
  title: 'Realizacje - Zobacz Nasze Projekty | Home Evolution',
  description: 'Przeglądaj galerię naszych ukończonych realizacji. Zobacz efekty naszej pracy w zakresie fotowoltaiki, termomodernizacji i nie tylko. Jesteśmy dumni z naszej pracy.',
};

// === KLUCZOWA ZMIANA: Zmuszamy Next.js do dynamicznego renderowania tej strony ===
// To mówi serwerowi, aby nie zapisywał wyników w pamięci podręcznej
// i zawsze pobierał najświeższe dane przy każdej wizycie.
export const dynamic = 'force-dynamic';

export default function RealizacjePage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <RealizacjePageClient />
    </Suspense>
  );
}