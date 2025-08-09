import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800']
});

export const metadata = {
  title: "Home Evolution - Odnawialne Źródła Energii",
  description: "Nowoczesne rozwiązania dla Twojego domu: fotowoltaika, ocieplenia, wymiana kotłów.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={poppins.className}>
      {/* Aplikujemy globalne style bezpośrednio tutaj */}
      <body className="flex flex-col min-h-screen bg-background text-text-main">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}