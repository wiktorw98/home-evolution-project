// frontend/src/app/realizacje/page.jsx
import RealizacjePageClient from './RealizacjePageClient';

export const metadata = {
  title: 'Realizacje - Zobacz Nasze Projekty | Home Evolution',
  description: 'Przeglądaj galerię naszych ukończonych realizacji. Zobacz efekty naszej pracy w zakresie fotowoltaiki, termomodernizacji i nie tylko. Jesteśmy dumni z naszej pracy.',
};

export default function RealizacjePage() {
  return <RealizacjePageClient />;
}