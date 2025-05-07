/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState, useEffect, useRef } from 'react';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;

      const navbarHeight = navbarRef.current.offsetHeight;
      const heroSection = document.getElementById('home');

      if (!heroSection) return;

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const navbarBottom = window.scrollY + navbarHeight;

      // Change background when navbar bottom crosses hero bottom
      if (navbarBottom >= heroBottom) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a
          href="#home"
          className={`text-2xl font-bold transition-colors ${
            isScrolled ? 'text-emerald-700' : 'text-white'
          }`}
        >
          Bistro Saimaa
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Etusivu
          </a>
          <a
            href="#menu"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Ruokalista
          </a>
          <a
            href="#about"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Tietoa
          </a>
          <a
            href="#contact"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Yhteystiedot
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`focus:outline-none font-medium transition-colors ${
              isScrolled ? 'text-emerald-700' : 'text-white'
            }`}
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
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Etusivu
          </a>
          <a
            href="#menu"
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Ruokalista
          </a>
          <a
            href="#about"
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Tietoa
          </a>
          <a
            href="#contact"
            className="block py-2 text-gray-700 hover:text-emerald-500"
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
