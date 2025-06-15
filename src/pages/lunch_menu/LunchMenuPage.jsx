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
      name: 'Kermainen nakkikahvi',
      ingredients: 'Suodatinkahvia, pilkottuja nakkeja, kermavaahtoa, persiljasilppua',
      dietaryInfo: ['🥛 Laktoositon', '🌭 Sisältää lihaa'],
    },
    {
      name: 'Kalapuikkosmoothie',
      ingredients: 'Paistettuja kalapuikkoja, vaniljajogurttia, mustikoita, jäämurskaa',
      dietaryInfo: ['🐟 Sisältää kalaa', '🥛 Sisältää maitotuotteita'],
    },
    {
      name: 'Pinaattilettu & ketsuppijäätelö',
      ingredients: 'Pinaattilettuja, makeutettua ketsuppikastiketta, jäätelömuotti',
      dietaryInfo: ['🌱 Kasvis', '🥛 Sisältää maitotuotteita'],
    },
    {
      name: 'Maksalaatikko ja banaanikastike',
      ingredients: 'Maksalaatikkoa, paistettua banaania, herne-maissi-paprikaa',
      dietaryInfo: ['🥩 Sisältää lihaa', '🌾 Sisältää viljatuotteita'],
    },
    {
      name: 'Lohikiisseli',
      ingredients: 'Makea kiisseli, kylmäsavulohta, tilliä, kinuskikermaa',
      dietaryInfo: ['🐟 Sisältää kalaa', '🥛 Sisältää maitotuotteita'],
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Banner />
      <NavigationBar />

      {/* Hero */}
      <div id="lunch-hero" className="text-white py-24 relative overflow-hidden">
        {/* <img
          src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Restaurant background"
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          > */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Viikon {currentWeek} lounaslista
          </h1>
          {/* </motion.h1> */}

          {/* <motion.p
            className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          > */}
          <p className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100">
            {/* Tarjoilemme arkisin maittavan ja vaihtelevan lounaan klo 11-14 */}
          </p>
          {/* </motion.p> */}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          > */}
          <div className="mb-12 text-center">
            {/* <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Lounaaseen sisältyy runsas salaattipöytä, tuoretta leipää ja jälkiruokakahvi tai tee.
              Erityisruokavaliot huomioidaan mahdollisuuksien mukaan.
            </p> */}
            <p className="text-lg text-yellow-800 bg-yellow-100 p-4 rounded mb-6 max-w-2xl mx-auto">
              ⚠️ Huom! Menu tai hinnat eivät ole virallisia. Ne ovat vain esimerkkinä vielä sivuston
              kehityksen ajaksi.
            </p>
          </div>
          {/* </motion.div> */}

          {/* Commenting out the original cards section */}
          {/* <div className="flex flex-col lg:flex-row gap-8">
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

            <motion.div
              className="lg:w-2/5 bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Lounaasta</h3>

              <p className="text-gray-600 mb-4">
                Meillä ruokalista vaihtuu viikoittain, mutta hyvä maku on aina vakiona
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
          </div> */}

          {/* Simple text and Facebook link */}
          {/* <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          > */}
          <div className="text-center py-8">
            <p className="text-xl text-gray-800 mb-6">Näet päivän lounaslistamme Facebookissa</p>
            <a
              href="https://www.facebook.com/bistrosaimaa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <span>Katso lounaslista Facebookissa</span>
              <span>→</span>
            </a>
          </div>
          {/* </motion.div> */}

          {/* <motion.div
            className="text-center mt-16 py-8 border-t border-emerald-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          > */}
          <div className="text-center mt-16 py-8 border-t border-emerald-200">
            {/* <p className="italic text-gray-700">
              Ilmoitathan allergioistasi ja erityisruokavalioistasi etukäteen.
            </p> */}
            <p className="mt-4 text-sm text-gray-600">Pidätämme oikeuden muutoksiin.</p>
          </div>
          {/* </motion.div> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
