import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { FaFacebookF, FaInstagram } from 'react-icons/fa'; // Usunięto FaLinkedinIn

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Kolumny 1, 2 i 3 bez zmian */}
          <div className={styles.footerColumn}>
            <h3 className={styles.logo}>Home Evolution</h3>
            <p className={styles.tagline}>
              Zmieniamy domy, dbając o przyszłość i środowisko.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h4>Nawigacja</h4>
            <ul>
              <li><Link href="/oferta">Oferta</Link></li>
              <li><Link href="/realizacje">Realizacje</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/kontakt">Kontakt</Link></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4>Kontakt</h4>
            <address className={styles.address}>
              <span>ul. Barwinek 3/45, 25-150 Kielce</span>
              <a href="mailto:biuro@home-evolution.pl">biuro@home-evolution.pl</a>
              <a href="tel:+48123456789">+48 123 456 789</a>
            </address>
          </div>

          {/* === KOLUMNA 4: MEDIA SPOŁECZNOŚCIOWE (ZMIANA TUTAJ) === */}
          <div className={styles.footerColumn}>
            <h4>Znajdź nas</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              {/* ZMIANA: Usunięto ikonę i link do LinkedIn */}
            </div>
          </div>
        </div>

        <div className={styles.copyrightBar}>
          <p>
            &copy; {new Date().getFullYear()} Home Evolution. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}