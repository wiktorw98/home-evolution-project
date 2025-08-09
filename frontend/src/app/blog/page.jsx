// frontend/src/app/blog/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './BlogPage.module.css';

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
    <div className={styles.pageWrapper}>
      {/* === NAGŁÓWEK STRONY === */}
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Blog i Aktualności</h1>
          <p>Najnowsze informacje z branży i życia naszej firmy.</p>
        </div>
      </header>

      {/* === LISTA POSTÓW === */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {loading && <p className={styles.infoText}>Ładowanie wpisów...</p>}
          {error && <p className={`${styles.infoText} ${styles.errorText}`}>{error}</p>}
          
          {!loading && !error && posts.length === 0 && (
            <p className={styles.infoText}>Aktualnie brak wpisów na blogu. Dodaj pierwszy w panelu admina!</p>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className={styles.blogList}>
              {posts.map((post, index) => (
                <motion.article 
                  key={post._id} 
                  className={styles.blogPost}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h2>{post.title}</h2>
                  <div className={styles.postMeta}>
                    Opublikowano: {new Date(post.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <p className={styles.postContent}>{post.content}</p>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}