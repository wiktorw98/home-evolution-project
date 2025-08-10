// frontend/src/app/page.js
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './HomePage.module.css';

// Definicje wariantów animacji wyniesione poza komponent dla optymalizacji
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      ease: 'easeInOut',
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <motion.div
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            Nowoczesne rozwiązania dla Twojego domu
          </motion.h1>
          <motion.p className={styles.heroSubtitle} variants={itemVariants}>
            Specjalizujemy się w fotowoltaice, termomodernizacjach i wymianie źródeł ciepła, oferując kompleksowe usługi na najwyższym poziomie.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/kontakt" passHref>
              <motion.button
                className={styles.heroButton}
                whileHover={{ 
                  scale: 1.05, 
                  // ZMIANA: Ujednolicamy kolor cienia z naszym kolorem marki
                  boxShadow: '0px 5px 15px rgba(0, 170, 255, 0.3)' 
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Darmowa Wycena
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}