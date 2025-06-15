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
      image:
        'https://images.pexels.com/photos/313700/pexels-photo-313700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: '📖 Menu',
      description: 'Tutustu à la carte -menuumme.',
      buttonText: 'Katso menu',
      buttonLink: '/menu',
    },
    {
      image: 'lounas_1.jpeg',
      title: '🍽️ Viikoittain vaihtuva lounas',
      description: 'Tarjoamme viikoittain vaihtuvan lounaan',
      buttonText: 'Näytä lounaslista',
      buttonLink: '/lunch',
    },
    {
      image:
        'https://images.pexels.com/photos/2487438/pexels-photo-2487438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: '🎉 Pitopalvelut & kabinetti',
      description:
        'Tarjoamme ruokaa ja tarjoilua joko paikan päällä kabinetissa tai toimitettuna muualle.',
      buttonText: 'Kysy lisää',
      buttonLink: '/contact',
    },
    // {
    //   image:
    //     'https://images.pexels.com/photos/10655043/pexels-photo-10655043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    //   title: '🎶 Tapahtumat & illat',
    //   description:
    //     'Tule mukaan bistroiltoihin, bingoon ja muihin vaihteleviin tapahtumiin. Bistro Saimaa tarjoaa monipuolista ohjelmaa ympäri vuoden, joka tuo ihmiset yhteen.',
    //   buttonText: 'Tapahtumakalenteri',
    //   buttonLink: '#events',
    // },
    // {
    //   image:
    //     'https://images.pexels.com/photos/2977514/pexels-photo-2977514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    //   title: '⭐ Huippulaatu ja makuelämykset',
    //   description:
    //     'Bistro Saimaa tunnetaan tinkimättömästä laadustaan. Jokainen annos valmistetaan huolella ja rakkaudella, jotta voimme tarjota asiakkaillemme unohtumattomia makuelämyksiä. Laatu on meille sydämen asia.',
    //   buttonText: 'Lue lisää',
    //   buttonLink: '#story',
    // },
    // {
    //   image:
    //     'https://images.pexels.com/photos/28233198/pexels-photo-28233198/free-photo-of-a-lake-and-forested-area.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    //   title: '🗺️ Saimaan tuntumassa',
    //   description:
    //     'Meidät löydät Ristiinan laitamilta, upeiden Saimaan maisemien vierestä. Bistro Saimaa sijaitsee vain 20 minuutin ajomatkan päässä Mikkelistä, kätevästi valtatie 15:n varrella - täydellinen paikka pysähtyä ja nauttia hyvästä ruoasta',
    //   buttonText: 'Näytä kartalla',
    //   buttonLink: '#contact',
    // },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Original animated title - commented out */}
        {/* <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
        >
          Tarjontamme
        </motion.h2> */}

        {/* Boring version */}
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">Tarjontamme</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
          <div className="flex-1 text-center p-4 border border-gray-200 rounded">
            <h3 className="text-gray-700 font-bold mb-2">Menu</h3>
            <p className="text-gray-700 mb-4">Tutustu à la carte -menuumme.</p>
            <a href="/menu" className="px-4 py-2 bg-gray-200 rounded text-gray-800">
              Katso menu
            </a>
          </div>

          <div className="flex-1 text-center p-4 border border-gray-200 rounded">
            <h3 className="text-gray-700 font-bold mb-2">Viikoittain vaihtuva lounas</h3>
            <p className="text-gray-700 mb-4">Tarjoamme viikoittain vaihtuvan lounaan</p>
            <a
              href="https://www.facebook.com/bistrosaimaa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 rounded text-gray-800"
            >
              Näytä lounaslista Facebookissa
            </a>
          </div>

          <div className="flex-1 text-center p-4 border border-gray-200 rounded">
            <h3 className="text-gray-700 font-bold mb-2">Pitopalvelut & kabinetti</h3>
            <p className="text-gray-700 mb-4">
              Tarjoamme ruokaa ja tarjoilua joko paikan päällä kabinetissa tai toimitettuna muualle.
            </p>
            <a href="/contact" className="px-4 py-2 bg-gray-200 rounded text-gray-800">
              Kysy lisää
            </a>
          </div>
        </div>

        {/* Original animated cards - commented out */}
        {/* <motion.div
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
        </motion.div> */}
      </div>
    </section>
  );
}
