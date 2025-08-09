'use client';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import styles from './Counter.module.css';

export default function Counter({ stat, suffix, text }) {
  // Hook useInView sprawdza, czy element jest widoczny na ekranie
  const { ref, inView } = useInView({
    threshold: 0.5, // Uruchom, gdy 50% elementu jest widoczne
    triggerOnce: true, // Uruchom animację tylko raz
  });

  return (
    <div ref={ref} className={styles.counterWrapper}>
      <h3 className={styles.stat}>
        {/* Jeśli element jest widoczny, uruchom animację CountUp */}
        {inView ? <CountUp end={stat} duration={2.5} /> : '0'}
        {suffix}
      </h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
};