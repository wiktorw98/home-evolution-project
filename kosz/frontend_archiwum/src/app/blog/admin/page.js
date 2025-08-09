// src/app/blog/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export default function BlogAdminPage() {
  // Stan dla pól formularza
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Stan dla listy istniejących postów
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Funkcja do pobierania istniejących postów
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/posts`);
      setPosts(response.data);
    } catch (err) {
      setError("Nie udało się załadować listy postów.");
    }
  };

  // Pobierz posty przy pierwszym załadowaniu strony
  useEffect(() => {
    fetchPosts();
  }, []);

  // Funkcja obsługująca wysłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Wysyłamy zwykły obiekt JSON, bo nie ma plików
      await axios.post(`${BACKEND_URL}/api/posts`, { title, content });
      setSuccess('Post został dodany pomyślnie!');
      // Wyczyść formularz
      setTitle('');
      setContent('');
      // Odśwież listę
      fetchPosts();
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania posta.');
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do usuwania posta
  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten post?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/posts/${id}`);
      setSuccess('Post został usunięty.');
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      setError('Nie udało się usunąć posta.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Panel Zarządzania Blogiem</h1>

      {/* === FORMULARZ DODAWANIA === */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-4">Dodaj nowy post</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</p>}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Tytuł</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Treść</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-40" required />
        </div>
        <button type="submit" disabled={loading} className="bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400">
          {loading ? 'Dodawanie...' : 'Dodaj Post'}
        </button>
      </form>

      {/* === LISTA ISTNIEJĄCYCH POSTÓW === */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Istniejące Posty</h2>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <p className="font-bold">{post.title}</p>
                <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600">
                  Usuń
                </button>
              </div>
            ))
          ) : (
            <p>Brak postów w bazie danych.</p>
          )}
        </div>
      </div>
    </div>
  );
}