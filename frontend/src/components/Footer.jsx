import React from 'react';
import styles from './Footer.module.css'; // Importujemy style dla stopki

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h3>Home Evolution Sp. z o.o.</h3>
        <p>ul. Barwinek 3/45, 25-150 Kielce</p>
        <div className={styles.footerLinks}>
          <a href="mailto:biuro@home-evolution.pl">biuro@home-evolution.pl</a>
          <a href="tel:+48123456789">+48 123 456 789</a>
        </div>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Home Evolution. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}