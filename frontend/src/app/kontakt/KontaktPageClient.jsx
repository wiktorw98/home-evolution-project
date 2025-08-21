// frontend/src/app/kontakt/KontaktPageClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // ZMIANA: Importujemy hook do odczytu parametrów URL
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import pageStyles from '../Subpage.module.css';
import contactStyles from './KontaktPage.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const socialLinks = [
  { href: 'https://www.facebook.com/people/Home-Evolution/61566432927230/', label: 'Facebook', icon: <FaFacebookF /> },
  { href: 'https://www.instagram.com/home_evolutionn/', label: 'Instagram', icon: <FaInstagram /> },
];

export default function KontaktPageClient() {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', interest: 'Zapytanie ogólne' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  
  const searchParams = useSearchParams(); // Hook do odczytu parametrów

  // Efekt do pobrania listy ofert (do wypełnienia selecta)
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/offers`)
      .then(response => setOffers(response.data))
      .catch(err => console.error("Błąd pobierania ofert do formularza:", err));
  }, []);

  // Efekt do ustawienia domyślnego zainteresowania z URL
  useEffect(() => {
    const interestFromURL = searchParams.get('zainteresowanie');
    if (interestFromURL) {
      setFormData(prev => ({ ...prev, interest: interestFromURL }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/api/forms`, formData);
      setStatus({ loading: false, error: null, success: response.data.message });
      setFormData({ name: '', email: '', phone: '', message: '', interest: 'Zapytanie ogólne' });
    } catch (error) {
      setStatus({ loading: false, error: 'Wystąpił błąd. Spróbuj ponownie później.', success: null });
    }
  };

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}><h1>Skontaktuj się z nami</h1><p>Masz pytania? Jesteśmy do Twojej dyspozycji.</p></div>
      </header>
      <main className={contactStyles.mainContent}>
        <div className={pageStyles.container}>
          <div className={contactStyles.contactWrapper}>
            <div className={contactStyles.contactGrid}>
              <motion.div className={contactStyles.formContainer} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <h2>Napisz do nas</h2>
                <p>Wypełnij formularz, a my skontaktujemy się z Tobą tak szybko, jak to możliwe.</p>
                <form onSubmit={handleSubmit}>
                  <div className={contactStyles.formGroup}><label htmlFor="name">Imię i nazwisko</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className={contactStyles.formGroup}><label htmlFor="email">Adres e-mail</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                  <div className={contactStyles.formGroup}><label htmlFor="phone">Numer telefonu (opcjonalnie)</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} /></div>
                  {/* NOWE POLE SELECT */}
                  <div className={contactStyles.formGroup}><label htmlFor="interest">Czym jesteś zainteresowany/a?</label>
                    <select id="interest" name="interest" value={formData.interest} onChange={handleChange}>
                      <option>Zapytanie ogólne</option>
                      {offers.map(offer => (<option key={offer.serviceId} value={offer.title}>{offer.title}</option>))}
                    </select>
                  </div>
                  <div className={contactStyles.formGroup}><label htmlFor="message">Twoja wiadomość</label><textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea></div>
                  <button type="submit" disabled={status.loading} className={contactStyles.submitButton}>{status.loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}</button>
                  {status.success && <p className={contactStyles.messageSuccess}>{status.success}</p>}
                  {status.error && <p className={contactStyles.messageError}>{status.error}</p>}
                </form>
              </motion.div>
              <motion.div className={contactStyles.detailsContainer} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <h3>Dane kontaktowe</h3><p><strong>Home Evolution</strong></p><p>ul. 1 Maja 156<br />25-646 Kielce</p>
                <h3 className={contactStyles.detailsHeader}>E-mail</h3><p><a href="mailto:biuro@homevo.pl">biuro@homevo.pl</a></p>
                <h3 className={contactStyles.detailsHeader}>Telefon</h3><p><a href="tel:+48503780700">+48 503 780 700</a></p>
                <h3 className={contactStyles.detailsHeader}>Znajdź nas</h3><div className={contactStyles.socialIcons}>{socialLinks.map(social => (<a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">{social.icon}</a>))}</div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <section className={contactStyles.mapSection}>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d773.3767876008677!2d20.614374624701227!3d50.88660580712952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47182700118a4687%3A0xfa579dd01ae2790d!2sHome%20Evolution%20sp.%20z%20o.o.!5e1!3m2!1spl!2spl!4v1755084488727!5m2!1spl!2spl" width="100%" height="450" className={contactStyles.mapFrame} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </section>
    </div>
  );
}