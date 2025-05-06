/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState, useEffect } from 'react';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Add/remove padding to body when banner visibility changes
  useEffect(() => {
    if (isVisible) {
      document.body.style.paddingTop = '76px';
    } else {
      document.body.style.paddingTop = '0';
    }

    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-100 border-b border-yellow-300 z-50">
      <div className="container mx-auto px-4 py-3 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-800 hover:text-yellow-600 focus:outline-none bg-transparent font-medium text-lg"
          aria-label="Sulje banneri"
        >
          ×
        </button>
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
};

export default Banner;
