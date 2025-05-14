/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import FeatureCard from '../../components/FeatureCard';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FeaturedSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  const features = [
    {
      image: 'https://placehold.co/600x400/?text=Menu',
      title: '📖 Herkullinen ja suosittu menu',
      description:
        'Tutustu herkulliseen ja suosittuun à la carte -menuumme. Jokainen annos valmistetaan huolella ja rakkaudella laadukkaista raaka-aineista.',
      buttonText: 'Katso menu',
      buttonLink: '/menu',
    },
    {
      image: 'https://placehold.co/600x400/?text=Lounaslista',
      title: '🍽️ Viikoittain vaihtuva lounaslista',
      description:
        'Tarjoamme viikoittain vaihtuvan lounaan, joka pohjautuu asiakkaidemme suosimiin, tuttuihin makuihin.',
      buttonText: 'Näytä lounaslista',
      buttonLink: '/lunch',
    },
    {
      image: 'https://placehold.co/600x400/?text=Pitopalvelu+kabinetti',
      title: '🎉 Pitopalvelut & kabinetti',
      description:
        'Olipa kyse juhlasta tai kokouksesta, meiltä saat tilaisuuteesi maistuvan tarjoilun ja ammattitaitoisen palvelun - paikan päällä viihtyisässä kabinetissame tai pitopalveluna missä haluatkaan.',
      buttonText: 'Kysy lisää',
      buttonLink: '/contact',
    },
    {
      image: 'https://placehold.co/600x400/?text=Tapahtumat',
      title: '🎶 Tapahtumat & illat',
      description:
        'Tule mukaan bistroiltoihin, bingoon ja muihin vaihteleviin tapahtumiin. Bistro Saimaa tarjoaa monipuolista ohjelmaa ympäri vuoden, joka tuo ihmiset yhteen.',
      buttonText: 'Tapahtumakalenteri',
      buttonLink: '#events',
    },
    {
      image: 'https://placehold.co/600x400/?text=Laatu',
      title: '⭐ Huippulaatu ja makuelämykset',
      description:
        'Bistro Saimaa tunnetaan tinkimättömästä laadustaan. Jokainen annos valmistetaan huolella ja rakkaudella, jotta voimme tarjota asiakkaillemme unohtumattomia makuelämyksiä. Laatu on meille sydämen asia.',
      buttonText: 'Lue lisää',
      buttonLink: '#story',
    },
    {
      image: 'https://placehold.co/600x400/?text=Sijainti',
      title: '🗺️ Saimaan tuntumassa',
      description:
        'Meidät löydät Ristiinan laitamilta, upeiden Saimaan maisemien vierestä. Bistro Saimaa sijaitsee vain 20 minuutin ajomatkan päässä Mikkelistä, kätevästi valtatie 15:n varrella - täydellinen paikka pysähtyä ja nauttia hyvästä ruoasta',
      buttonText: 'Näytä kartalla',
      buttonLink: '#contact',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
        >
          Tutustu tarjontaamme
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <FeatureCard flippable={true} {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
