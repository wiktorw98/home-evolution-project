// frontend/src/app/blog/BlogPageClient.jsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import pageStyles from '../Subpage.module.css'; 
import blogStyles from './BlogPage.module.css'; 
import SkeletonCard from '../../components/SkeletonCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POSTS_PER_PAGE = 6;

export default function BlogPageClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/posts`, { params: { page: pagination.currentPage, limit: POSTS_PER_PAGE } });
        setPosts(response.data.posts);
        setPagination(prev => ({ ...prev, totalPages: response.data.totalPages }));
      } catch (err) {
        setError("Nie udało się załadować aktualności.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}><h1>Blog i Aktualności</h1><p>Najnowsze informacje z branży i życia naszej firmy.</p></div>
      </header>
      <main className={blogStyles.mainContent}>
        <div className={pageStyles.container}>
          {error && <p className={`${pageStyles.infoText} ${pageStyles.errorText}`}>{error}</p>}
          {!error && (
            <>
              <div className={blogStyles.blogGrid}>
                {loading ? (
                  Array.from({ length: POSTS_PER_PAGE }).map((_, index) => <SkeletonCard key={index} type="blog" />)
                ) : (
                  posts.length > 0 ? (
                    posts.map((post) => (
                      // ZMIANA: Upraszczamy strukturę i dodajemy tag <a>
                      <motion.article key={post._id} className={blogStyles.blogCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ y: -5, boxShadow: '0 15px 25px rgba(45, 55, 72, 0.1)' }}>
                        <Link href={`/blog/${post._id}`} className={blogStyles.cardLink}>
                          {post.images && post.images.length > 0 && (
                            <div className={blogStyles.imageContainer}>
                              <Image src={`${BACKEND_URL}/${post.images[0]}`} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className={blogStyles.image} />
                            </div>
                          )}
                          <div className={blogStyles.cardContent}>
                            <div className={blogStyles.postMeta}>Opublikowano: {new Date(post.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            <h2 className={blogStyles.postTitle}>{post.title}</h2>
                            <p className={blogStyles.postExcerpt}>{post.excerpt}</p>
                            <div className={blogStyles.readMoreLink}>Czytaj dalej <span className={blogStyles.arrow}>→</span></div>
                          </div>
                        </Link>
                      </motion.article>
                    ))
                  ) : ( <p className={pageStyles.infoText}>Aktualnie brak wpisów na blogu.</p> )
                )}
              </div>
              {!loading && pagination.totalPages > 1 && (
                <div className={blogStyles.pagination}><button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>Poprzednia</button><span>Strona {pagination.currentPage} z {pagination.totalPages}</span><button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>Następna</button></div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}