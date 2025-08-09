// src/app/blog/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BACKEND_URL = 'http://localhost:5000';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Zmieniamy endpoint na /api/posts
        const response = await axios.get(`${BACKEND_URL}/api/posts`);
        setPosts(response.data);
      } catch (err) {
        setError("Nie udało się załadować aktualności. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="text-center text-lg">Ładowanie...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
    if (posts.length === 0) {
      return <p className="text-center text-lg">Brak aktualności do wyświetlenia.</p>;
    }

    return (
      <div className="space-y-8">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h2 className="text-2xl font-bold text-brand-dark mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Opublikowano: {new Date(post.createdAt).toLocaleDateString('pl-PL')}
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark">Blog i Aktualności</h1>
          <p className="mt-2 text-lg text-gray-600">Najnowsze informacje z branży i życia naszej firmy.</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16">
        {renderContent()}
      </main>
    </div>
  );
}