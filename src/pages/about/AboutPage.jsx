/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';

const AboutHero = () => (
  <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-24 relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <img
        src="https://placehold.co/800x600?text=Bistro+Saimaan+kuva"
        alt=""
        className="w-full h-full object-cover"
      />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Meistä
      </motion.h1>

      <motion.p
        className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Tutustu ravintolaamme ja tekijöihin sen takana
      </motion.p>
    </div>
  </div>
);

const AboutRestaurant = () => (
  <motion.section
    className="py-16"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="container mx-auto px-4">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bistro Saimaa</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img
              src="https://placehold.co/800x600?text=Bistro+Saimaan+kuva"
              alt="Bistro Saimaa ravintola"
              className="rounded-lg shadow-lg w-full h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-gray-700 text-left">
              Bistro Saimaa, aiemmin nimellä Kahvila Ravintola Saimaa, on vuonna...
            </p>

            <p className="text-gray-700 text-left">
              Ravintolassamme yhdistyvät pohjoismaiset maut, laadukkaat raaka-aineet ja huolella
              rakennetut annokset. Menumme on suunniteltu tarjoamaan mutkatonta, mutta maukasta
              ruokaa, joka kestää aikaa.
            </p>

            <p className="text-gray-700 text-left">
              Bistro Saimaa tunnetaan herkullisista à la carte -annoksistaan, monipuolisesta
              lounastarjonnastaan sekä lämpimästä palvelustaan. Ravintolamme tiloissa voi järjestää
              myös juhlia aina 50 henkilöön saakka.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Lähiruoka
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Laadukkaat raaka-aineet
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Kotimaista
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Pitopalvelu
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Kabinetti
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.section>
);

const TeamMember = ({ name, title, image, description, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? 'translateY(-5px)' : 'translateY(0)' }}
    >
      <div className="relative overflow-hidden h-80">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-80' : 'opacity-50'
          }`}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-emerald-200">{title}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700">{description}</p>
      </div>
    </motion.div>
  );
};

const OurTeam = () => {
  const teamMembers = [
    {
      name: 'Jonna Tuukkanen',
      title: 'Omistaja & Keittiömestari',
      image: 'https://placehold.co/600x800?text=Chef',
      description:
        'Excepteur esse laboris eiusmod ut labore voluptate aliqua minim et minim non eiusmod nulla sit.',
      delay: 0.3,
    },
    {
      name: 'Työntekijä',
      title: 'Nimike',
      image: 'https://placehold.co/600x800?text=Employee',
      description:
        'Cupidatat magna ipsum ipsum dolor consequat velit do labore mollit laborum officia qui proident veniam.',
      delay: 0.5,
    },
    {
      name: 'Työntekijä',
      title: 'Nimike',
      image: 'https://placehold.co/600x800?text=Employee',
      description:
        'Esse exercitation laboris consectetur occaecat sunt aliquip id nisi velit eiusmod eu et sint.',
      delay: 0.7,
    },
    {
      name: 'Työntekijä',
      title: 'Nimike',
      image: 'https://placehold.co/600x800?text=Employee',
      description: 'Laborum nostrud qui veniam sit aliqua.',
      delay: 0.9,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Tutustu tiimiin</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

const OurValues = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Arvomme</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-emerald-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Paikallisuus</h3>
            <p className="text-gray-600">
              Valitsemme raaka-aineet huolella, jotta voimme tarjota laadukasta ja maukasta ruokaa
              joka kerta
            </p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="bg-emerald-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">♻️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Kestävyys</h3>
            <p className="text-gray-600">
              Toimimme ympäristöä kunnioittaen. Minimoimme ruokahävikin ja kiinnitämme huomiota
              vastuullisiin valintoihin kaikessa toiminnassamme.
            </p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="bg-emerald-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Yhteisöllisyys</h3>
            <p className="text-gray-600">
              Haluamme olla merkityksellinen osa paikallisyhteisöä. Järjestämme tapahtumia ja teemme
              yhteistyötä alueen muiden toimijoiden kanssa.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Banner />
      <NavigationBar />
      <AboutHero />
      <AboutRestaurant />
      <OurTeam />
      <OurValues />
      <Footer />
    </div>
  );
}
