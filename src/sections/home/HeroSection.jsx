/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import Button from '../../components/Button';

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-[80vh] bg-gray-900 flex items-center justify-center text-center text-white w-full"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Tervetuloa Bistro Saimaaseen
        </h1>
        <p className="text-xl mb-8">Paikallista ruokaa Saimaan sydämestä</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="#reservation">Tee varauspyyntö</Button>
          <Button href="#menu" variant="outline">
            Näytä menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
