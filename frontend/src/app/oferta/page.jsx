// frontend/src/app/oferta/page.jsx
import OfertaPageClient from './OfertaPageClient';

// Eksportujemy metadane SEO
export const metadata = {
  title: 'Nasza Oferta - Fotowoltaika, Ocieplenie, Pompy Ciepła | Home Evolution',
  description: 'Poznaj szczegóły naszych kompleksowych usług w zakresie odnawialnych źródeł energii. Oferujemy panele fotowoltaiczne, termomodernizacje i wymianę źródeł ciepła.',
};

// Główny komponent strony renderuje teraz tylko komponent kliencki
export default function OfertaPage() {
  return <OfertaPageClient />;
}