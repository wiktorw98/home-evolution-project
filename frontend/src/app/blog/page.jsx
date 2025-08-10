// frontend/src/app/blog/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link'; // ZMIANA: Importujemy Link
import pageStyles from '../Subpage.module.css'; 
import blogStyles from './BlogPage.module.css'; 

const BACKEND_URL = 'http://localhost:5000';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/posts`);
        setPosts(response.data);
      } catch (err) {
        setError("Nie udało się załadować aktualności. Spróbuj odświeżyć stronę.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          <h1>Blog i Aktualności</h1>
          <p>Najnowsze informacje z branży i życia naszej firmy.</p>
        </div>
      </header>

      {/* ZMIANA: Używamy nowej klasy dla tła */}
      <main className={blogStyles.mainContent}>
        <div className={pageStyles.container}>
          {loading && <p className={pageStyles.infoText}>Ładowanie wpisów...</p>}
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          
          {!loading && !error && posts.length === 0 && (
            <p className={pageStyles.infoText}>Aktualnie brak wpisów na blogu. Zapraszamy wkrótce!</p>
          )}

          {!loading && !error && posts.length > 0 && (
            // ZMIANA: Zmieniamy klasę na 'blogGrid'
            <div className={blogStyles.blogGrid}>
              {posts.map((post, index) => (
                // ZMIANA: Całkowicie nowa struktura karty posta
                <motion.article 
                  key={post._id} 
                  className={blogStyles.blogCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 15px 25px rgba(45, 55, 72, 0.1)' }}
                >
                  <div className={blogStyles.cardContent}>
                    <div className={blogStyles.postMeta}>
                      Opublikowano: {new Date(post.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <Link href={`/blog/${post._id}`} passHref>
                      <h2 className={blogStyles.postTitle}>{post.title}</h2>
                    </Link>
                    <p className={blogStyles.postExcerpt}>
                      {/* ZMIANA: Tworzymy "zajawkę" zamiast pełnej treści */}
                      {post.content.substring(0, 150)}...
                    </p>
                    <Link href={`/blog/${post._id}`} passHref>
                      <span className={blogStyles.readMoreLink}>
                        Czytaj dalej <span className={blogStyles.arrow}>→</span>
                      </span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}