// src/app/kontakt/page.js
'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BACKEND_URL = 'http://localhost:5000';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' }); // 'success', 'error', 'loading'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Wysyłanie...' });
    try {
      const response = await axios.post(`${BACKEND_URL}/api/forms`, formData);
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', phone: '', message: '' }); // Wyczyść formularz
    } catch (error) {
      setStatus({ type: 'error', message: 'Wystąpił błąd. Spróbuj ponownie.' });
    }
  };

  return (
    <div className="bg-gray-50">
      <header className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark">Kontakt</h1>
          <p className="mt-2 text-lg text-gray-600">Masz pytania? Jesteśmy do Twojej dyspozycji.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Lewa kolumna: Formularz */}
          <motion.div 
            className="w-full md:w-2/3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Napisz do nas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" name="name" placeholder="Imię i nazwisko" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded" required />
                <input type="email" name="email" placeholder="Adres e-mail" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded" required />
              </div>
              <div className="mb-4">
                <input type="tel" name="phone" placeholder="Numer telefonu (opcjonalnie)" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded" />
              </div>
              <div className="mb-4">
                <textarea name="message" placeholder="Twoja wiadomość" value={formData.message} onChange={handleChange} className="w-full p-3 border rounded h-32" required />
              </div>
              <button type="submit" disabled={status.type === 'loading'} className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded hover:bg-green-600 disabled:bg-gray-400">
                {status.type === 'loading' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              </button>
              {status.message && (
                <p className={`mt-4 text-center p-2 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </motion.div>

          {/* Prawa kolumna: Dane kontaktowe */}
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg h-full">
              <h2 className="text-2xl font-bold mb-4">Dane firmy</h2>
              <p className="font-bold">Home Evolution Sp. z o.o.</p>
              <p>ul. Barwinek 3/45</p>
              <p>25-150 Kielce</p>
              <p className="mt-4">
                <a href="mailto:biuro@home-evolution.pl" className="text-brand-green hover:underline">biuro@home-evolution.pl</a>
              </p>
              <p>
                <a href="tel:+48123456789" className="text-brand-green hover:underline">+48 123 456 789</a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sekcja z mapą */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Znajdź nas na mapie</h2>
          <div className="w-full h-96 rounded-lg shadow-xl overflow-hidden">
            {/* TUTAJ WKLEJ KOD IFRAME Z GOOGLE MAPS */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1101.8772055963384!2d20.6137269353855!3d50.886638598015175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471827deb885bc67%3A0xff6c9a464eaef01!2s1%20Maja%20156%2C%2025-646%20Kielce!5e1!3m2!1spl!2spl!4v1754734272346!5m2!1spl!2spl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </main>
    </div>
  );
}