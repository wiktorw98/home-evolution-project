// frontend/src/app/oferta/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './OfertaPage.module.css';

const BACKEND_URL = 'http://localhost:5000';

export default function OfertaPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/offers`);
        setOffers(response.data);
      } catch (err) {
        setError("Nie udało się załadować oferty. Spróbuj odświeżyć stronę.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Nasza Oferta</h1>
          <p>Poznaj szczegóły naszych kompleksowych usług.</p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {loading && <p className={styles.loadingText}>Ładowanie oferty...</p>}
          {error && <p className={styles.errorText}>{error}</p>}
          
          {!loading && !error && offers.map((service, index) => (
            <section 
              key={service.serviceId} 
              id={service.serviceId} 
              className={`${styles.offerItem} ${index % 2 !== 0 ? styles.reverse : ''}`}
            >
              <div className={styles.offerImage}>
                <Image
                  src={`${BACKEND_URL}/${service.imageUrl}`}
                  alt={service.title}
                  width={550}
                  height={370}
                  className={styles.image}
                />
              </div>
              <div className={styles.offerContent}>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul>
                  {service.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}