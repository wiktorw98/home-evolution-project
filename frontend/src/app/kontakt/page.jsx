// frontend/src/app/kontakt/page.jsx
import { Suspense } from 'react'; // ZMIANA: Importujemy Suspense
import KontaktPageClient from './KontaktPageClient';

export const metadata = {
  title: 'Kontakt - Skontaktuj się z Nami | Home Evolution',
  description: 'Masz pytania? Chcesz otrzymać darmową wycenę? Skontaktuj się z nami przez formularz, e-mail lub telefon. Jesteśmy do Twojej dyspozycji.',
};

// Używamy Suspense, ponieważ nasz komponent kliencki używa hooka useSearchParams
export default function KontaktPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <KontaktPageClient />
    </Suspense>
  );
}