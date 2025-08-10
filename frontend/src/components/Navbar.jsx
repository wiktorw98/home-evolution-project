// frontend/src/components/Navbar.jsx
'use client'; // Potrzebne do użycia haka usePathname

import React from 'react';
import Link from 'next/link';
// Importujemy hak do sprawdzania aktualnej ścieżki URL
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  // Pobieramy aktualną ścieżkę, np. "/oferta"
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Home Evolution
        </Link>
        
        {/* Przywracamy menu nawigacyjne */}
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <Link 
                href="/oferta" 
                className={pathname === '/oferta' ? styles.active : ''}
              >
                Oferta
              </Link>
            </li>
            <li>
              <Link 
                href="/realizacje" 
                className={pathname === '/realizacje' ? styles.active : ''}
              >
                Realizacje
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className={pathname === '/blog' ? styles.active : ''}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                href="/kontakt" 
                className={pathname === '/kontakt' ? styles.active : ''}
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}