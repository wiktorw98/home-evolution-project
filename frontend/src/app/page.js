// frontend/src/app/page.js

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Użyjemy zoptymalizowanego komponentu Image
import styles from './HomePage.module.css';
import Counter from '../components/Counter'; // Poprawny import komponentu
import { FaSolarPanel, FaHome, FaFire } from 'react-icons/fa';

export default function HomePage() {
  // Definicja usług do łatwego zarządzania
  const services = [
    { icon: FaSolarPanel, title: "Fotowoltaika", desc: "Produkuj własny prąd, obniż rachunki i chroń środowisko.", link: "/oferta#fotowoltaika" },
    { icon: FaHome, title: "Termomodernizacja", desc: "Zwiększ efektywność energetyczną i komfort cieplny swojego domu.", link: "/oferta#ocieplenie" },
    { icon: FaFire, title: "Wymiana Źródeł Ciepła", desc: "Wymień stary kocioł na nowoczesne, ekologiczne i oszczędne rozwiązanie.", link: "/oferta#kotly" }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* === SEKCJA HERO === */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Nowoczesna Energia, Lepszy Dom</h1>
            <p>Zainwestuj w komfort, oszczędności i ekologię z Home Evolution. Oferujemy kompleksowe rozwiązania OZE i termomodernizacji.</p>
            <Link href="/kontakt" className={styles.btn}>Uzyskaj Bezpłatną Wycenę</Link>
          </motion.div>
        </div>
      </section>

      {/* === SEKCJA STATYSTYK === */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <Counter stat={500} suffix="+" text="Zrealizowanych projektów" />
            <Counter stat={98} suffix="%" text="Zadowolonych klientów" />
            <Counter stat={10} suffix="+" text="Lat doświadczenia" />
          </div>
        </div>
      </section>

      {/* === SEKCJA USŁUG === */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Nasze Kluczowe Usługi</h2>
            <p>Od projektu po realizację – zapewniamy kompleksową obsługę na każdym etapie.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <service.icon className={styles.serviceIcon} />
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <Link href={service.link} className={styles.serviceLink}>
                  Zobacz szczegóły &rarr;
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === SEKCJA CTA === */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Gotowy na Ewolucję Swojego Domu?</h2>
          <p>Skontaktuj się z nami już dziś. Nasi doradcy przygotują dla Ciebie spersonalizowaną ofertę całkowicie za darmo.</p>
          <Link href="/kontakt" className={styles.btn}>Porozmawiajmy o Projekcie</Link>
        </div>
      </section>
    </div>
  );
}