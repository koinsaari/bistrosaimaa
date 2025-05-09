/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;

      const heroSection =
        document.getElementById('home') ||
        document.querySelector('[id$="-hero"]') ||
        document.querySelector('[class*="hero"]');

      if (!heroSection) {
        setIsScrolled(window.scrollY > 50);
        return;
      }

      const navbarHeight = navbarRef.current.offsetHeight;
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
          href="/"
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
          <Link
            to="/menu"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            À la carte -menu
          </Link>
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
            className={`p-2 rounded-md focus:outline-none font-medium text-xl transition-colors ${
              isScrolled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-white hover:bg-white/10'
            }`}
            aria-label={isMenuOpen ? 'Sulje valikko' : 'Avaa valikko'}
          >
            {isMenuOpen ? '✕' : '☰'}
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
          <Link
            to="/menu"
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            À la carte
          </Link>
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
