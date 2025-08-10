// frontend/src/app/oferta/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import pageStyles from '../Subpage.module.css';
import offerStyles from './OfertaPage.module.css';
// Importujemy ikonę, która zastąpi standardowy "ptaszek"
import { BsCheckCircleFill } from 'react-icons/bs';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          <h1>Nasza Oferta</h1>
          <p>Poznaj szczegóły naszych kompleksowych usług.</p>
        </div>
      </header>

      <main className={offerStyles.mainContent}>
        <div className={pageStyles.container}>
          {loading && <p className={pageStyles.infoText}>Ładowanie oferty...</p>}
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          
          <div className={offerStyles.offerList}>
            {!loading && !error && offers.map((service, index) => (
              <motion.section 
                key={service.serviceId} 
                id={service.serviceId} 
                className={`${offerStyles.offerCard} ${index % 2 !== 0 ? offerStyles.reverse : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                // Dodajemy efekt "uniesienia" po najechaniu myszką
                whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(45, 55, 72, 0.1)' }}
              >
                <div className={offerStyles.offerImage}>
                  <Image
                    src={`${BACKEND_URL}/${service.imageUrl}`}
                    alt={service.title}
                    width={550}
                    height={370}
                    className={offerStyles.image}
                  />
                </div>
                <div className={offerStyles.offerContent}>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <ul>
                    {service.benefits.map((benefit, i) => (
                      <li key={i}>
                        <BsCheckCircleFill className={offerStyles.benefitIcon} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}