// frontend/src/app/realizacje/page.jsx
import { Suspense } from 'react'; // ZMIANA: Importujemy Suspense
import RealizacjePageClient from './RealizacjePageClient';

export const metadata = {
  title: 'Realizacje - Zobacz Nasze Projekty | Home Evolution',
  description: 'Przeglądaj galerię naszych ukończonych realizacji. Zobacz efekty naszej pracy w zakresie fotowoltaiki, termomodernizacji i nie tylko. Jesteśmy dumni z naszej pracy.',
};

export default function RealizacjePage() {
  return (
    // ZMIANA: Opakowujemy nasz komponent kliencki w <Suspense>
    // fallback to prosty element, który wyświetli się na chwilę,
    // zanim główny komponent będzie gotowy.
    <Suspense fallback={<div>Ładowanie...</div>}>
      <RealizacjePageClient />
    </Suspense>
  );
}