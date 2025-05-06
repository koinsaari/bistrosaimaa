/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

const Banner = () => {
  return (
    <div className="bg-yellow-100 border-b border-yellow-300">
      <div className="container mx-auto px-4 py-3">
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
