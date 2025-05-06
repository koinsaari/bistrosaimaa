/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

const MenuLoadError = () => (
  <div className="h-full p-8 flex items-center justify-center">
    <div className="text-center">
      <p className="text-gray-700 mb-4">Voi ei! Listaa ei voitu ladata ☹️</p>
      <p className="text-gray-500">
        Mutta se pitäisi löytyä Facebookistamme:{' '}
        <a
          href="https://www.facebook.com/bistrosaimaaoy"
          className="text-emerald-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bistro Saimaa
        </a>
      </p>
      <p className="text-gray-500">
        Tai voit soittaa meille ja kysäistä:{' '}
        <a href="tel:+358504499322" className="text-emerald-600 hover:underline">
          +358 50 4499 322
        </a>
      </p>
    </div>
  </div>
);

export default MenuLoadError;
