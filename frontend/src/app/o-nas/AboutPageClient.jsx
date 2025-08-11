// frontend/src/app/o-nas/AboutPageClient.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import pageStyles from '../Subpage.module.css';
import styles from './AboutPage.module.css';
import Counter from '../../components/Counter';

export default function AboutPageClient() {
  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}>
          <h1>Pasja, Doświadczenie, Rozwój</h1>
          <p>Poznaj historię i wartości, które napędzają Home Evolution.</p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <div className={pageStyles.container}>
            <div className={styles.grid}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <h2 className={styles.sectionTitle}>Nasza Misja</h2>
                <p className={styles.sectionText}>W Home Evolution wierzymy, że przyszłość energetyki leży w czystych, odnawialnych źródłach. Naszą misją jest dostarczanie klientom indywidualnym i biznesowym kompleksowych, niezawodnych i dopasowanych do ich potrzeb rozwiązań z zakresu OZE. Chcemy, aby każdy dom mógł stać się małą, samowystarczalną elektrownią, która nie tylko generuje oszczędności, ale także dba o naszą planetę.</p>
              </motion.div>
              <motion.div className={styles.imageWrapper} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <Image src="/misja.jpg" alt="Nasza misja" fill className={styles.image} />
              </motion.div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.statsSection}`}>
          <div className={pageStyles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.centeredHeader}`}>Home Evolution w Liczbach</h2>
            <div className={styles.statsGrid}>
              <Counter stat={3} suffix="+" text="Lat doświadczenia w branży" />
              <Counter stat={200} suffix="+" text="Zrealizowanych instalacji" />
              <Counter stat={100} suffix="%" text="Zadowolonych klientów" />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={pageStyles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.centeredHeader}`}>Dlaczego Warto Nam Zaufać?</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}><h3>Doświadczenie</h3><p className={styles.sectionText}>Nasz zespół to certyfikowani specjaliści z wieloletnim doświadczeniem.</p></div>
              <div className={styles.valueCard}><h3>Jakość</h3><p className={styles.sectionText}>Pracujemy tylko na sprawdzonych komponentach od wiodących producentów.</p></div>
              <div className={styles.valueCard}><h3>Wsparcie</h3><p className={styles.sectionText}>Zapewniamy pełne wsparcie na każdym etapie – od audytu po pomoc w uzyskaniu dotacji.</p></div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.ctaSection}`}>
          <div className={pageStyles.container}>
            {/* ZMIANA: Przywracamy oryginalne, sprawdzone klasy */}
            <h2 className={`${styles.sectionTitle} ${styles.centeredHeader}`}>Gotów na ewolucję swojego domu?</h2>
            <p className={`${styles.sectionText} ${styles.centeredText}`}>Dołącz do grona naszych zadowolonych klientów i zacznij oszczędzać na rachunkach już dziś.</p>
            <Link href="/kontakt" className={styles.ctaButton}>Skontaktuj się z nami</Link>
          </div>
        </section>
      </main>
    </div>
  );
}