/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import Button from './Button';

const FeatureCard = ({ image, title, description, buttonText, buttonLink }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <h3 className="font-bold text-xl mb-2 text-gray-700">{title}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
        </div>
        <div className="mt-auto">
          <Button href={buttonLink}>{buttonText}</Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
