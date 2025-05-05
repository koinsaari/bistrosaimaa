/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState, useEffect, useCallback } from 'react';

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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning]);

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* TODO: here some bg image */}

      {/* Overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">
          Mitä asiakkaamme sanovat
        </h2>

        <div className="max-w-4xl mx-auto relative">
          {/* Reviews carousel */}
          <div className="relative h-80">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`absolute inset-0 flex items-center justify-center transition-opacity ease-in-out
                  ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white border-opacity-20 w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl text-amber-400 font-serif leading-none mb-6">❝</div>
                    <p className="text-lg md:text-xl text-black mb-6 italic leading-relaxed">
                      "{review.quote}"
                    </p>

                    {/* Simplified star rating */}
                    <div className="mb-4 text-xl">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="mx-0.5">
                          ⭐️
                        </span>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold text-black text-lg">{review.author}</h3>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3">
                    <p className="text-xs text-gray-600">Lähde: Google</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
            onClick={goToPrev}
            type="button"
            aria-label="Edellinen arvostelu"
          >
            <span className="text-2xl font-bold">←</span>
          </button>

          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
            onClick={goToNext}
            type="button"
            aria-label="Seuraava arvostelu"
          >
            <span className="text-2xl font-bold">→</span>
          </button>

          {/* Dot indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Mene arvosteluun ${index + 1}`}
              />
            ))}
          </div>

          {/* Google reviews link */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.google.com/maps/place/Kahvila+Ravintola+Saimaa+Oy/@61.5066667,27.2560361,17z/data=!4m8!3m7!1s0x469073801b964d6d:0xa50b1dbd31d8cb94!8m2!3d61.5066667!4d27.258611!9m1!1b1!16s%2Fg%2F11dxhzpvtq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white backdrop-blur-sm 
                        rounded-lg transition-all"
            >
              <span className="mr-1">⭐️</span>
              <span>Jätä arvostelu Googleen</span>
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
