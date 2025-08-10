// frontend/src/app/admin/realizacje/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig'; // ZMIANA
import AdminLayout from '../AdminLayout'; // ZMIANA
import styles from './AdminRealizacje.module.css';

export default function AdminRealizacjePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fotowoltaika');
  const [image, setImage] = useState(null);
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    if (!image) { setError("Zdjęcie jest wymagane!"); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);
    try {
      const response = await api.post('/api/realizations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRealizations([response.data, ...realizations]);
      setSuccess('Realizacja została dodana pomyślnie!');
      setTitle('');
      setDescription('');
      setCategory('Fotowoltaika');
      setImage(null);
      e.target.reset();
    } catch (err) { setError('Wystąpił błąd podczas dodawania realizacji.'); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę realizację?')) return;
    try {
      await api.delete(`/api/realizations/${id}`);
      setRealizations(realizations.filter(r => r._id !== id));
      setSuccess('Realizacja została usunięta.');
    } catch (err) { setError('Nie udało się usunąć realizacji.'); }
  };

  return (
    <AdminLayout>
      <h1 className={styles.header}>Zarządzanie Realizacjami</h1>
      <form onSubmit={handleCreate} className={styles.form}>
        <h2 className={styles.formHeader}>Dodaj nową realizację</h2>
        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}
        <div className={styles.formGroup}><label htmlFor="title">Tytuł</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="description">Opis</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="category">Kategoria</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)}><option>Fotowoltaika</option><option>Termomodernizacja</option><option>Wymiana Źródła Ciepła</option><option>Inne</option></select></div>
        <div className={styles.formGroup}><label htmlFor="image">Zdjęcie</label><input id="image" type="file" onChange={(e) => setImage(e.target.files[0])} required /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Dodaj realizację'}</button>
      </form>
      <hr className={styles.separator} />
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Realizacje</h2>
        {realizations.length > 0 ? (<ul className={styles.realizationList}>{realizations.map(realization => (<li key={realization._id} className={styles.realizationItem}><span>{realization.title}</span><button onClick={() => handleDelete(realization._id)} className={styles.deleteButton}>Usuń</button></li>))}</ul>) : (<p>Brak realizacji.</p>)}
      </div>
    </AdminLayout>
  );
}