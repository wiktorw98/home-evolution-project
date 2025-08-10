// frontend/src/app/realizacje/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import pageStyles from '../Subpage.module.css';
import styles from './RealizacjePage.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Definicje animacji wyniesione poza komponent dla optymalizacji
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function RealizacjePage() {
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealizations = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/realizations`);
        setRealizations(response.data);
      } catch (err) {
        setError("Nie udało się załadować realizacji. Spróbuj odświeżyć stronę.");
      } finally {
        setLoading(false);
      }
    };
    fetchRealizations();
  }, []);

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          <h1>Nasze Realizacje</h1>
          <p>Jesteśmy dumni z naszej pracy. Zobacz efekty.</p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={pageStyles.container}>
          {loading && <p className={pageStyles.infoText}>Ładowanie realizacji...</p>}
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          
          {!loading && !error && realizations.length === 0 && (
            <p className={pageStyles.infoText}>Aktualnie brak realizacji do wyświetlenia.</p>
          )}

          {!loading && !error && realizations.length > 0 && (
            <div className={styles.galleryGrid}>
              {realizations.map((realization, index) => (
                <motion.div 
                  key={realization._id} 
                  className={styles.galleryCard}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover="visible"
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={`${BACKEND_URL}/${realization.imageUrl}`}
                      alt={realization.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.image}
                    />
                  </div>
                  
                  <motion.div className={styles.overlay} variants={overlayVariants}>
                    <div className={styles.cardContent}>
                      <span className={styles.categoryTag}>{realization.category}</span>
                      <h3>{realization.title}</h3>
                    </div>
                    <motion.div className={styles.plusIcon} whileHover={{ scale: 1.2, rotate: 90 }}>
                      <FiPlus size={32} />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}