// frontend/src/components/SkeletonCard.jsx
import styles from './SkeletonCard.module.css';

export default function SkeletonCard({ type = 'realization' }) {
  // Domyślnie używamy stylu dla karty realizacji, ale możemy dodać inne w przyszłości
  const cardStyle = type === 'realization' ? styles.realizationCard : styles.blogCard;

  return (
    <div className={`${styles.skeletonCard} ${cardStyle}`}>
      <div className={styles.shimmerWrapper}>
        <div className={styles.shimmer}></div>
      </div>
    </div>
  );
}