// frontend/src/app/blog/[postId]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// ZMIANA: Importujemy komponent Lightbox i jego style
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import pageStyles from '../../Subpage.module.css';
import postStyles from './PostPage.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = params;

  // ZMIANA: Dodajemy stan do zarządzania galerią
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/posts/${postId}`);
          setPost(response.data);
        } catch (err) {
          setError("Nie udało się załadować tego wpisu.");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  // Funkcja otwierająca galerię na klikniętym zdjęciu
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Przygotowujemy slajdy dla galerii
  const slides = post?.images?.map(image => ({
    src: `${BACKEND_URL}/${image}`
  })) || [];

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          <h1>{loading ? 'Ładowanie...' : post ? post.title : 'Błąd'}</h1>
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
              
              {post.images && post.images.length > 0 && (
                <div className={postStyles.gallery}>
                  {post.images.map((image, index) => (
                    // ZMIANA: Każde zdjęcie jest teraz przyciskiem otwierającym galerię
                    <button 
                      key={index} 
                      className={postStyles.galleryImageWrapper}
                      onClick={() => openLightbox(index)}
                    >
                      <Image 
                        src={`${BACKEND_URL}/${image}`} 
                        alt={`Zdjęcie ${index + 1} do posta ${post.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className={postStyles.galleryImage}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className={postStyles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
              <Link href="/blog" className={postStyles.backLink}>← Wróć do wszystkich wpisów</Link>
            </motion.article>
          )}
        </div>
      </main>

      {/* ZMIANA: Dodajemy komponent Lightbox, który jest widoczny tylko gdy isLightboxOpen=true */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentImageIndex}
      />
    </div>
  );
}