// frontend/src/app/login/page.jsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      router.push('/admin');
    } catch (err) {
      setError('Błędna nazwa użytkownika lub hasło.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Panel Administratora</h1>
        <p>Zaloguj się, aby zarządzać treścią</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}><label htmlFor="username">Nazwa użytkownika</label><input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
          <div className={styles.formGroup}><label htmlFor="password">Hasło</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>Zaloguj się</button>
        </form>
      </div>
    </div>
  );
}