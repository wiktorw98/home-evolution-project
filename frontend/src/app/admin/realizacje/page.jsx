'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './AdminRealizacje.module.css';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ALL_CATEGORIES = [
  'Fotowoltaika', 
  'Termomodernizacja', 
  'Wymiana Źródła Ciepła', 
  'Docieplenie', 
  'Piec', 
  'Wykończenie', 
  'Inne'
];

function CategoryCheckboxes({ selected, onChange }) {
  const handleCategoryChange = (category) => {
    const isSelected = selected.includes(category);
    if (isSelected) {
      onChange(selected.filter(c => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className={styles.checkboxGrid}>
      {ALL_CATEGORIES.map(category => (
        <div key={category} className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id={`cat-${category}-${Math.random()}`} // Używamy Math.random() aby uniknąć konfliktu ID
            value={category}
            checked={selected.includes(category)}
            onChange={() => handleCategoryChange(category)}
          />
          <label htmlFor={`cat-${category}-${Math.random()}`}>{category}</label>
        </div>
      ))}
    </div>
  );
}

function RealizationEditor({ realization, onClose, onUpdate }) {
  const [title, setTitle] = useState(realization.title);
  const [description, setDescription] = useState(realization.description);
  const [categories, setCategories] = useState(realization.category || []);
  const [existingImages, setExistingImages] = useState(realization.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${BACKEND_URL}/${imagePath}`;
  };

  const handleImageDelete = (imageToDelete) => {
    setExistingImages(existingImages.filter(img => img !== imageToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    if (categories.length > 0) {
      categories.forEach(cat => formData.append('category', cat));
    }
    
    existingImages.forEach(img => formData.append('existingImages', img));
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      const response = await api.post(`/api/realizations/update/${realization._id}`, formData);
      onUpdate(response.data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Błąd podczas aktualizacji realizacji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.formHeader}>Edytuj Realizację</h2>
          <div className={styles.formGroup}>
            <label>Tytuł</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Opis</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Kategorie</label>
            <CategoryCheckboxes selected={categories} onChange={setCategories} />
          </div>
          <div className={styles.formGroup}>
            <label>Istniejące zdjęcia</label>
            <div className={styles.imagePreviewGrid}>
              {existingImages.map(img => (
                <div key={img} className={styles.imagePreviewWrapper}>
                  <Image src={getImageUrl(img)} alt="Miniatura" width={80} height={80} className={styles.imagePreview} />
                  <button type="button" onClick={() => handleImageDelete(img)} className={styles.deleteImageButton}><FiX /></button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Dodaj nowe zdjęcia</label>
            <input type="file" multiple onChange={(e) => setNewImages(e.target.files)} />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Anuluj</button>
            <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminRealizacjePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    if (editingRealization) {
      document.body.classList.add(styles.bodyModalOpen);
    } else {
      document.body.classList.remove(styles.bodyModalOpen);
    }
    return () => {
      document.body.classList.remove(styles.bodyModalOpen);
    };
  }, [editingRealization]);

  const fetchRealizations = async () => {
    try {
      const response = await api.get('/api/realizations?limit=100');
      setRealizations(response.data.realizations || []);
    } catch (err) { setError("Nie udało się załadować listy realizacji."); }
  };

  useEffect(() => { fetchRealizations(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (images.length === 0) { setError("Co najmniej jedno zdjęcie jest wymagane!"); return; }
    if (categories.length === 0) { setError("Wybierz co najmniej jedną kategorię!"); return; }
    
    setLoading(true);
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    categories.forEach(cat => formData.append('category', cat));

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    try {
      await api.post('/api/realizations', formData);
      await fetchRealizations();
      setSuccess('Realizacja została dodana pomyślnie!');
      setTitle(''); setDescription(''); setCategories([]); setImages([]); e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd podczas dodawania realizacji.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę realizację?')) return;
    try {
        await api.delete(`/api/realizations/${id}`);
        await fetchRealizations();
        setSuccess('Realizacja została usunięta.');
    } catch (err) {
        setError('Nie udało się usunąć realizacji.');
    }
  };

  const handleUpdate = (updatedRealization) => {
    setRealizations(realizations.map(r => r._id === updatedRealization._id ? updatedRealization : r));
    setSuccess('Realizacja zaktualizowana pomyślnie!');
  };
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    return `${BACKEND_URL}/${imagePath}`;
  };

  return (
    <AdminLayout>
      {editingRealization && <RealizationEditor realization={editingRealization} onClose={() => setEditingRealization(null)} onUpdate={handleUpdate} />}
      
      <h1 className={styles.header}>Zarządzanie Realizacjami</h1>
      
      <form onSubmit={handleCreate} className={styles.form}>
        <h2 className={styles.formHeader}>Dodaj nową realizację</h2>
        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="title">Tytuł</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Opis</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Kategorie</label>
          <CategoryCheckboxes selected={categories} onChange={setCategories} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="images">Zdjęcia (max 10)</label>
          <input id="images" type="file" multiple onChange={(e) => setImages(e.target.files)} required />
        </div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Dodaj realizację'}</button>
      </form>
      
      <hr className={styles.separator} />
      
      <div className={styles.listContainer}>
        <h2 className={styles.listHeader}>Istniejące Realizacje</h2>
        {realizations.length > 0 ? (
            <ul className={styles.realizationList}>
                {realizations.map(item => (
                    <li key={item._id} className={styles.realizationItem}>
                        <div className={styles.itemInfo}>
                            <Image src={getImageUrl(item.images[0])} alt="Miniatura" width={60} height={40} className={styles.itemThumbnail} />
                            <div>
                                <span>{item.title}</span>
                                <div className={styles.imageCount}>Zdjęć: {item.images.length}</div>
                            </div>
                        </div>
                        <div className={styles.actionButtons}>
                            <button onClick={() => setEditingRealization(item)} className={styles.editButton} disabled={loading}>Edytuj</button>
                            <button onClick={() => handleDelete(item._id)} className={styles.deleteButton} disabled={loading}>Usuń</button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (<p>Brak realizacji.</p>)}
      </div>
    </AdminLayout>
  );
}