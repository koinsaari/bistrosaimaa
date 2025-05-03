/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FeatureCard from './components/FeatureCard';
import Button from './components/Button';
import MenuCard from './components/MenuCard';

function App() {
  const features = [
    {
      image: 'https://placehold.co/600x400/?text=Sesongin+Maut',
      title: 'Sesongin maut',
      description:
        'Consequat esse non culpa sint laborum occaecat eiusmod laboris labore adipisicing veniam amet ad.',
      buttonText: 'Lue lisää raaka-aineistamme',
      buttonLink: '/menu',
    },
    {
      image: 'https://placehold.co/600x400/?text=Pitopalvelu+ja+Kabinetti',
      title: 'Pitopalvelu & kabinetti',
      description: 'Dolore magna anim proident ullamco nostrud qui duis consequat aliquip dolore.',
      buttonText: 'Tutustu palveluihimme',
      buttonLink: '/palvelut',
    },
    {
      image: 'https://placehold.co/600x400/?text=Ristiinan+Sydämessä',
      title: 'Ristiinan sydämessä',
      description: 'Non ut aliqua nisi reprehenderit in ut eu eu sunt consectetur ut magna sit.',
      buttonText: 'Näytä sijainti',
      buttonLink: '/ristiina',
    },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Temporary banner */}
      <div className="bg-yellow-100 border-b border-yellow-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <span className="text-xl mr-2" aria-hidden="true">
                🚧
              </span>
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Oho!</span> Sivumme on vielä vähän kesken, mutta
                tervetuloa tutustumaan!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Navigation />

      {/* Hero */}
      <section
        id="home"
        className="relative h-[80vh] bg-gray-900 flex items-center justify-center text-center text-white"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Tervetuloa Bistro Saimaaseen
          </h1>
          <p className="text-xl mb-8">Paikallista ruokaa Saimaan sydämestä</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#reservation">Tee varauspyyntö</Button>
            <Button href="#menu" variant="outline">
              Näytä ruokalista
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">
            Paikallisesti ja ammattitaidolla
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <MenuCard />

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-700">Bistro Saimaan tarina</h2>
              <p className="text-gray-700 mb-4">
                Fugiat anim sint exercitation magna ullamco aliqua. Lorem aute Lorem quis tempor
                reprehenderit adipisicing. Ut anim ut consectetur tempor dolor labore anim commodo
                qui irure sint anim. Nulla magna nisi aliquip laborum dolore officia ipsum in
                aliquip consectetur labore. Anim amet Lorem irure Lorem culpa laboris esse ex
                laborum deserunt. Adipisicing sint et irure ex.
              </p>
              <p className="text-gray-700">Elit ad consequat duis laboris deserunt.</p>
            </div>
            <div className="lg:w-1/2">
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

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
                    href="mailto:info@bistrosaimaa.fi"
                    className="text-white hover:text-emerald-200 underline"
                  >
                    info@bistrosaimaa.fi
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

export default App;
