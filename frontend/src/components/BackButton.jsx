// frontend/src/components/BackButton.jsx
'use client';
import { useRouter } from 'next/navigation';
import styles from './BackButton.module.css';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton({ text = 'Wróć' }) {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={styles.backButton}>
      <FiArrowLeft />
      <span>{text}</span>
    </button>
  );
}