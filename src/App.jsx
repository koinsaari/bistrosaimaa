/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FeaturedSection from './components/FeaturedSection';
import Button from './components/Button';
import Menu from './components/Menu';
import StorySection from './components/StorySection';
import ReviewsSection from './components/ReviewsSection';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Banner />
      <Navigation />

      {/* Hero */}
      <section
        id="home"
        className="relative h-[80vh] bg-gray-900 flex items-center justify-center text-center text-white w-full"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Tervetuloa Bistro Saimaaseen
          </h1>
          <p className="text-xl mb-8">Paikallista ruokaa Saimaan sydämestä</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#reservation">Tee varauspyyntö</Button>
            <Button href="#menu" variant="outline">
              Näytä menu
            </Button>
          </div>
        </div>
      </section>

      <FeaturedSection />
      <StorySection />
      <ReviewsSection />
      <Menu />

      {/* Contact */}
      <section id="contact" className="py-16 bg-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 place-items-center gap-16">
            <div className="max-w-xs">
              <h2 className="text-2xl font-bold mb-6">Aukioloajat</h2>
              <ul className="space-y-2">
                <li className="flex justify-between gap-8">
                  <span>Maanantai–Perjantai:</span>
                  <span>7:00 - 20:00</span>
                </li>
                <li className="flex justify-between gap-8">
                  <span>Lauantai:</span>
                  <span>9:00 - 20:00</span>
                </li>
                <li className="flex justify-between gap-8">
                  <span>Sunnuntai:</span>
                  <span>11:00 - 20:00</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Löydät meidät</h2>
              <address className="not-italic space-y-2">
                <p>
                  <a
                    href="https://maps.google.com/?q=Brahentie+42,+52300+Ristiina,+Finland"
                    className="text-white hover:text-emerald-200 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Brahentie 42
                  </a>
                </p>
                <p>
                  <a
                    href="https://maps.google.com/?q=Ristiina,+Finland"
                    className="text-white hover:text-emerald-200 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    52300 Ristiina
                  </a>
                </p>
                <p>
                  Puhelin:&nbsp;
                  <a
                    href="tel:+358504499322"
                    className="text-white hover:text-emerald-200 underline"
                  >
                    +358 50 4499 322
                  </a>
                </p>
                <p>
                  Sähköposti:&nbsp;
                  <a
                    href="mailto:bistrosaimaa@gmail.com"
                    className="text-white hover:text-emerald-200 underline"
                  >
                    bistrosaimaa@gmail.com
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const Banner = () => (
  <div className="bg-yellow-100 border-b border-yellow-300">
    <div className="container mx-auto px-4 py-3">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <span className="text-xl mr-2" aria-hidden="true">
            🚧
          </span>
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Oho!</span> Sivumme on vielä vähän kesken, mutta
            tervetuloa tutustumaan!
          </p>
        </div>
        <p className="text-yellow-800 font-bold text-base mt-1">
          Huomaathan, että sisältö on vielä työn alla eikä virallista.
        </p>
      </div>
    </div>
  </div>
);
