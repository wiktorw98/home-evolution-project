// frontend/src/components/Navbar.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image'; // ZMIANA: Importujemy komponent Image
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const getLinkClassName = (path) => (pathname === path ? styles.active : '');

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* ZMIANA: Zamiast tekstu, wstawiamy logo */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.png" // Upewnij się, że nazwa pliku się zgadza
            alt="Home Evolution Logo"
            width={100} // Ustaw szerokość swojego logo
            height={60} // Ustaw wysokość swojego logo
            priority // Daje znać Next.js, aby załadować logo w pierwszej kolejności
          />
        </Link>
        
        <nav>
          <ul className={styles.navLinks}>
            <li><Link href="/oferta" className={getLinkClassName('/oferta')}>Oferta</Link></li>
            <li><Link href="/realizacje" className={getLinkClassName('/realizacje')}>Realizacje</Link></li>
            <li><Link href="/blog" className={getLinkClassName('/blog')}>Blog</Link></li>
            <li><Link href="/kontakt" className={getLinkClassName('/kontakt')}>Kontakt</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}