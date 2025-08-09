// src/components/Counter.jsx
'use client';

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Counter = ({ stat, suffix, text }) => {
  const { ref, inView } = useInView({
    threshold: 0.5, // Uruchom animację, gdy 50% elementu jest widoczne
    triggerOnce: true, // Uruchom animację tylko raz
  });

  return (
    <div ref={ref} className="text-center">
      <h3 className="text-4xl md:text-5xl font-bold text-brand-green">
        {inView ? <CountUp end={stat} duration={2.5} /> : '0'}
        {suffix}
      </h3>
      <p className="text-gray-500 mt-2">{text}</p>
    </div>
  );
};

export default Counter;