// frontend/src/app/admin/AdminLayout.jsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <Link href="/admin"><h1>Panel Administratora</h1></Link>
        <button onClick={handleLogout} className={styles.logoutButton}>Wyloguj</button>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}