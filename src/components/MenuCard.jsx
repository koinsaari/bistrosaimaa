/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';

const MenuCard = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const menuImageUrl = 'https://placehold.co/800x1200/?text=Viikon+ruokalista';

  return (
    <section id="menu" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Viikon ruokalista</h2>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-md overflow-hidden">
            {/* Left side */}
            <div className="lg:w-3/5">
              {hasError ? (
                <MenuLoadError />
              ) : (
                <div className="relative h-full">
                  {!isImageLoaded && <MenuLoadingSpinner />}

                  <a href={menuImageUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={menuImageUrl}
                      alt="Bistro Saimaan viikon ruokalista"
                      className={`w-full h-full object-cover lg:border-r border-gray-200 ${
                        isImageLoaded ? 'block' : 'hidden'
                      }`}
                      onLoad={() => setIsImageLoaded(true)}
                      onError={() => {
                        setHasError(true);
                        setIsImageLoaded(false);
                      }}
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="lg:w-2/5 p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Ruokailutietoa</h3>

              <p className="text-gray-600 mb-6">
                Exercitation ex cillum Lorem est irure quis. Aliqua non Lorem ut eiusmod Lorem
                deserunt in aliquip Lorem nisi laborum. Irure irure occaecat velit reprehenderit
                dolore culpa aute cupidatat aliqua laboris in officia eiusmod dolore. Et id pariatur
                consequat officia Lorem irure veniam.
              </p>

              <p className="text-gray-600 mb-6">
                Commodo proident mollit nisi proident veniam et ad sit. Aliquip excepteur laborum
                cillum aliqua. Dolore sint est ipsum proident proident est dolor consequat sit
                reprehenderit. Magna deserunt officia eiusmod nisi ut elit ex tempor velit aute nisi
                reprehenderit occaecat reprehenderit. Amet velit pariatur aliquip irure Lorem ex
                ipsum in qui duis commodo labore. Excepteur enim proident proident ipsum dolor
                veniam aliquip laboris.
              </p>

              {isImageLoaded && (
                <p className="text-gray-500 text-sm mt-auto">
                  Päivitetään joka sunnuntai. Klikkaa kuvaa avataksesi ruokalistan täysikokoisena.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuLoadError = () => (
  <div className="h-full p-8 flex items-center justify-center">
    <div className="text-center">
      <p className="text-gray-700 mb-4">Voi ei! Ruokalistaa ei voitu ladata ☹️</p>
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

const MenuLoadingSpinner = () => (
  <div className="h-64 lg:h-full min-h-[300px] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
  </div>
);

export default MenuCard;
