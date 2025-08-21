// frontend/src/components/Counter.jsx
'use client';

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import styles from './Counter.module.css';

export default function Counter({ stat, suffix, text }) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={styles.counterWrapper}>
      <h3 className={styles.stat}>
        {inView ? <CountUp end={stat} duration={2.5} /> : '0'}
        {suffix}
      </h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
} 