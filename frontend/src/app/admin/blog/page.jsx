// frontend/src/app/admin/blog/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './AdminBlog.module.css';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import RichTextEditor from '../../../components/RichTextEditor'; // Upewniamy się, że importujemy nasz nowy edytor

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function PostEditor({ post, onClose, onUpdate }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [existingImages, setExistingImages] = useState(post.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageDelete = (imageToDelete) => { /* ... (logika bez zmian) ... */ };
  const handleSubmit = async (e) => { /* ... (logika bez zmian) ... */ };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.formHeader}>Edytuj Post</h2>
          <div className={styles.formGroup}><label>Tytuł</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className={styles.formGroup}><label>Treść</label><RichTextEditor value={content} onChange={setContent} /></div>
          <div className={styles.formGroup}><label>Istniejące zdjęcia</label><div className={styles.imagePreviewGrid}>{existingImages.map(img => (<div key={img} className={styles.imagePreviewWrapper}><Image src={`${BACKEND_URL}/${img}`} alt="Miniatura" width={80} height={80} className={styles.imagePreview} /><button type="button" onClick={() => handleImageDelete(img)} className={styles.deleteImageButton}><FiX /></button></div>))}</div></div>
          <div className={styles.formGroup}><label>Dodaj nowe zdjęcia</label><input type="file" multiple onChange={(e) => setNewImages(e.target.files)} /></div>
          <div className={styles.modalActions}><button type="button" onClick={onClose} className={styles.cancelButton}>Anuluj</button><button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p>Zacznij pisać swój artykuł tutaj...</p>'); // Stan teraz przechowuje HTML
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const router = useRouter();

  useEffect(() => { /* ... (logika tokenu bez zmian) ... */ }, [router]);
  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => { /* ... (logika bez zmian) ... */ };
  const handleDelete = async (id) => { /* ... (logika bez zmian) ... */ };
  const handleUpdate = (updatedPost) => { /* ... (logika bez zmian) ... */ };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    try {
      const response = await api.post('/api/posts', formData);
      fetchPosts();
      setSuccess('Post został dodany pomyślnie!');
      setTitle(''); setContent('<p></p>'); setImages([]); e.target.reset();
    } catch (err) { setError('Wystąpił błąd podczas dodawania posta.'); } 
    finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      {editingPost && <PostEditor post={editingPost} onClose={() => setEditingPost(null)} onUpdate={handleUpdate} />}
      <h1 className={styles.header}>Zarządzanie Blogiem</h1>
      <form onSubmit={handleCreate} className={styles.form}>
        <h2 className={styles.formHeader}>Dodaj nowy post</h2>
        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}
        <div className={styles.formGroup}><label htmlFor="title">Tytuł</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className={styles.formGroup}><label>Treść</label><RichTextEditor value={content} onChange={setContent} /></div>
        <div className={styles.formGroup}><label htmlFor="images">Zdjęcia (opcjonalnie, max 10)</label><input id="images" type="file" multiple onChange={(e) => setImages(e.target.files)} /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Opublikuj post'}</button>
      </form>
      <hr className={styles.separator} />
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Posty</h2>
        {posts.length > 0 ? (<ul>{posts.map(post => (<li key={post._id} className={styles.postItem}><span>{post.title}</span><div className={styles.actionButtons}><button onClick={() => setEditingPost(post)} className={styles.editButton} disabled={loading}>Edytuj</button><button onClick={() => handleDelete(post._id)} className={styles.deleteButton} disabled={loading}>Usuń</button></div></li>))}</ul>) : (<p>Brak postów.</p>)}
      </div>
    </AdminLayout>
  );
}