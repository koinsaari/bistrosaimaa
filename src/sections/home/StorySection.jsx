/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const storyData = [
  {
    title: '📍 Ravintola keskellä järviluontoa',
    image: 'https://placehold.co/800x600/?text=Saimaa+ja+Ristiina',
    paragraphs: [
      'Bistro Saimaa sijaitsee aivan Ristiinan sydämessä, vain muutaman askeleen päässä Saimaan rauhallisista rantamaisemista. Ravintolan suurista ikkunoista avautuu näkymä satamaan ja järvimaisemaan, jotka luovat ruokailulle ainutlaatuisen taustan vuodenajasta riippumatta.',
      'Sijaintimme tarjoaa täydellisen pysähdyspaikan matkailijoille ja lähialueen asukkaille – olit sitten veneilemässä, mökkeilemässä tai liikkeellä työpäivän lomassa.',
    ],
  },
  {
    title: '🍽️ Rentoa tunnelmaa ja konstailematonta ruokaa',
    image: 'https://placehold.co/800x600/?text=Tunnelma',
    paragraphs: [
      'Meille tärkeintä on viihtyvyys. Bistro Saimaa ei ole pelkkä ruokapaikka, vaan tila hengähtää, kohdata ja nauttia hetkestä. Tunnelma on rento, palvelu lämmintä ja ruoka valmistetaan ajatuksella – ilman turhaa kikkailua.',
      'Ruokalistamme seuraa sesonkia ja yhdistää perinteisiä suomalaisia makuja moderneihin ideoihin. Meille on tärkeää, että jokainen asiakas tuntee olonsa tervetulleeksi.',
    ],
  },
  {
    title: '🌿 Lähellä tuotettua – aidosti',
    image: 'https://placehold.co/800x600/?text=Raaka-aineet',
    paragraphs: [
      'Panostamme paikallisiin raaka-aineisiin aina kun se on mahdollista. Monet käyttämämme tuotteet tulevat Etelä-Savon tuottajilta ja pieniltä toimittajilta.',
      'Tämä ei ole meille pelkkä trendi, vaan tapa toimia vastuullisesti ja tuoda asiakkaille mahdollisimman tuoreita makuja lautaselle – juuri sellaisena kuin ne ovat parhaimmillaan.',
    ],
  },
];

export default function StorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const StoryCard = ({ story, index }) => {
    const cardRef = useRef(null);
    const isCardInView = useInView(cardRef, {
      once: false,
      amount: 0.5,
    });

    // Update active index when card is in view
    if (isCardInView && activeIndex !== index) {
      setActiveIndex(index);
    }

    return (
      <div
        ref={cardRef}
        className="story-card bg-white/90 backdrop-blur p-12 rounded-lg shadow-md min-h-[80vh] flex flex-col justify-center"
      >
        <h3 className="text-2xl font-semibold mb-6 text-emerald-700">{story.title}</h3>
        {story.paragraphs.map((text, pIdx) => (
          <p key={pIdx} className="text-gray-700 leading-relaxed text-lg mb-4">
            {text}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section id="story" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">
          Bistro Saimaan tarina
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky images */}
          <div className="hidden lg:block lg:w-1/2 lg:pr-8">
            <div className="sticky top-20 h-[80vh]">
              <div className="relative w-full h-full">
                {storyData.map((story, idx) => (
                  <motion.img
                    key={idx}
                    src={story.image}
                    alt={`Bistro Saimaa kuva ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                    variants={imageVariants}
                    initial="hidden"
                    animate={activeIndex === idx ? 'visible' : 'hidden'}
                    style={{
                      opacity: activeIndex === idx ? 1 : 0,
                      transition: 'opacity 0.7s ease-in-out',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Story cards */}
          <div className="lg:w-1/2 space-y-[80vh]">
            {storyData.map((story, idx) => (
              <StoryCard key={idx} story={story} index={idx} />
            ))}
            {/* Some spacer so last card scrolls fully out before un-sticking */}
            <div className="h-[20vh]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
