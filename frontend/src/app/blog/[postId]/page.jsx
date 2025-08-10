// frontend/src/app/blog/[postId]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import pageStyles from '../../Subpage.module.css'; // Wychodzimy o jeden folder wyżej
import postStyles from './PostPage.module.css'; // Dedykowane style dla tego widoku

const BACKEND_URL = 'http://localhost:5000';

// 'params' jest automatycznie przekazywane przez Next.js i zawiera ID z URL
export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { postId } = params; // Wyciągamy ID posta z parametrów

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          // Wysyłamy zapytanie o JEDEN, konkretny post
          const response = await axios.get(`${BACKEND_URL}/api/posts/${postId}`);
          setPost(response.data);
        } catch (err) {
          setError("Nie udało się załadować tego wpisu. Być może został usunięty.");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  return (
    <div>
      {/* Używamy naszego uniwersalnego nagłówka */}
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          {/* Tytuł w nagłówku może być dynamiczny lub statyczny */}
          <h1>{loading ? 'Ładowanie wpisu...' : post ? post.title : 'Błąd'}</h1>
          <p>Blog i Aktualności</p>
        </div>
      </header>

      <main className={postStyles.mainContent}>
        <div className={pageStyles.container}>
          {loading && <p className={pageStyles.infoText}>Ładowanie...</p>}
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          
          {post && (
            <motion.article 
              className={postStyles.postContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={postStyles.postMeta}>
                Opublikowano: {new Date(post.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {/* Tutaj wyświetlamy PEŁNĄ treść posta */}
              <div className={postStyles.postContent}>
                {post.content}
              </div>
              <Link href="/blog" className={postStyles.backLink}>
                ← Wróć do wszystkich wpisów
              </Link>
            </motion.article>
          )}
        </div>
      </main>
    </div>
  );
}