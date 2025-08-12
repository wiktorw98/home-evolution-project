// frontend/src/app/oferta/OfertaPageClient.jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsCheckCircleFill } from 'react-icons/bs';
import pageStyles from '../Subpage.module.css';
import offerStyles from './OfertaPage.module.css';

// ZMIANA: Zmieniono kolejność ofert zgodnie z Twoją prośbą
const offersData = [
  { 
    serviceId: "dotacje", 
    title: "Pozyskiwanie Dotacji", 
    description: "Nie wiesz, jak skorzystać z programów 'Czyste Powietrze' czy 'Mój Prąd'? Nasz zespół ekspertów przeprowadzi Cię przez cały proces – od audytu, przez przygotowanie wniosku, aż po finalne rozliczenie. Maksymalizujemy Twoje szanse na uzyskanie wsparcia.",
    benefits: ["Kompleksowa obsługa wniosków o dofinansowanie", "Analiza dostępnych programów i wybór najlepszego", "Gwarancja poprawności formalnej dokumentacji", "Oszczędność Twojego czasu i nerwów"], 
    imageUrl: "/oferta-dotacje.jpg"
  },
  { 
    serviceId: "fotowoltaika", 
    title: "Panele Fotowoltaiczne", 
    description: "Inwestycja w fotowoltaikę to krok w stronę niezależności energetycznej i znacznych oszczędności. Produkuj własny, darmowy prąd ze słońca, dbając jednocześnie o środowisko.",
    benefits: ["Obniżenie rachunków za prąd nawet o 90%", "Niezależność od podwyżek cen energii", "Zwiększenie wartości nieruchomości", "Rozwiązanie ekologiczne i bezobsługowe"], 
    imageUrl: "/oferta-fotowoltaika.jpg"
  },
  { 
    serviceId: "magazyny-energii", 
    title: "Magazyny Energii", 
    description: "Zwiększ swoją niezależność i bezpieczeństwo energetyczne. Magazyn energii pozwala na przechowywanie nadwyżek prądu wyprodukowanego przez Twoją instalację fotowoltaiczną i wykorzystywanie go wtedy, gdy jest najbardziej potrzebny – w nocy, w pochmurne dni lub podczas awarii sieci.",
    benefits: ["Maksymalne wykorzystanie własnej energii", "Zabezpieczenie przed przerwami w dostawie prądu", "Dalsze obniżenie rachunków za energię", "Zwiększenie autokonsumpcji do ponad 70%"], 
    imageUrl: "/oferta-magazyny.jpg"
  },
  { 
    serviceId: "kotly", 
    title: "Wymiana Źródeł Ciepła", 
    description: "Wymień stary, nieefektywny kocioł na nowoczesne, ekologiczne źródło ciepła. Oferujemy kompleksowe doradztwo i montaż pomp ciepła, kotłów gazowych oraz kotłów na pellet.",
    benefits: ["Znaczne obniżenie kosztów ogrzewania", "Spełnienie norm ekologicznych i uniknięcie kar", "Wygoda i bezpieczeństwo użytkowania", "Możliwość uzyskania dofinansowania"], 
    imageUrl: "/oferta-kotly.jpg"
  },
  { 
    serviceId: "ocieplenie", 
    title: "Ocieplenie i Termomodernizacja", 
    description: "Prawidłowo wykonana termoizolacja budynku to klucz do komfortu cieplnego przez cały rok i niższych kosztów ogrzewania. Używamy tylko sprawdzonych materiałów, gwarantując najwyższą jakość.",
    benefits: ["Redukcja strat ciepła zimą do 30%", "Ochrona przed upałami latem", "Poprawa estetyki i odświeżenie elewacji", "Zabezpieczenie konstrukcji budynku"], 
    imageUrl: "/oferta-ocieplenie.jpg"
  },
  { 
    serviceId: "uslugi-budowlane", 
    title: "Usługi Ogólnobudowlane", 
    description: "Poza specjalizacją w OZE, oferujemy szeroki zakres usług ogólnobudowlanych. Niezależnie od tego, czy planujesz remont, adaptację poddasza czy kompleksowe wykończenie wnętrz, nasz doświadczony zespół gwarantuje najwyższą jakość wykonania i terminowość.",
    benefits: ["Kompleksowa realizacja od A do Z", "Doświadczona i sprawdzona ekipa budowlana", "Doradztwo w zakresie materiałów i technologii", "Gwarancja jakości i dbałość o detale"], 
    imageUrl: "/oferta-budowlane.jpg"
  }
];

export default function OfertaPageClient() {
  return (
    <div>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.container}><h1>Nasza Oferta</h1><p>Poznaj szczegóły naszych kompleksowych usług.</p></div>
      </header>
      <main className={offerStyles.mainContent}>
        <div className={pageStyles.container}>
          <div className={offerStyles.offerList}>
            {offersData.map((service, index) => (
              <Link key={service.serviceId} href={`/kontakt?zainteresowanie=${encodeURIComponent(service.title)}`} className={offerStyles.cardLink}>
                <motion.section id={service.serviceId} className={`${offerStyles.offerCard} ${index % 2 !== 0 ? offerStyles.reverse : ''}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: 'easeOut' }} whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(45, 55, 72, 0.1)' }}>
                  <div className={offerStyles.offerImage}><Image src={service.imageUrl} alt={service.title} fill sizes="(max-width: 768px) 90vw, 40vw" className={offerStyles.image} /></div>
                  <div className={offerStyles.offerContent}>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <ul>{service.benefits.map((benefit, i) => (<li key={i}><BsCheckCircleFill className={offerStyles.benefitIcon} /><span>{benefit}</span></li>))}</ul>
                  </div>
                </motion.section>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}