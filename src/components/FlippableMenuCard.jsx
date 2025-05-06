/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import MenuLoadError from './MenuLoadError';

const FlippableMenuCard = ({ menuImageUrl, weeklyMenuItems }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);

    if (!isFlipped) {
      setSelectedDish(null);
    }
  };

  const toggleDishSelection = (index) => {
    if (selectedDish === index) {
      setSelectedDish(null);
    } else {
      setSelectedDish(index);
    }
  };

  return (
    <div className="perspective-1000">
      <div className="relative">
        {hasError ? (
          <MenuLoadError />
        ) : (
          <div
            className={`relative w-full h-[550px] sm:h-[600px] cursor-pointer group transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={isFlipped && selectedDish !== null ? null : handleCardFlip}
          >
            {/* Card front side */}
            <div
              className="absolute inset-0 backface-hidden rounded-lg shadow-lg overflow-hidden 
                     border border-gray-200 bg-white group-hover:shadow-xl transition-shadow"
            >
              {!isImageLoaded && <MenuLoadingSpinner />}
              <img
                src={menuImageUrl}
                alt="Bistro Saimaa menu"
                className={`w-full h-full object-contain ${isImageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setHasError(true);
                  setIsImageLoaded(false);
                }}
              />
            </div>

            {/* Card back side */}
            <div
              className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg 
                      shadow-lg overflow-hidden border border-gray-200 bg-white"
            >
              <div className="p-6 h-full overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-700 text-center">
                  Annokset ja niiden sisällöt
                </h3>

                <div className="space-y-4">
                  {weeklyMenuItems.map((dish, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`p-3 rounded-md border transition-colors ${
                          selectedDish === index
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDishSelection(index);
                          }}
                        >
                          <h4 className="font-medium text-gray-800 flex items-center justify-between">
                            <span>{dish.name}</span>
                            <span
                              className={`text-sm transition-transform ${
                                selectedDish === index ? 'rotate-180' : ''
                              }`}
                            >
                              ▼
                            </span>
                          </h4>

                          {/* Show dietary info on all items */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dish.dietaryInfo.map((info, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600"
                              >
                                {info}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Expanded section */}
                        {selectedDish === index && (
                          <div
                            className="mt-3 pt-2 border-t border-gray-100 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-gray-600 text-sm">{dish.ingredients}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuLoadingSpinner = () => (
  <div className="h-64 lg:h-full min-h-[300px] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
  </div>
);

export default FlippableMenuCard;
