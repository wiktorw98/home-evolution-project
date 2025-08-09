'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Counter from '@/components/Counter';
import { FaSolarPanel, FaHome, FaFire } from 'react-icons/fa';

export default function Home() {
  return (
    <main>
      {/* === SEKCJA HERO === */}
      <section className="relative text-center py-24 md:py-40 bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div className="relative container mx-auto px-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Nowoczesna Energia, Lepszy Dom
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Zainwestuj w komfort, oszczędności i ekologię z Home Evolution. Oferujemy kompleksowe rozwiązania OZE i termomodernizacji.
          </p>
          <Link href="/kontakt" className="mt-10 inline-block bg-accent text-white font-bold py-4 px-10 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
            Uzyskaj Bezpłatną Wycenę
          </Link>
        </motion.div>
      </section>

      {/* === SEKCJA STATYSTYK === */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Counter stat={500} suffix="+" text="Zrealizowanych projektów" />
            <Counter stat={98} suffix="%" text="Zadowolonych klientów" />
            <Counter stat={10} suffix="+" text="Lat doświadczenia" />
          </div>
        </div>
      </section>

      {/* === SEKCJA USŁUG === */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-primary">Nasze Kluczowe Usługi</h2>
            <p className="mt-4 text-lg text-text-light max-w-2xl mx-auto">Od projektu po realizację – zapewniamy kompleksową obsługę na każdym etapie.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaSolarPanel, title: "Fotowoltaika", desc: "Produkuj własny prąd, obniż rachunki i chroń środowisko.", link: "/oferta#fotowoltaika" },
              { icon: FaHome, title: "Termomodernizacja", desc: "Zwiększ efektywność energetyczną i komfort cieplny swojego domu.", link: "/oferta#ocieplenie" },
              { icon: FaFire, title: "Wymiana Źródeł Ciepła", desc: "Wymień stary kocioł na nowoczesne, ekologiczne i oszczędne rozwiązanie.", link: "/oferta#kotly" }
            ].map((service, index) => (
              <motion.div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <service.icon className="text-5xl text-accent mb-5" />
                <h3 className="text-2xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-text-light mb-6">{service.desc}</p>
                <Link href={service.link} className="font-bold text-accent hover:underline">
                  Zobacz szczegóły &rarr;
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === SEKCJA CTA === */}
      <section className="bg-primary text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold">Gotowy na Ewolucję Swojego Domu?</h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Skontaktuj się z nami już dziś. Nasi doradcy przygotują dla Ciebie spersonalizowaną ofertę całkowicie za darmo.
          </p>
          <Link href="/kontakt" className="mt-10 inline-block bg-accent text-white font-bold py-4 px-10 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
            Porozmawiajmy o Projekcie
          </Link>
        </div>
      </section>
    </main>
  );
}