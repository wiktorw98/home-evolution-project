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

  useEffect(() => {
    if (isMenuOpen) setMenuOpen(false);
  }, [pathname]);

  const getLinkClassName = (path) => (pathname === path ? styles.active : '');

  // ZMIANA: Dodajemy link "O nas"
  const navLinks = [
    { href: '/oferta', label: 'Oferta' },
    { href: '/realizacje', label: 'Realizacje' },
    { href: '/blog', label: 'Blog' },
    { href: '/o-nas', label: 'O nas' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}><Image src="/logo.png" alt="Home Evolution Logo" width={100} height={60} priority /></Link>
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>{navLinks.map(link => (<li key={link.href}><Link href={link.href} className={getLinkClassName(link.href)}>{link.label}</Link></li>))}</ul>
        </nav>
        <div className={styles.mobileMenuIcon}><button onClick={() => setMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}>{isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}</button></div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div className={styles.backdrop} onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className={styles.mobileMenuPanel} initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}>
              <nav><ul className={styles.mobileNavLinks}>{navLinks.map(link => (<li key={link.href}><Link href={link.href} className={getLinkClassName(link.href)}>{link.label}</Link></li>))}</ul></nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}