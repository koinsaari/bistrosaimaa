/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { motion } from 'framer-motion';
import { getISOWeek } from 'date-fns';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';
import FlippableMenuCard from '../../components/FlippableMenuCard';

export default function LunchMenuPage() {
  const menuImage = '/lounaslista.jpg';
  const currentWeek = getISOWeek(new Date());
  const lunchMenuItems = [
    {
      name: 'Maanantai: Paistettu Saimaan kuha',
      dietaryInfo: ['🌾 Gluteeniton', '🥛 Laktoositon', '🐟 Sisältää kalaa'],
      ingredients: 'Tarjoillaan kauden kasviksilla ja sitrusvoikastikkeella.',
    },
    {
      name: 'Tiistai: Härkäpapupihvit',
      dietaryInfo: ['🌱 Vegaaninen', '🌾 Gluteeniton', '🌿 Kasvis'],
      ingredients: 'Kotimaisia härkäpapuja, juuressosetta ja yrttikastiketta.',
    },
    {
      name: 'Keskiviikko: Lihakeitto',
      dietaryInfo: ['🌾 Gluteeniton', '🥛 Laktoositon', '🥩 Sisältää lihaa'],
      ingredients: 'Perinteinen lihakeitto kotimaisesta naudanlihasta ja kauden juureksista.',
    },
    {
      name: 'Torstai: Kalkkuna-kasviswokki',
      dietaryInfo: ['🌾 Gluteeniton', '🥛 Laktoositon', '🥩 Sisältää lihaa'],
      ingredients: 'Kotimaista kalkkunaa, sesongin kasviksia, inkivääri-soijakastiketta ja riisiä.',
    },
    {
      name: 'Perjantai: Lohi-pinaattilasagne',
      dietaryInfo: ['🥛 Laktoositon', '🐟 Sisältää kalaa'],
      ingredients:
        'Luomujauhoista valmistettu lasagne, lohta ja pinaattia, tarjoillaan salaatin kera.',
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Banner />
      <NavigationBar />

      {/* Hero */}
      <div
        id="lunch-hero"
        className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Viikon {currentWeek} lounaslista
          </motion.h1>

          <motion.p
            className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Tarjoilemme arkisin maittavan ja vaihtelevan lounaan klo 11-14
          </motion.p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Lounaaseen sisältyy runsas salaattipöytä, tuoretta leipää ja jälkiruokakahvi tai tee.
              Erityisruokavaliot huomioidaan mahdollisuuksien mukaan.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: flippable menu card */}
            <motion.div
              className="lg:w-3/5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FlippableMenuCard
                menuImageUrl={menuImage}
                weeklyMenuItems={lunchMenuItems}
                isFlippable={true}
                onError={() => setHasError(true)}
              />
            </motion.div>

            {/* Right side: additional info card */}
            <motion.div
              className="lg:w-2/5 bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Lounaasta</h3>

              <p className="text-gray-600 mb-4">
                Ruokalistamme vaihtuu viikoittain sesongin ja saatavuuden mukaan. Käytämme
                mahdollisimman paljon paikallisia raaka-aineita ja tuotteita.
              </p>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center">
                  <div className="h-14 w-14 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
                    <span className="text-2xl">👩‍🍳</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-800">
                      Keittiömestarin suositus:
                    </h4>
                    <p className="font-medium text-gray-800">
                      Paistettu Saimaan kuha kauden kasviksilla
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Lounas tarjoillaan:</h4>
                <p className="text-gray-600 mb-1">Maanantaista perjantaihin klo 11:00 - 14:00</p>
                <p className="font-medium text-emerald-700 mt-4">Hinta: 12,90 €</p>
                <p className="text-sm text-gray-500 mt-1">Eläkeläiset ja opiskelijat: 10,90 €</p>
              </div>

              <div className="mt-8">
                <a
                  href="tel:+358504499322"
                  className="inline-flex items-center gap-2 bg-emerald-700 !text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <span>Varaa pöytä</span>
                  <span>→</span>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-16 py-8 border-t border-emerald-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="italic text-gray-700">
              Ilmoitathan allergioistasi ja erityisruokavalioistasi etukäteen.
            </p>
            <p className="mt-4 text-sm text-gray-600">Pidätämme oikeuden muutoksiin.</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
