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

function RealizationEditor({ realization, onClose, onUpdate }) {
  const [title, setTitle] = useState(realization.title);
  const [description, setDescription] = useState(realization.description);
  const [category, setCategory] = useState(realization.category);
  const [existingImages, setExistingImages] = useState(realization.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageDelete = (imageToDelete) => {
    setExistingImages(existingImages.filter(img => img !== imageToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (existingImages.length > 0) {
      existingImages.forEach(img => formData.append('existingImages', img));
    }
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      // ZMIANA: Usunięto ręczne ustawianie nagłówka
      const response = await api.put(`/api/realizations/${realization._id}`, formData);
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
          <div className={styles.formGroup}><label>Istniejące zdjęcia</label><div className={styles.imagePreviewGrid}>{existingImages.map(img => (<div key={img} className={styles.imagePreviewWrapper}><Image src={`${BACKEND_URL}/${img}`} alt="Miniatura" width={80} height={80} className={styles.imagePreview} /><button type="button" onClick={() => handleImageDelete(img)} className={styles.deleteImageButton}><FiX /></button></div>))}</div></div>
          <div className={styles.formGroup}><label>Dodaj nowe zdjęcia</label><input type="file" multiple onChange={(e) => setNewImages(e.target.files)} /></div>
          <div className={styles.modalActions}><button type="button" onClick={onClose} className={styles.cancelButton}>Anuluj</button><button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</button></div>
        </form>
      </div>
    </div>
  );
}

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
    formData.append('category', category);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    try {
      // ZMIANA: Usunięto ręczne ustawianie nagłówka
      const response = await api.post('/api/realizations', formData);
      setRealizations([response.data, ...realizations]);
      setSuccess('Realizacja została dodana pomyślnie!');
      setTitle(''); setDescription(''); setCategory('Fotowoltaika'); setImages([]); e.target.reset();
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
        <div className={styles.formGroup}><label htmlFor="images">Zdjęcia (max 10)</label><input id="images" type="file" multiple onChange={(e) => setImages(e.target.files)} required /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Dodaj realizację'}</button>
      </form>
      <hr className={styles.separator} />
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Realizacje</h2>
        {realizations.length > 0 ? (<ul className={styles.realizationList}>{realizations.map(realization => (<li key={realization._id} className={styles.realizationItem}><div className={styles.itemInfo}>{realization.images && realization.images[0] && <Image src={`${BACKEND_URL}/${realization.images[0]}`} alt="Miniatura" width={40} height={40} className={styles.itemThumbnail} />}<span>{realization.title}</span><span className={styles.imageCount}>({realization.images?.length || 0} zdjęć)</span></div><div className={styles.actionButtons}><button onClick={() => setEditingRealization(realization)} className={styles.editButton}>Edytuj</button><button onClick={() => handleDelete(realization._id)} className={styles.deleteButton}>Usuń</button></div></li>))}</ul>) : (<p>Brak realizacji.</p>)}
      </div>
    </AdminLayout>
  );
}