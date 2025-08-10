// frontend/src/app/admin/realizacje/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminRealizacje.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AdminRealizacjePage() {
  // Stany dla formularza tworzenia
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fotowoltaika');
  const [image, setImage] = useState(null);
  
  // Stany dla listy i komunikatów
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pobieranie istniejących realizacji
  const fetchRealizations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/realizations`);
      setRealizations(response.data);
    } catch (err) {
      setError("Nie udało się załadować listy realizacji.");
    }
  };

  useEffect(() => {
    fetchRealizations();
  }, []);

  // Obsługa tworzenia nowej realizacji
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Zdjęcie jest wymagane!");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/realizations`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRealizations([response.data, ...realizations]); // Dodaj nową na początek listy
      setSuccess('Realizacja została dodana pomyślnie!');
      // Resetowanie formularza
      setTitle('');
      setDescription('');
      setCategory('Fotowoltaika');
      setImage(null);
      e.target.reset();
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania realizacji.');
    } finally {
      setLoading(false);
    }
  };

  // Obsługa usuwania realizacji
  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę realizację? Ta operacja jest nieodwracalna.')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/realizations/${id}`);
      setRealizations(realizations.filter(r => r._id !== id)); // Usuń z listy
      setSuccess('Realizacja została usunięta.');
    } catch (err) {
      setError('Nie udało się usunąć realizacji.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.header}>Panel Zarządzania Realizacjami</h1>

        {/* FORMULARZ DODAWANIA */}
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
            <label htmlFor="category">Kategoria</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Fotowoltaika</option>
              <option>Termomodernizacja</option>
              <option>Wymiana Źródła Ciepła</option>
              <option>Inne</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Zdjęcie (wymagane)</label>
            <input id="image" type="file" onChange={(e) => setImage(e.target.files[0])} required />
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Dodawanie...' : 'Dodaj realizację'}
          </button>
        </form>

        <hr className={styles.separator} />

        {/* LISTA ISTNIEJĄCYCH REALIZACJI */}
        <div className={styles.listContainer}>
          <h2 className={styles.listHeader}>Istniejące Realizacje</h2>
          {realizations.length > 0 ? (
            <ul className={styles.realizationList}>
              {realizations.map(realization => (
                <li key={realization._id} className={styles.realizationItem}>
                  <span>{realization.title}</span>
                  <button onClick={() => handleDelete(realization._id)} className={styles.deleteButton}>Usuń</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak realizacji w bazie danych.</p>
          )}
        </div>
      </div>
    </div>
  );
}