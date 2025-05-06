/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import Button from './Button';

const FeatureCard = ({ image, title, description, buttonText, buttonLink, flippable = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => {
    if (flippable) setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    if (flippable) setIsFlipped(false);
  };

  return (
    <div
      className="relative h-72 w-full perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-lg overflow-hidden shadow-md">
          <img src={image} alt={title} className="h-48 w-full object-cover" />
          <div className="p-6">
            <h3 className="font-bold text-xl text-gray-700">{title}</h3>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-white rounded-lg overflow-hidden shadow-md rotate-y-180 flex flex-col p-6 ${
            !flippable ? 'hidden' : ''
          }`}
        >
          <h3 className="font-bold text-xl mb-2 text-gray-700">{title}</h3>
          <p className="text-gray-700 mb-4 flex-grow">{description}</p>
          <div className="mt-auto flex justify-center">
            <Button
              href={buttonLink}
              className="px-6 py-2 text-base bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
