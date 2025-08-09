'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css'; // Importujemy style!
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { title: 'Strona Główna', path: '/' },
    { title: 'Oferta', path: '/oferta' },
    { title: 'Realizacje', path: '/realizacje' },
    { title: 'Blog', path: '/blog' },
    { title: 'Kontakt', path: '/kontakt' },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>Home Evolution</Link>
        <nav className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          {navLinks.map((link) => (
            <Link key={link.title} href={link.path}>{link.title}</Link>
          ))}
        </nav>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>
    </header>
  );
}