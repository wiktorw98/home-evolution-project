// frontend/src/app/admin/realizacje/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './AdminRealizacje.module.css';

// ===================================================================
// KOMPONENT 2: MODAL DO EDYCJI REALIZACJI
// ===================================================================
function RealizationEditor({ realization, onClose, onUpdate }) {
  const [title, setTitle] = useState(realization.title);
  const [description, setDescription] = useState(realization.description);
  const [category, setCategory] = useState(realization.category);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      const response = await api.put(`/api/realizations/${realization._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onUpdate(response.data);
      onClose();
    } catch (err) { alert('Błąd podczas aktualizacji.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.formHeader}>Edytuj Realizację</h2>
          <div className={styles.formGroup}><label>Tytuł</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className={styles.formGroup}><label>Opis</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
          <div className={styles.formGroup}><label>Kategoria</label><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Fotowoltaika</option><option>Termomodernizacja</option><option>Wymiana Źródła Ciepła</option><option>Inne</option></select></div>
          <div className={styles.formGroup}><label>Zmień zdjęcie (opcjonalnie)</label><input type="file" onChange={(e) => setImage(e.target.files[0])} /></div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Anuluj</button>
            <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// GŁÓWNY KOMPONENT STRONY
// ===================================================================
export default function AdminRealizacjePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fotowoltaika');
  const [image, setImage] = useState(null);
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
    if (!image) { setError("Zdjęcie jest wymagane!"); return; }
    setLoading(true);
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);
    try {
      const response = await api.post('/api/realizations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRealizations([response.data, ...realizations]);
      setSuccess('Realizacja została dodana pomyślnie!');
      setTitle(''); setDescription(''); setCategory('Fotowoltaika'); setImage(null); e.target.reset();
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

  const handleUpdate = (updatedRealization) => {
    setRealizations(realizations.map(r => r._id === updatedRealization._id ? updatedRealization : r));
    setSuccess('Realizacja zaktualizowana pomyślnie!');
  };

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
        <div className={styles.formGroup}><label htmlFor="image">Zdjęcie</label><input id="image" type="file" onChange={(e) => setImage(e.target.files[0])} required /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Dodaj realizację'}</button>
      </form>
      <hr className={styles.separator} />
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Realizacje</h2>
        {realizations.length > 0 ? (<ul className={styles.realizationList}>{realizations.map(realization => (<li key={realization._id} className={styles.realizationItem}><span>{realization.title}</span><div className={styles.actionButtons}><button onClick={() => setEditingRealization(realization)} className={styles.editButton}>Edytuj</button><button onClick={() => handleDelete(realization._id)} className={styles.deleteButton}>Usuń</button></div></li>))}</ul>) : (<p>Brak realizacji.</p>)}
      </div>
    </AdminLayout>
  );
}