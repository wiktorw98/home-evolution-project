// frontend/src/app/kontakt/page.jsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa'; // ZMIANA: Importujemy ikony
import pageStyles from '../Subpage.module.css';
import contactStyles from './KontaktPage.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ZMIANA: Definiujemy linki do social media, tak jak w stopce
const socialLinks = [
  { href: 'https://www.facebook.com/people/Home-Evolution/61566432927230/', label: 'Facebook', icon: <FaFacebookF /> },
  { href: 'https://www.instagram.com/home_evolutionn/', label: 'Instagram', icon: <FaInstagram /> },
];

export default function KontaktPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

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
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus({ loading: false, error: 'Wystąpił błąd. Spróbuj ponownie później.', success: null });
    }
  };

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          <h1>Skontaktuj się z nami</h1>
          <p>Masz pytania? Jesteśmy do Twojej dyspozycji.</p>
        </div>
      </header>

      <main className={contactStyles.mainContent}>
        <div className={pageStyles.container}>
          <div className={contactStyles.contactWrapper}>
            <div className={contactStyles.contactGrid}>
              <motion.div 
                className={contactStyles.formContainer}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h2>Napisz do nas</h2>
                <p>Wypełnij formularz, a my skontaktujemy się z Tobą tak szybko, jak to możliwe.</p>
                <form onSubmit={handleSubmit}>
                  {/* ... (pola formularza bez zmian) ... */}
                  <div className={contactStyles.formGroup}><label htmlFor="name">Imię i nazwisko</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className={contactStyles.formGroup}><label htmlFor="email">Adres e-mail</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                  <div className={contactStyles.formGroup}><label htmlFor="phone">Numer telefonu (opcjonalnie)</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} /></div>
                  <div className={contactStyles.formGroup}><label htmlFor="message">Twoja wiadomość</label><textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea></div>
                  <button type="submit" disabled={status.loading} className={contactStyles.submitButton}>{status.loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}</button>
                  {status.success && <p className={contactStyles.messageSuccess}>{status.success}</p>}
                  {status.error && <p className={contactStyles.messageError}>{status.error}</p>}
                </form>
              </motion.div>

              <motion.div 
                className={contactStyles.detailsContainer}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <h3>Dane kontaktowe</h3>
                <p><strong>Home Evolution</strong></p>
                <p>ul. 1 Maja 156<br />25-646 Kielce</p>
                <h3 className={contactStyles.detailsHeader}>E-mail</h3>
                <p><a href="mailto:biuro@homevo.pl">biuro@homevo.pl</a></p>
                <h3 className={contactStyles.detailsHeader}>Telefon</h3>
                <p><a href="tel:+48503780700">+48 503 780 700</a></p>

                {/* ZMIANA: Dodajemy sekcję z ikonami social media */}
                <h3 className={contactStyles.detailsHeader}>Znajdź nas</h3>
                <div className={contactStyles.socialIcons}>
                  {socialLinks.map(social => (
                    <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <section className={contactStyles.mapSection}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2476.491205720175!2d20.613879269734785!3d50.88683510123485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47182700118a4687%3A0xfa579dd01ae2790d!2sHome%20Evolution%20sp.%20z%20o.o.!5e1!3m2!1spl!2spl!4v1754868463165!5m2!1spl!2spl%22%20width=%22600%22%20height=%22450%22%20style=%22border:0;%22%20allowfullscreen=%22%22%20loading=%22lazy%22%20referrerpolicy=%22no-referrer-when-downgrade%22%3E%3C/iframe%3E" 
          width="100%" 
          height="450" 
          className={contactStyles.mapFrame}
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </section>
    </div>
  );
}