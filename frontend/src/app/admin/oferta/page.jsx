// frontend/src/app/admin/oferta/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './AdminOferta.module.css';

function OfferCreator({ onOfferCreated }) {
  const [serviceId, setServiceId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { setError('Zdjęcie jest wymagane!'); return; }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('serviceId', serviceId.toLowerCase().replace(/\s+/g, '-'));
    formData.append('title', title);
    formData.append('description', description);
    benefits.split('\n').forEach(b => formData.append('benefits[]', b.trim()));
    formData.append('image', image);

    try {
      // ZMIANA: Usunięto ręczne ustawianie nagłówka
      const response = await api.post('/api/offers', formData);
      alert('Nowa oferta została dodana!');
      onOfferCreated(response.data);
      e.target.reset();
      setServiceId(''); setTitle(''); setDescription(''); setBenefits(''); setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd serwera.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.editorForm} ${styles.creatorForm}`}>
      <h2 className={styles.formHeader}>Dodaj nową usługę do oferty</h2>
      {error && <p className={styles.messageError}>{error}</p>}
      <div className={styles.formGroup}><label htmlFor="new-serviceId">ID Usługi (np. "wymiana-okien")</label><input id="new-serviceId" type="text" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required /></div>
      <div className={styles.formGroup}><label htmlFor="new-title">Tytuł</label><input id="new-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      <div className={styles.formGroup}><label htmlFor="new-desc">Opis</label><textarea id="new-desc" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
      <div className={styles.formGroup}><label htmlFor="new-benefits">Korzyści (każda w nowej linii)</label><textarea id="new-benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} required /></div>
      <div className={styles.formGroup}><label htmlFor="new-image">Zdjęcie</label><input id="new-image" type="file" onChange={(e) => setImage(e.target.files[0])} required /></div>
      <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Dodawanie...' : 'Dodaj nową ofertę'}</button>
    </form>
  );
}

function OfferEditor({ offer, onUpdate }) {
  const [title, setTitle] = useState(offer.title);
  const [description, setDescription] = useState(offer.description);
  const [benefits, setBenefits] = useState(offer.benefits.join('\n'));
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    benefits.split('\n').forEach(b => formData.append('benefits[]', b.trim()));
    if (image) formData.append('image', image);
    try {
      // ZMIANA: Usunięto ręczne ustawianie nagłówka
      const response = await api.put(`/api/offers/${offer.serviceId}`, formData);
      alert('Oferta zaktualizowana pomyślnie!');
      onUpdate(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd serwera.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editorForm}>
      <h3 className={styles.editorHeader}>Edytuj: {offer.title}</h3>
      {error && <p className={styles.messageError}>{error}</p>}
      <div className={styles.formGroup}><label htmlFor={`title-${offer.serviceId}`}>Tytuł</label><input id={`title-${offer.serviceId}`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className={styles.formGroup}><label htmlFor={`desc-${offer.serviceId}`}>Opis</label><textarea id={`desc-${offer.serviceId}`} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className={styles.formGroup}><label htmlFor={`benefits-${offer.serviceId}`}>Korzyści</label><textarea id={`benefits-${offer.serviceId}`} value={benefits} onChange={(e) => setBenefits(e.target.value)} /></div>
      <div className={styles.formGroup}><label htmlFor={`image-${offer.serviceId}`}>Zmień zdjęcie (opcjonalnie)</label><input id={`image-${offer.serviceId}`} type="file" onChange={(e) => setImage(e.target.files[0])} /></div>
      <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</button>
    </form>
  );
}

export default function AdminOfertaPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    api.get('/api/offers')
      .then(response => { setOffers(response.data); setLoading(false); })
      .catch(error => { console.error("Błąd pobierania ofert:", error); setLoading(false); });
  }, []);

  const handleOfferUpdate = (updatedOffer) => {
    setOffers(offers.map(o => o.serviceId === updatedOffer.serviceId ? updatedOffer : o));
  };

  const handleOfferCreated = (newOffer) => {
    setOffers([...offers, newOffer]);
  };

  if (loading) return <AdminLayout><p>Ładowanie panelu...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className={styles.header}>Zarządzanie Ofertą</h1>
      <OfferCreator onOfferCreated={handleOfferCreated} />
      <hr className={styles.separator} />
      <h2 className={styles.listHeader}>Edytuj istniejące oferty</h2>
      {offers.map(offer => (<OfferEditor key={offer.serviceId} offer={offer} onUpdate={handleOfferUpdate} />))}
    </AdminLayout>
  );
}