// frontend/src/app/layout.js
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FloatingCTA from '../components/FloatingCTA.jsx'; // ZMIANA: Importujemy nowy komponent
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: "Home Evolution - Nowoczesne Rozwiązania dla Domu",
  description: "Fotowoltaika, termomodernizacje, wymiana kotłów. Kompleksowe usługi OZE dla Twojego domu w Kielcach i okolicach.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={inter.className}>
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <Footer />
        </div>
        {/* ZMIANA: Dodajemy nasz pływający przycisk na końcu */}
        <FloatingCTA />
      </body>
    </html>
  );
}