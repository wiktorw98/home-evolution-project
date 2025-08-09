// src/app/oferta/page.js
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'; // Używamy zoptymalizowanego komponentu Image z Next.js

// === MIEJSCE, GDZIE EDYTUJESZ TREŚĆ ===
// W tym miejscu możesz łatwo zmieniać opisy, tytuły i ścieżki do zdjęć.
const servicesData = [
  {
    id: "fotowoltaika", // WAŻNE: To ID musi pasować do linku na stronie głównej
    title: "Panele Fotowoltaiczne",
    description: "Inwestycja w fotowoltaikę to krok w stronę niezależności energetycznej i znacznych oszczędności. Produkuj własny, darmowy prąd ze słońca, dbając jednocześnie o środowisko.",
    benefits: [
      "Obniżenie rachunków za prąd nawet o 90%",
      "Niezależność od podwyżek cen energii",
      "Zwiększenie wartości nieruchomości",
      "Rozwiązanie ekologiczne i bezobsługowe"
    ],
    imageUrl: "/assets/oferta-fotowoltaika.jpg" // Ścieżka do zdjęcia w folderze /public
  },
  {
    id: "ocieplenie",
    title: "Ocieplenie i Termomodernizacja",
    description: "Prawidłowo wykonana termoizolacja budynku to klucz do komfortu cieplnego przez cały rok i niższych kosztów ogrzewania. Używamy tylko sprawdzonych materiałów, gwarantując najwyższą jakość.",
    benefits: [
      "Redukcja strat ciepła zimą do 30%",
      "Ochrona przed upałami latem",
      "Poprawa estetyki i odświeżenie elewacji",
      "Zabezpieczenie konstrukcji budynku"
    ],
    imageUrl: "/assets/oferta-ocieplenie.jpg"
  },
  {
    id: "kotly",
    title: "Wymiana Kotłów i Modernizacja Instalacji",
    description: "Wymień stary, nieefektywny kocioł na nowoczesne, ekologiczne źródło ciepła. Oferujemy kompleksowe doradztwo i montaż pomp ciepła, kotłów gazowych oraz kotłów na pellet.",
    benefits: [
      "Znaczne obniżenie kosztów ogrzewania",
      "Spełnienie norm ekologicznych i uniknięcie kar",
      "Wygoda i bezpieczeństwo użytkowania",
      "Możliwość uzyskania dofinansowania"
    ],
    imageUrl: "/assets/oferta-kotly.jpg"
  }
];

// Główny komponent strony
export default function OfertaPage() {
  return (
    <div className="bg-white">
      {/* Nagłówek strony */}
      <header className="bg-brand-green-light py-12">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-brand-dark"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nasza Oferta
          </motion.h1>
          <motion.p 
            className="mt-2 text-lg text-gray-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Poznaj szczegóły naszych kompleksowych usług.
          </motion.p>
        </div>
      </header>

      {/* Sekcje z usługami */}
      <main className="container mx-auto px-6 py-16">
        <div className="space-y-20">
          {servicesData.map((service, index) => (
            <motion.section
              key={service.id}
              id={service.id} // To jest "kotwica" dla linków ze strony głównej
              className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Obrazek */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover"
                />
              </div>

              {/* Treść */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <h2 className="text-3xl font-bold text-brand-dark mb-4">{service.title}</h2>
                <p className="text-gray-700 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-brand-green font-bold mr-2">✔</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
}