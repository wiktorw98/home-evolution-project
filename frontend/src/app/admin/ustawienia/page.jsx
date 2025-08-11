// frontend/src/app/admin/ustawienia/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AdminLayout from '../AdminLayout';
import styles from './UstawieniaPage.module.css';

export default function UstawieniaPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Nowe hasła nie są identyczne.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Nowe hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.put('/api/users/change-password', { oldPassword, newPassword });
      setSuccess(response.data.message);
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className={styles.header}>Ustawienia Konta</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.formHeader}>Zmień hasło</h2>
        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}
        <div className={styles.formGroup}><label htmlFor="oldPassword">Stare hasło</label><input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="newPassword">Nowe hasło</label><input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
        <div className={styles.formGroup}><label htmlFor="confirmPassword">Potwierdź nowe hasło</label><input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Zapisywanie...' : 'Zmień hasło'}</button>
      </form>
    </AdminLayout>
  );
}