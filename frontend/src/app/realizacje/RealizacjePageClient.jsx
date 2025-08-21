'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import pageStyles from '../Subpage.module.css';
import styles from './RealizacjePage.module.css';
import SkeletonCard from '../../components/SkeletonCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const REALIZATIONS_PER_PAGE = 6;
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } };
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } } };

export default function RealizacjePageClient() {
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [categories, setCategories] = useState(['Wszystkie']);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/realizations`);
        const uniqueCategories = [...new Set(response.data.realizations.map(item => item.category))];
        setCategories(['Wszystkie', ...uniqueCategories]);
      } catch (err) { console.error("Błąd pobierania kategorii.", err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRealizations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/realizations`, {
          params: {
            page: pagination.currentPage,
            limit: REALIZATIONS_PER_PAGE,
            category: activeFilter === 'Wszystkie' ? undefined : activeFilter,
          }
        });
        setRealizations(response.data.realizations);
        setPagination(prev => ({ ...prev, totalPages: response.data.totalPages }));
      } catch (err) { setError("Nie udało się załadować realizacji."); } 
      finally { setLoading(false); }
    };
    fetchRealizations();
  }, [activeFilter, pagination.currentPage]);

  useEffect(() => {
    const categoryFromURL = searchParams.get('kategoria');
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      setActiveFilter(categoryFromURL);
    }
  }, [searchParams, categories]);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // KLUCZOWA POPRAWKA: Ta sama inteligentna funkcja co na stronie bloga
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${BACKEND_URL}/${imagePath}`;
  };

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
              <div className={styles.filterBar}>{categories.map(category => (<button key={category} className={`${styles.filterButton} ${activeFilter === category ? styles.activeFilter : ''}`} onClick={() => handleFilterChange(category)}>{category}</button>))}</div>
              <motion.div layout className={styles.galleryGrid}>
                {loading ? (
                  Array.from({ length: REALIZATIONS_PER_PAGE }).map((_, index) => <SkeletonCard key={index} type="realization" />)
                ) : (
                  <AnimatePresence>
                    {realizations.map((realization) => (
                      <Link key={realization._id} href={`/realizacje/${realization._id}`} className={styles.cardLink}>
                        <motion.div layout className={styles.galleryCard} variants={cardVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} whileHover="visible">
                          <div className={styles.imageContainer}>
                            {realization.images && realization.images.length > 0 && (
                              // KLUCZOWA POPRAWKA: Używamy nowej funkcji
                              <Image src={getImageUrl(realization.images[0])} alt={realization.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} />
                            )}
                          </div>
                          <motion.div className={styles.overlay} variants={overlayVariants}><div className={styles.cardContent}><span className={styles.categoryTag}>{realization.category}</span><h3>{realization.title}</h3></div><div className={styles.plusIconWrapper}><motion.div className={styles.plusIcon} whileHover={{ scale: 1.2, rotate: 90 }}><FiPlus size={28} /></motion.div></div></motion.div>
                        </motion.div>
                      </Link>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
              {!loading && pagination.totalPages > 1 && (
                <div className={styles.pagination}><button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>Poprzednia</button><span>Strona {pagination.currentPage} z {pagination.totalPages}</span><button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>Następna</button></div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}