// frontend/src/app/admin/realizacje/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './AdminRealizacje.module.css';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Komponent RealizationEditor pozostaje bez zmian
function RealizationEditor({ realization, onClose, onUpdate }) { /* ... */ }

export default function AdminRealizacjePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fotowoltaika');
  const [images, setImages] = useState([]);
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRealization, setEditingRealization] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const fetchRealizations = async () => {
    try {
      const response = await api.get('/api/realizations');
      setRealizations(response.data);
    } catch (err) { setError("Nie udało się załadować listy realizacji."); }
  };

  useEffect(() => { fetchRealizations(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (images.length === 0) { setError("Co najmniej jedno zdjęcie jest wymagane!"); return; }
    setLoading(true);
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    // ZMIANA: Upewniamy się, że wysyłamy kategorię
    formData.append('category', category);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    try {
      const response = await api.post('/api/realizations', formData);
      setRealizations([response.data, ...realizations]);
      setSuccess('Realizacja została dodana pomyślnie!');
      setTitle(''); setDescription(''); setCategory('Fotowoltaika'); setImages([]); e.target.reset();
    } catch (err) {
      // ZMIANA: Wyświetlamy bardziej szczegółowy błąd z serwera
      setError(err.response?.data?.message || 'Wystąpił błąd podczas dodawania realizacji.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => { /* ... bez zmian ... */ };
  const handleUpdate = (updatedRealization) => { /* ... bez zmian ... */ };

  return (
    <AdminLayout>
      {editingRealization && <RealizationEditor realization={editingRealization} onClose={() => setEditingRealization(null)} onUpdate={handleUpdate} />}
      <h1 className={styles.header}>Zarządzanie Realizacjami</h1>
      <form onSubmit={handleCreate} className={styles.form}>
        <h2 className={styles.formHeader}>Dodaj nową realizację</h2>
        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}
        <div className={styles.formGroup}><label htmlFor="title">Tytuł</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="description">Opis</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="category">Kategoria</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)}><option>Fotowoltaika</option><option>Termomodernizacja</option><option>Wymiana Źródła Ciepła</option><option>Inne</option></select></div>
        <div className={styles.formGroup}><label htmlFor="images">Zdjęcia (max 10)</label><input id="images" type="file" multiple onChange={(e) => setImages(e.target.files)} required /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Dodaj realizację'}</button>
      </form>
      <hr className={styles.separator} />
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Realizacje</h2>
        {realizations.length > 0 ? (<ul>{/* ... */}</ul>) : (<p>Brak realizacji.</p>)}
      </div>
    </AdminLayout>
  );
}