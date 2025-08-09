// frontend/src/app/admin/blog/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminBlog.module.css';

const BACKEND_URL = 'http://localhost:5000';

export default function AdminBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/posts`);
      setPosts(response.data);
    } catch (err) {
      setError("Nie udało się załadować listy postów.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/posts`, { title, content });
      setPosts([response.data, ...posts]);
      setSuccess('Post został dodany pomyślnie!');
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania posta.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten post?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      setSuccess('Post został usunięty.');
    } catch (err) {
      setError('Nie udało się usunąć posta.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.header}>Panel Zarządzania Blogiem</h1>

        <form onSubmit={handleCreate} className={styles.form}>
          <h2 className={styles.formHeader}>Dodaj nowy post</h2>
          {error && <p className={styles.messageError}>{error}</p>}
          {success && <p className={styles.messageSuccess}>{success}</p>}

          <div className={styles.formGroup}>
            <label htmlFor="title">Tytuł</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Treść</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Dodawanie...' : 'Opublikuj post'}
          </button>
        </form>

        <hr className={styles.separator} />

        <div className={styles.listContainer}>
          <h2 className={styles.listHeader}>Istniejące Posty</h2>
          {posts.length > 0 ? (
            <ul className={styles.postList}>
              {posts.map(post => (
                <li key={post._id} className={styles.postItem}>
                  <span>{post.title}</span>
                  <button onClick={() => handleDelete(post._id)} className={styles.deleteButton}>Usuń</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak postów w bazie danych.</p>
          )}
        </div>
      </div>
    </div>
  );
}