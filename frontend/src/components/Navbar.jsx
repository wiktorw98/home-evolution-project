// frontend/src/components/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Efekt, który zamyka menu, gdy zmienia się ścieżka (użytkownik klika link)
  useEffect(() => {
    if (isMenuOpen) {
      setMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getLinkClassName = (path) => (pathname === path ? styles.active : '');

  const navLinks = [
    { href: '/oferta', label: 'Oferta' },
    { href: '/realizacje', label: 'Realizacje' },
    { href: '/blog', label: 'Blog' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.png"
            alt="Home Evolution Logo"
            width={100}
            height={60}
            priority
          />
        </Link>
        
        {/* Nawigacja na dużych ekranach */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={getLinkClassName(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Ikona "burgera" na małych ekranach */}
        <div className={styles.mobileMenuIcon}>
          <button onClick={() => setMenuOpen(true)} aria-label="Otwórz menu">
            <FiMenu size={28} />
          </button>
        </div>
      </div>

      {/* Panel menu mobilnego, który pojawia się i znika */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Półprzezroczyste tło za menu */}
            <motion.div
              className={styles.backdrop}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className={styles.mobileMenuPanel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            >
              <div className={styles.mobileMenuHeader}>
                <button onClick={() => setMenuOpen(false)} aria-label="Zamknij menu">
                  <FiX size={32} />
                </button>
              </div>
              <nav>
                <ul className={styles.mobileNavLinks}>
                  {navLinks.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className={getLinkClassName(link.href)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}