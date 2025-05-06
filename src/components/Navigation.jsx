/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
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
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none text-emerald-700 font-bold"
          >
            {isMenuOpen ? 'Sulje' : 'Valikko'}
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
  );
};

export default NavigationBar;
