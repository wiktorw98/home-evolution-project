import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Inter } from 'next/font/google'; // 1. Importujemy nową czcionkę Inter
import './globals.css';

// 2. Konfigurujemy czcionkę Inter
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // '400' to normal, '700' to bold
  display: 'swap', // Zapewnia, że tekst jest widoczny, zanim czcionka się załaduje
});

export const metadata = {
  title: "Home Evolution - Nowoczesne Rozwiązania dla Domu",
  description: "Fotowoltaika, termomodernizacje, wymiana kotłów. Kompleksowe usługi OZE dla Twojego domu w Kielcach i okolicach.",
};

export default function RootLayout({ children }) {
  return (
    // 3. Aplikujemy nową czcionkę do całej strony
    <html lang="pl" className={inter.className}>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}