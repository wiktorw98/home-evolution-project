// src/app/realizacje/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BACKEND_URL = 'http://localhost:5000';

export default function RealizacjePage() {
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealizations = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/realizations`);
        setRealizations(response.data);
      } catch (err) {
        setError("Nie udało się załadować realizacji. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };
    fetchRealizations();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="text-center text-lg">Ładowanie...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
    if (realizations.length === 0) {
      return <p className="text-center text-lg">Aktualnie brak zrealizowanych projektów w naszej galerii. Zapraszamy wkrótce!</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {realizations.map((realization, index) => (
          <motion.div
            key={realization._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative w-full h-56">
              <Image
                src={`${BACKEND_URL}/${realization.imageUrl}`}
                alt={realization.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">{realization.title}</h3>
              <p className="text-gray-600">{realization.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark">Nasze Realizacje</h1>
          <p className="mt-2 text-lg text-gray-600">Zobacz efekty naszej pracy.</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16">
        {renderContent()}
      </main>
    </div>
  );
}