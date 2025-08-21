// frontend/src/components/Footer.jsx
import Link from 'next/link';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.css';

// ZMIANA: Dodajemy link "O nas"
const navLinks = [
  { href: '/oferta', label: 'Oferta' },
  { href: '/realizacje', label: 'Realizacje' },
  { href: '/blog', label: 'Blog' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/kontakt', label: 'Kontakt' },
];

const socialLinks = [
  { href: 'https://www.facebook.com/people/Home-Evolution/61566432927230/', label: 'Facebook', icon: <FaFacebookF /> },
  { href: 'https://www.instagram.com/home_evolutionn/', label: 'Instagram', icon: <FaInstagram /> },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}><h3 className={styles.logo}>Home Evolution</h3><p className={styles.tagline}>Zmieniamy domy, dbając o przyszłość i środowisko.</p></div>
          <div className={styles.footerColumn}><h4>Nawigacja</h4><ul>{navLinks.map(link => (<li key={link.href}><Link href={link.href}>{link.label}</Link></li>))}</ul></div>
          <div className={styles.footerColumn}><h4>Kontakt</h4><address className={styles.address}><span>ul. 1 Maja 156, 25-646 Kielce</span><a href="mailto:biuro@homevo.pl">biuro@homevo.pl</a><a href="tel:+48503780700">+48 503 780 700</a></address></div>
          <div className={styles.footerColumn}><h4>Znajdź nas</h4><div className={styles.socialIcons}>{socialLinks.map(social => (<a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">{social.icon}</a>))}</div></div>
        </div>
        <div className={styles.copyrightBar}><p>&copy; {new Date().getFullYear()} Home Evolution. Wszelkie prawa zastrzeżone.</p></div>
      </div>
    </footer>
  );
}