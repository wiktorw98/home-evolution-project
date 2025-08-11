// frontend/src/app/page.js

// KROK 1: Importujemy nasz nowy komponent kliencki
import HomePageClient from './HomePageClient';

// KROK 2: Eksportujemy metadane SEO. Ten plik nie ma już 'use client'.
export const metadata = {
  title: 'Home Evolution - Nowoczesne Rozwiązania OZE | Fotowoltaika, Termomodernizacje',
  description: 'Specjalizujemy się w fotowoltaice, termomodernizacjach i wymianie źródeł ciepła. Zaufaj ekspertom i zainwestuj w przyszłość swojego domu z Home Evolution.',
};

// KROK 3: Główny komponent strony teraz tylko renderuje komponent kliencki
export default function HomePage() {
  return <HomePageClient />;
}