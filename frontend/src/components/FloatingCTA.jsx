// frontend/src/components/FloatingCTA.jsx
'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiX } from 'react-icons/fi';
import styles from './FloatingCTA.module.css';

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Efekt, który pokazuje przycisk z opóźnieniem
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Pokaż po 3 sekundach
    return () => clearTimeout(timer);
  }, []);

  // Ukrywamy komponent na stronach admina i logowania
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Główny, pływający przycisk-bąbelek */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className={styles.ctaBubble}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Otwórz okno kontaktu"
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FiX size={24} /> : <FiPhone size={24} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel, który pojawia się po kliknięciu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.ctaCard}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.cardHeader}>
              <Image src="/doradca.jpg" alt="Doradca Home Evolution" width={50} height={50} className={styles.avatar} />
              <div>
                <h4>Masz pytania?</h4>
                <p>Nasz doradca chętnie pomoże!</p>
              </div>
            </div>
            <div className={styles.cardBody}>
              <p>Zadzwoń i zapytaj o bezpłatną wycenę. Jesteśmy dostępni od poniedziałku do piątku w godzinach 8:00 - 17:00.</p>
              <Link href="tel:+48503780700" className={styles.phoneButton}>
                <FiPhone />
                +48 503 780 700
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}