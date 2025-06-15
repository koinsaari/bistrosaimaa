/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const reviews = [
  {
    id: 1,
    quote: 'Hinta ja laatu on tässä paikassa kohdallaan käyn säännöllisesti kahvilla sekä syömässä',
    author: 'Teuvo R.',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Kiva paikka Ristiinan venesataman vieressä. Hyvää kotiruokaa lounasbuffasta tai tilaamalla menulta ja viihtyisä tunnelma. Ei kannata ohittaa paikkaa, vaikka onkin ulospäin vähän huomaamaton',
    author: 'P.K.',
    rating: 5,
  },
  {
    id: 3,
    quote: 'Mukava, rauhallinen paikka. Ystävällinen henkilökunta ja hyvä palvelu. Helppo löytää.',
    author: 'Heimo T.',
    rating: 5,
  },
  {
    id: 4,
    quote: 'Erittäin hyvä ruokapaikka ja hinnat maltilliset.',
    author: 'Jesse J.',
    rating: 4,
  },
  {
    id: 5,
    quote:
      'Parhaat ranskalaiset mitä ikinä syönyt nii rapeat 😋 samoin hampurilainen oli mehevä ja Hyvä 💖💖',
    author: 'Ulla H.',
    rating: 5,
  },
  {
    id: 6,
    quote:
      'Ystävällinen ja hyvä palvelu. Haettiin salaatit mukaan rantaan. Olivat hyvät ja runsaat, hyvin pakattu kuljetettavaksi, mukaan saatiin aterimet sekä leipäpalat.',
    author: 'Riitu',
    rating: 5,
  },
  {
    id: 7,
    quote: 'Erinomainen ruoka. Mukava henkilökunta.',
    author: 'Ville',
    rating: 5,
  },
  {
    id: 8,
    quote:
      'Ruoka oli hyvää ja palvelu ystävällistä. Varmasti käymme uudestaan jos Ristiinan suunnille uudestaan eksymme.',
    author: 'Mirja F.',
    rating: 5,
  },
  {
    id: 9,
    quote:
      'Enpä uskonut Ristiinasta löytäväni vegaanista ruokaa, mutta Saimaan ystävällinen henkilökunta pyöräytti neille vegeburgerit! Ja ranskalaiset ovat kyllä taivaallisia. Kiitos tästä!',
    author: 'Veikko S.',
    rating: 5,
  },
  {
    id: 10,
    quote:
      'Iso suositus paikasta! Äärettömän hyvät ateriat, aura-pekoni ateria ja Saimaan makkis-pekkikset testauksessa 🤤',
    author: 'Noora V.',
    rating: 5,
  },
];

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef(null);

  // Auto-rotate reviews
  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate]);

  const pauseAutoRotation = () => {
    setAutoRotate(false);
    setTimeout(() => {
      setAutoRotate(true);
    }, 5000);
  };

  const goToNext = () => {
    pauseAutoRotation();
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    pauseAutoRotation();
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSpecific = (index) => {
    pauseAutoRotation();
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const cardVariants = {
    // slides in from the left or right
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    // slides out on the opposite direction where entered
    exit: (direction) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    }),
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <img
        src="https://images.pexels.com/photos/27798098/pexels-photo-27798098/free-photo-of-lake-saimaa-1.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Lake Saimaa"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">Arvostelut</h2>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative h-80">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white border-opacity-20 w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl text-amber-400 font-serif leading-none mb-6">❝</div>
                    <p className="text-lg md:text-xl text-black mb-6 italic leading-relaxed">
                      "{reviews[activeIndex].quote}"
                    </p>

                    <div className="mb-4 text-xl">
                      {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                        <span key={i} className="mx-0.5">
                          ⭐️
                        </span>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold text-black text-lg">
                        {reviews[activeIndex].author}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3">
                    <p className="text-xs text-gray-600">Lähde: Google</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <motion.button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-white hover:bg-opacity-30"
            onClick={goToPrev}
            type="button"
            aria-label="Edellinen arvostelu"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-bold">←</span>
          </motion.button>

          <motion.button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-white hover:bg-opacity-30"
            onClick={goToNext}
            type="button"
            aria-label="Seuraava arvostelu"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-bold">→</span>
          </motion.button>

          {/* Dot indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
                onClick={() => goToSpecific(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Mene arvosteluun ${index + 1}`}
              />
            ))}
          </div>

          {/* Google reviews link */}
          <div className="mt-8 flex justify-center">
            <motion.a
              href="https://www.google.com/maps/place/Kahvila+Ravintola+Saimaa+Oy/@61.5066667,27.2560361,17z/data=!4m8!3m7!1s0x469073801b964d6d:0xa50b1dbd31d8cb94!8m2!3d61.5066667!4d27.258611!9m1!1b1!16s%2Fg%2F11dxhzpvtq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white backdrop-blur-sm rounded-lg"
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">⭐️</span>
              <span>Jätä arvostelu Googleen</span>
              <motion.span
                className="text-xl"
                animate={{ x: [0, 5, 0] }} // slight bounce effect to the right
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
              >
                →
              </motion.span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
