// frontend/src/app/realizacje/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './RealizacjePage.module.css';

const BACKEND_URL = 'http://localhost:5000';

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
    <div className={styles.pageWrapper}>
      {/* === NAGŁÓWEK STRONY === */}
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Nasze Realizacje</h1>
          <p>Jesteśmy dumni z naszej pracy. Zobacz efekty.</p>
        </div>
      </header>

      {/* === GALERIA === */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {loading && <p className={styles.infoText}>Ładowanie realizacji...</p>}
          {error && <p className={`${styles.infoText} ${styles.errorText}`}>{error}</p>}
          
          {!loading && !error && realizations.length === 0 && (
            <p className={styles.infoText}>Aktualnie brak realizacji do wyświetlenia. Dodaj pierwszą w panelu admina!</p>
          )}

          {!loading && !error && realizations.length > 0 && (
            <div className={styles.galleryGrid}>
              {realizations.map((realization, index) => (
                <motion.div 
                  key={realization._id} 
                  className={styles.galleryCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={styles.galleryImage}>
                    <Image
                      src={`${BACKEND_URL}/${realization.imageUrl}`}
                      alt={realization.title}
                      width={400}
                      height={250}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.galleryContent}>
                    <span className={styles.categoryTag}>{realization.category}</span>
                    <h3>{realization.title}</h3>
                    <p>{realization.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}