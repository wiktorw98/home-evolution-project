// frontend/src/app/realizacje/RealizacjePageClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // ZMIANA: Importujemy hook
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import pageStyles from '../Subpage.module.css';
import styles from './RealizacjePage.module.css';
import SkeletonCard from '../../components/SkeletonCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } };
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } } };

export default function RealizacjePageClient() {
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [categories, setCategories] = useState(['Wszystkie']);
  const searchParams = useSearchParams(); // ZMIANA: Inicjalizujemy hook

  useEffect(() => {
    const fetchRealizations = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/realizations`);
        const fetchedRealizations = response.data;
        setRealizations(fetchedRealizations);
        
        const uniqueCategories = [...new Set(fetchedRealizations.map(item => item.category))];
        const allCategories = ['Wszystkie', ...uniqueCategories];
        setCategories(allCategories);

        // ZMIANA: Sprawdzamy, czy w URL jest parametr kategorii
        const categoryFromURL = searchParams.get('kategoria');
        if (categoryFromURL && allCategories.includes(categoryFromURL)) {
          setActiveFilter(categoryFromURL);
        }

      } catch (err) { setError("Nie udało się załadować realizacji."); } 
      finally { setLoading(false); }
    };
    fetchRealizations();
  }, [searchParams]); // ZMIANA: Uruchamiamy efekt, gdy zmienią się parametry URL

  const filteredRealizations = activeFilter === 'Wszystkie' ? realizations : realizations.filter(r => r.category === activeFilter);

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}><h1>Nasze Realizacje</h1><p>Jesteśmy dumni z naszej pracy. Zobacz efekty.</p></div>
      </header>
      <main className={styles.mainContent}>
        <div className={pageStyles.container}>
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          {!error && (
            <>
              <div className={styles.filterBar}>{categories.map(category => (<button key={category} className={`${styles.filterButton} ${activeFilter === category ? styles.activeFilter : ''}`} onClick={() => setActiveFilter(category)}>{category}</button>))}</div>
              <motion.div layout className={styles.galleryGrid}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} type="realization" />)
                ) : (
                  <AnimatePresence>
                    {filteredRealizations.map((realization) => (
                      <Link key={realization._id} href={`/realizacje/${realization._id}`} className={styles.cardLink}>
                        <motion.div layout className={styles.galleryCard} variants={cardVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} whileHover="visible">
                          <div className={styles.imageContainer}><Image src={`${BACKEND_URL}/${realization.imageUrl}`} alt={realization.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} /></div>
                          <motion.div className={styles.overlay} variants={overlayVariants}><div className={styles.cardContent}><span className={styles.categoryTag}>{realization.category}</span><h3>{realization.title}</h3></div><div className={styles.plusIconWrapper}><motion.div className={styles.plusIcon} whileHover={{ scale: 1.2, rotate: 90 }}><FiPlus size={28} /></motion.div></div></motion.div>
                        </motion.div>
                      </Link>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}