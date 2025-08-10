'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminOferta.module.css'; // Upewnij się, że masz ten plik stylów

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ===================================================================
// KOMPONENT 1: Formularz do TWORZENIA nowej oferty
// ===================================================================
function OfferCreator({ onOfferCreated }) {
  const [serviceId, setServiceId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !serviceId) {
      alert('ID Usługi oraz zdjęcie są wymagane!');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('serviceId', serviceId.toLowerCase().replace(/\s+/g, '-'));
    formData.append('title', title);
    formData.append('description', description);
    benefits.split('\n').forEach(b => formData.append('benefits[]', b));
    formData.append('image', image);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/offers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Nowa oferta została dodana!');
      onOfferCreated(response.data);
      // Resetowanie formularza
      setServiceId('');
      setTitle('');
      setDescription('');
      setBenefits('');
      setImage(null);
      e.target.reset();
    } catch (error) {
      alert(`Wystąpił błąd: ${error.response?.data?.message || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editorForm} style={{ backgroundColor: '#e9f5e9' }}>
      <h3 className={styles.editorHeader}>Dodaj nową usługę do oferty</h3>
      
      <div className={styles.formGroup}>
        <label htmlFor="new-serviceId">ID Usługi (np. "wymiana-okien", tylko małe litery, bez spacji)</label>
        <input id="new-serviceId" type="text" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={styles.formInput} required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="new-title">Tytuł</label>
        <input id="new-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.formInput} required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="new-desc">Opis</label>
        <textarea id="new-desc" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.formTextarea} required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="new-benefits">Korzyści (każda w nowej linii)</label>
        <textarea id="new-benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} className={styles.formTextarea} required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="new-image">Zdjęcie (wymagane)</label>
        <input id="new-image" type="file" onChange={(e) => setImage(e.target.files[0])} className={styles.formInput} required />
      </div>
      
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Dodawanie...' : 'Dodaj nową ofertę'}
      </button>
    </form>
  );
}


// ===================================================================
// KOMPONENT 2: Formularz do EDYCJI istniejącej oferty
// ===================================================================
function OfferEditor({ offer, onUpdate }) {
  const [title, setTitle] = useState(offer.title);
  const [description, setDescription] = useState(offer.description);
  const [benefits, setBenefits] = useState(offer.benefits.join('\n'));
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    benefits.split('\n').forEach(b => formData.append('benefits[]', b));
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/api/offers/${offer.serviceId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Oferta zaktualizowana pomyślnie!');
      onUpdate(response.data);
    } catch (error) {
      alert('Wystąpił błąd podczas aktualizacji.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editorForm}>
      <h3 className={styles.editorHeader}>Edytuj: {offer.title}</h3>
      
      <div className={styles.formGroup}>
        <label htmlFor={`title-${offer.serviceId}`}>Tytuł</label>
        <input id={`title-${offer.serviceId}`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.formInput} />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor={`desc-${offer.serviceId}`}>Opis</label>
        <textarea id={`desc-${offer.serviceId}`} value={description} onChange={(e) => setDescription(e.target.value)} className={styles.formTextarea} />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor={`benefits-${offer.serviceId}`}>Korzyści (każda w nowej linii)</label>
        <textarea id={`benefits-${offer.serviceId}`} value={benefits} onChange={(e) => setBenefits(e.target.value)} className={styles.formTextarea} />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor={`image-${offer.serviceId}`}>Zmień zdjęcie (opcjonalnie)</label>
        <input id={`image-${offer.serviceId}`} type="file" onChange={(e) => setImage(e.target.files[0])} className={styles.formInput} />
      </div>
      
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
      </button>
    </form>
  );
}


// ===================================================================
// GŁÓWNY KOMPONENT STRONY ADMINA
// ===================================================================
export default function AdminOfertaPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/offers`)
      .then(response => {
        setOffers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Błąd pobierania ofert:", error);
        setLoading(false);
      });
  }, []);

  const handleOfferUpdate = (updatedOffer) => {
    setOffers(offers.map(o => o.serviceId === updatedOffer.serviceId ? updatedOffer : o));
  };

  const handleOfferCreated = (newOffer) => {
    setOffers([...offers, newOffer]);
  };

  if (loading) return <p className={styles.loadingText}>Ładowanie panelu...</p>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.header}>Panel Zarządzania Ofertą</h1>
        
        <OfferCreator onOfferCreated={handleOfferCreated} />

        <hr style={{ margin: '60px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '30px' }}>Edytuj istniejące oferty</h2>
        
        {offers.map(offer => (
          <OfferEditor key={offer.serviceId} offer={offer} onUpdate={handleOfferUpdate} />
        ))}
      </div>
    </div>
  );
}