/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import Button from './Button';

const FeatureCard = ({
  image,
  title,
  description,
  buttonText,
  buttonLink,
  flippable = true,
  height = 'h-72',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => {
    if (flippable) setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    if (flippable) setIsFlipped(false);
  };

  return (
    <div
      className={`relative ${height} w-full perspective-1000`}
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
          <img
            src={image}
            alt={title}
            className={`${flippable ? 'h-48' : 'h-40'} w-full object-cover`}
          />

          {/* For one-sided cards we show the description and the button on the front */}
          <div className={'flex flex-col'}>
            <div className="p-5 flex-grow">
              <h3 className="text-xl font-semibold text-gray-700 mb-2 line-clamp-1">{title}</h3>
              {!flippable && <p className="text-gray-700 mb-2 line-clamp-3">{description}</p>}
            </div>

            {!flippable && buttonText && (
              <div className="px-5 pb-5 mt-auto">
                <Button
                  href={buttonLink}
                  className="px-4 py-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {buttonText}
                </Button>
              </div>
            )}
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
