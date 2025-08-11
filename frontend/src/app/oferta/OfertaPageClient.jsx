// frontend/src/app/oferta/OfertaPageClient.jsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsCheckCircleFill } from 'react-icons/bs';
import pageStyles from '../Subpage.module.css';
import offerStyles from './OfertaPage.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function OfertaPageClient() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/offers`);
        setOffers(response.data);
      } catch (err) { setError("Nie udało się załadować oferty."); } 
      finally { setLoading(false); }
    };
    fetchOffers();
  }, []);

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}><h1>Nasza Oferta</h1><p>Poznaj szczegóły naszych kompleksowych usług.</p></div>
      </header>
      <main className={offerStyles.mainContent}>
        <div className={pageStyles.container}>
          {loading && <p className={pageStyles.infoText}>Ładowanie oferty...</p>}
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          <div className={offerStyles.offerList}>
            {!loading && !error && offers.map((service, index) => (
              <Link key={service.serviceId} href={`/kontakt?zainteresowanie=${encodeURIComponent(service.title)}`} className={offerStyles.cardLink}>
                <motion.section 
                  id={service.serviceId} 
                  className={`${offerStyles.offerCard} ${index % 2 !== 0 ? offerStyles.reverse : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(45, 55, 72, 0.1)' }}
                >
                  {/* ZMIANA: Używamy atrybutu 'fill' w komponencie Image */}
                  <div className={offerStyles.offerImage}>
                    <Image 
                      src={`${BACKEND_URL}/${service.imageUrl}`} 
                      alt={service.title} 
                      fill
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className={offerStyles.image} 
                    />
                  </div>
                  <div className={offerStyles.offerContent}>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <ul>{service.benefits.map((benefit, i) => (<li key={i}><BsCheckCircleFill className={offerStyles.benefitIcon} /><span>{benefit}</span></li>))}</ul>
                  </div>
                </motion.section>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}