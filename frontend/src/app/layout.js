import Navbar from '@/components/Navbar'; // Używamy aliasu, który działał
import Footer from '@/components/Footer'; // Używamy tego samego, spójnego aliasu
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800']
});

export const metadata = {
  title: "Home Evolution",
  description: "Nowoczesne rozwiązania dla Twojego domu.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={poppins.className}>
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