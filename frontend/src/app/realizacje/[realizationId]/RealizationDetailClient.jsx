'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import pageStyles from '../../Subpage.module.css';
import styles from './RealizationDetail.module.css';
import BackButton from '../../../components/BackButton';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RealizationDetailClient() {
  const [realization, setRealization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const params = useParams();
  const { realizationId } = params;

  useEffect(() => {
    if (realizationId) {
      const fetchRealization = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/realizations/${realizationId}`);
          setRealization(response.data);
        } catch (err) { setError("Nie udało się załadować tej realizacji."); } 
        finally { setLoading(false); }
      };
      fetchRealization();
    }
  }, [realizationId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${BACKEND_URL}/${imagePath}`;
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const slides = realization?.images?.map(image => ({ 
    src: getImageUrl(image) 
  })) || [];

  if (loading) return <div className={pageStyles.infoText}>Ładowanie...</div>;
  if (error) return <div className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</div>;
  if (!realization) return null;

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        {/* ZMIANA: Dodajemy nową klasę, aby kontrolować układ wewnątrz nagłówka */}
        <div className={`${pageStyles.container} ${styles.headerContainer}`}>
          <h1>{realization.title}</h1>
          <Link href={`/realizacje?kategoria=${encodeURIComponent(realization.category)}`} className={styles.headerCategoryLink}>{realization.category}</Link>
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={pageStyles.container}>
          <div className={styles.categoryContainer}>
            {/* Możemy tu coś dodać w przyszłości, na razie puste */}
          </div>
          <div className={styles.contentGrid}>
            <div className={styles.galleryColumn}>
              {realization.images && realization.images.map((image, index) => (
                <button key={index} className={styles.imageWrapper} onClick={() => openLightbox(index)}>
                  <Image src={getImageUrl(image)} alt={`${realization.title} - zdjęcie ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.mainImage} />
                </button>
              ))}
            </div>
            <div className={styles.descriptionColumn}>
              <h2>Opis projektu</h2>
              <p>{realization.description}</p>
            </div>
          </div>
          <div className={styles.backButtonContainer}><BackButton text="Wróć do wszystkich realizacji" /></div>
        </div>
      </main>
      <Lightbox open={isLightboxOpen} close={() => setLightboxOpen(false)} slides={slides} index={currentImageIndex} />
    </div>
  );
}