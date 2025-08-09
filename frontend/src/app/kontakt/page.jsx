// frontend/src/app/kontakt/page.jsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './KontaktPage.module.css';

const BACKEND_URL = 'http://localhost:5000';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
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
      setFormData({ name: '', email: '', phone: '', message: '' }); // Wyczyść formularz
    } catch (error) {
      setStatus({ loading: false, error: 'Wystąpił błąd. Spróbuj ponownie później.', success: null });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* === NAGŁÓWEK STRONY === */}
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Skontaktuj się z nami</h1>
          <p>Masz pytania? Jesteśmy do Twojej dyspozycji.</p>
        </div>
      </header>

      {/* === GŁÓWNA TREŚĆ === */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Lewa kolumna: Formularz */}
            <motion.div 
              className={styles.formContainer}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2>Napisz do nas</h2>
              <p>Wypełnij formularz, a my skontaktujemy się z Tobą tak szybko, jak to możliwe.</p>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Imię i nazwisko</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Adres e-mail</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Numer telefonu (opcjonalnie)</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Twoja wiadomość</label>
                  <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" disabled={status.loading} className={styles.submitButton}>
                  {status.loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                </button>
                {status.success && <p className={styles.messageSuccess}>{status.success}</p>}
                {status.error && <p className={styles.messageError}>{status.error}</p>}
              </form>
            </motion.div>

            {/* Prawa kolumna: Dane kontaktowe */}
            <motion.div 
              className={styles.detailsContainer}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3>Dane kontaktowe</h3>
              <p><strong>Home Evolution Sp. z o.o.</strong></p>
              <p>ul. Barwinek 3/45<br />25-150 Kielce</p>
              <h3 className={styles.detailsHeader}>E-mail</h3>
              <p><a href="mailto:biuro@home-evolution.pl">biuro@home-evolution.pl</a></p>
              <h3 className={styles.detailsHeader}>Telefon</h3>
              <p><a href="tel:+48123456789">+48 123 456 789</a></p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* === SEKCJA Z MAPĄ === */}
      <section className={styles.mapSection}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16648.943719542494!2d20.596021951727458!3d50.886604145369134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47182700118a4687%3A0xfa579dd01ae2790d!2sHome%20Evolution%20sp.%20z%20o.o.!5e1!3m2!1spl!2spl!4v1754747920695!5m2!1spl!2spl" 
          width="100%" 
          height="450" 
          style={{ border:0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </section>
    </div>
  );
}