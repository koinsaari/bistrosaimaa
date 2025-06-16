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
      <div className="relative container mx-auto px-4 py-4 flex justify-end items-center">
        <Link to="/" className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <img
            src="/logo-saimaa.png"
            alt="Bistro Saimaa"
            className={`h-16 transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-90 hover:opacity-100'
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Etusivu
          </Link>
          <Link
            to="/menu"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Menu
          </Link>
          <Link
            to="/contact"
            className={`hover:text-emerald-500 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Ota yhteyttä
          </Link>
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
          <Link
            to="/"
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Etusivu
          </Link>
          <Link
            to="/menu"
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-gray-700 hover:text-emerald-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Ota yhteyttä
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
