/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
  );
};

export default Navigation;
