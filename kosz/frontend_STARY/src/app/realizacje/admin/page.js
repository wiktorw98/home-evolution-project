// src/app/realizacje/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export default function RealizacjeAdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fotowoltaika');
  const [image, setImage] = useState(null);
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Musisz dodać plik obrazka!");
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
      await axios.post(`${BACKEND_URL}/api/realizations`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Realizacja została dodana pomyślnie!');
      setTitle('');
      setDescription('');
      setCategory('Fotowoltaika');
      setImage(null);
      e.target.reset();
      fetchRealizations();
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania realizacji.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę realizację?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/realizations/${id}`);
      setSuccess('Realizacja została usunięta.');
      setRealizations(realizations.filter(r => r._id !== id));
    } catch (err) {
      setError('Nie udało się usunąć realizacji.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Panel Zarządzania Realizacjami</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-4">Dodaj nową realizację</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</p>}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Tytuł</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Opis</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Kategoria</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
            <option>Fotowoltaika</option>
            <option>Ocieplenie Budynku</option>
            <option>Wymiana Kotłów</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Zdjęcie</label>
          <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" required />
        </div>
        <button type="submit" disabled={loading} className="bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400">
          {loading ? 'Dodawanie...' : 'Dodaj Realizację'}
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-bold mb-4">Istniejące Realizacje</h2>
        <div className="space-y-4">
          {realizations.length > 0 ? (
            realizations.map(realization => (
              <div key={realization._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <p className="font-bold">{realization.title}</p>
                <button onClick={() => handleDelete(realization._id)} className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600">
                  Usuń
                </button>
              </div>
            ))
          ) : (
            <p>Brak realizacji w bazie danych.</p>
          )}
        </div>
      </div>
    </div>
  );
}