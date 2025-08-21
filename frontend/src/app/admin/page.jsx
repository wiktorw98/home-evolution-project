// frontend/src/app/admin/page.jsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}><Link href="/admin"><h1>Panel Administratora</h1></Link><button onClick={handleLogout} className={styles.logoutButton}>Wyloguj</button></header>
      <main className={styles.mainContent}>
        <h2>Witaj w panelu zarządzania!</h2>
        <p>Wybierz sekcję, którą chcesz edytować:</p>
        <div className={styles.navGrid}>
          {/* ZMIANA: Usunięto link do zarządzania ofertą */}
          <Link href="/admin/realizacje" className={styles.navCard}><h3>Zarządzaj Realizacjami</h3><p>Dodawaj i usuwaj zdjęcia z portfolio.</p></Link>
          <Link href="/admin/blog" className={styles.navCard}><h3>Zarządzaj Blogiem</h3><p>Twórz i usuwaj wpisy na blogu.</p></Link>
          <Link href="/admin/ustawienia" className={`${styles.navCard} ${styles.settingsCard}`}><h3>Ustawienia Konta</h3><p>Zmień swoje hasło i zarządzaj kontem.</p></Link>
        </div>
      </main>
    </div>
  );
}