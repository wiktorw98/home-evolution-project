// frontend/src/app/realizacje/[realizationId]/RealizationDetailClient.jsx
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
  const params = useParams();
  const { realizationId } = params;

  useEffect(() => {
    if (realizationId) {
      const fetchRealization = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/realizations/${realizationId}`);
          setRealization(response.data);
        } catch (err) {
          setError("Nie udało się załadować tej realizacji.");
        } finally {
          setLoading(false);
        }
      };
      fetchRealization();
    }
  }, [realizationId]);

  const openLightbox = () => setLightboxOpen(true);
  const slides = realization ? [{ src: `${BACKEND_URL}/${realization.imageUrl}` }] : [];

  if (loading) return <div className={pageStyles.infoText}>Ładowanie...</div>;
  if (error) return <div className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</div>;
  if (!realization) return null;

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          {/* ZMIANA: Zostaje tu tylko tytuł */}
          <h1>{realization.title}</h1>
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={pageStyles.container}>
          
          {/* ZMIANA: Przenosimy kategorię tutaj, na początek głównej treści */}
          <div className={styles.categoryContainer}>
            <Link href={`/realizacje?kategoria=${encodeURIComponent(realization.category)}`} className={styles.categoryLink}>
              {realization.category}
            </Link>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.imageColumn}>
              <button className={styles.imageWrapper} onClick={openLightbox}><Image src={`${BACKEND_URL}/${realization.imageUrl}`} alt={realization.title} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.mainImage} /></button>
            </div>
            <div className={styles.descriptionColumn}>
              <h2>Opis projektu</h2>
              <p>{realization.description}</p>
            </div>
          </div>
          <div className={styles.backButtonContainer}>
            <BackButton text="Wróć do wszystkich realizacji" />
          </div>
        </div>
      </main>
      <Lightbox open={isLightboxOpen} close={() => setLightboxOpen(false)} slides={slides} />
    </div>
  );
}