// frontend/src/app/admin/blog/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './AdminBlog.module.css';

export default function AdminBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts');
      // Zakładając, że paginacja zwraca obiekt { posts: [...] }
      setPosts(response.data.posts || []);
    } catch (err) { setError("Nie udało się załadować listy postów."); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      // ZMIANA: Usunięto ręczne ustawianie nagłówka
      const response = await api.post('/api/posts', formData);
      setPosts([response.data, ...posts]);
      setSuccess('Post został dodany pomyślnie!');
      setTitle('');
      setContent('');
      setImages([]);
      e.target.reset();
    } catch (err) { setError('Wystąpił błąd podczas dodawania posta.'); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten post?')) return;
    try {
      await api.delete(`/api/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      setSuccess('Post został usunięty.');
    } catch (err) { setError('Nie udało się usunąć posta.'); }
  };

  return (
    <AdminLayout>
      <h1 className={styles.header}>Zarządzanie Blogiem</h1>
      <form onSubmit={handleCreate} className={styles.form}>
        <h2 className={styles.formHeader}>Dodaj nowy post</h2>
        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}
        <div className={styles.formGroup}><label htmlFor="title">Tytuł</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="content">Treść</label><textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="10" required /></div>
        <div className={styles.formGroup}><label htmlFor="images">Zdjęcia (opcjonalnie, max 10)</label><input id="images" type="file" multiple onChange={(e) => setImages(e.target.files)} /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Opublikuj post'}</button>
      </form>
      <hr className={styles.separator} />
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Posty</h2>
        {posts.length > 0 ? (<ul className={styles.postList}>{posts.map(post => (<li key={post._id} className={styles.postItem}><span>{post.title}</span><button onClick={() => handleDelete(post._id)} className={styles.deleteButton}>Usuń</button></li>))}</ul>) : (<p>Brak postów.</p>)}
      </div>
    </AdminLayout>
  );
}