/*
 * Copyright (c) 2024 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import './App.css';
import Button from './components/Button';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-emerald-700">Bistro Saimaa</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-emerald-600">
              Etusivu
            </a>
            <a href="#menu" className="hover:text-emerald-600">
              Ruokalista
            </a>
            <a href="#about" className="hover:text-emerald-600">
              Tietoa
            </a>
            <a href="#contact" className="hover:text-emerald-600">
              Yhteystiedot
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 px-4 bg-white shadow-inner">
            <a
              href="#home"
              className="block py-2 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Etusivu
            </a>
            <a
              href="#menu"
              className="block py-2 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Ruokalista
            </a>
            <a
              href="#about"
              className="block py-2 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Tietoa
            </a>
            <a
              href="#contact"
              className="block py-2 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Yhteystiedot
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
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

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">
            Bistro Saimaa – paikallisesti ja ammattitaidolla
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 Ruokalista */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">
              <img
                src="https://placehold.co/600x400/?text=Sesongin+Maut"
                alt="Sesongin maut"
                className="h-48 w-full object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-700">Sesongin maut</h3>
                  <p className="text-gray-700 mb-4">
                    Consequat esse non culpa sint laborum occaecat eiusmod laboris labore
                    adipisicing veniam amet ad.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button href="/menu">Näytä viikon ruokalista</Button>
                </div>
              </div>
            </div>

            {/* Card 2 Pitopalvelu & kabinetti */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">
              <img
                src="https://placehold.co/600x400/?text=Pitopalvelu+ja+Kabinetti"
                alt="Pitopalvelu & kabinetti"
                className="h-48 w-full object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-700">Pitopalvelu & kabinetti</h3>
                  <p className="text-gray-700 mb-4">
                    Dolore magna anim proident ullamco nostrud qui duis consequat aliquip dolore.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button href="/palvelut">Tutustu palveluihin</Button>
                </div>
              </div>
            </div>

            {/* Card 3 Ristiina */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">
              <img
                src="https://placehold.co/600x400/?text=Ristiinan+Sydämessä"
                alt="Ristiinan sydämessä"
                className="h-48 w-full object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-700">Ristiinan sydämessä</h3>
                  <p className="text-gray-700 mb-4">
                    Non ut aliqua nisi reprehenderit in ut eu eu sunt consectetur ut magna sit.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button href="/ristiina">Näytä sijainti</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
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

      {/* Contact Section */}
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
                <li className="flex justify-between">
                  <span>Lauantai:</span>
                  <span>9:00 - 20:00</span>
                </li>
                <li className="flex justify-between">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-4">Bistro Saimaa</div>
            <div className="flex gap-6 mb-4">
              <a href="#" className="hover:text-emerald-400">
                Facebook
              </a>
              <a href="#" className="hover:text-emerald-400">
                Instagram
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; 2025 Bistro Saimaa &nbsp;|&nbsp; Made with 💚 by{' '}
              <a
                href="https://www.linkedin.com/in/aarokoinsaari"
                className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aaro
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
