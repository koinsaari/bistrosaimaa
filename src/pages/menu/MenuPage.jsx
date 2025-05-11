/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';
import FlippableMenuCard from '../../components/FlippableMenuCard';

const menuCategories = [
  {
    id: 'starters',
    title: 'Alkuruoat',
    icon: '🍽️',
    imageUrl: 'https://placehold.co/800x500/?text=Alkuruoat',
    items: [
      {
        name: 'Talon antipasti-lautanen',
        description: 'Paahdettuja kasviksia, palvattua possua ja paikallisia juustoja.',
        ingredients:
          'Sisältää: Paikallisia juustoja, palvattua possua, paahdettuja paprikoita ja kesäkurpitsaa, oliiveja, aurinkokuivattuja tomaatteja, rucolaa ja talon leipää.',
        price: '12.50',
        dietaryInfo: ['G', 'L*'],
      },
      {
        name: 'Metsäsienikeitto',
        description: 'Kermainen keitto paikallisista sienistä, tarjoillaan talon leivän kera.',
        ingredients:
          'Sisältää: Kantarelleja, tatti- ja herkkusieniä, sipulia, kermaa, valkoviiniä, timjamia, persiljaa.',
        price: '9.80',
        dietaryInfo: ['VG*', 'G*'],
      },
      {
        name: 'Savustettu siika',
        description: 'Saimaan siikaa, punajuurta ja piparjuurikastiketta.',
        ingredients:
          'Sisältää: Savustettua Saimaan siikaa, punajuuripyreetä, piparjuurikermaa, tilliöljyä, sitruunaa, rucolaa.',
        price: '13.50',
        dietaryInfo: ['G', 'L'],
      },
    ],
  },
  {
    id: 'mains',
    title: 'Pääruoat',
    icon: '🍲',
    imageUrl: 'https://placehold.co/800x500/?text=Pääruoat',
    items: [
      {
        name: 'Bistron pihvi',
        description:
          'Grillattu naudan ulkofileepihvi, punaviinikastike, yrttivoi ja kauden kasvikset.',
        ingredients:
          'Sisältää: Kotimaista naudan ulkofileetä, punaviinikastiketta (punaviiniä, timjamia, rosmariinia, sipulia), yrttivoita, paahdettuja juureksia, perunapyreetä.',
        price: '29.50',
        dietaryInfo: ['G', 'L'],
      },
      {
        name: 'Paahdettua kuhaa',
        description: 'Saimaan kuhaa, tillikastiketta ja perunapyreetä.',
        ingredients:
          'Sisältää: Tuoretta Saimaan kuhaa, tillikastiketta (tilli, voi, valkoviini, sitruuna), perunapyreetä, paahdettuja fenkoleita.',
        price: '26.80',
        dietaryInfo: ['G', 'L'],
      },
      {
        name: 'Kasvis-risotto',
        description: 'Kermainen risotto, kauden sieniä ja parmesaania.',
        ingredients:
          'Sisältää: Arborio-riisiä, valkoviiniä, sipulia, kauden sieniä (kantarelli, herkkusieni), kermaa, parmesaania, rucolaa.',
        price: '21.00',
        dietaryInfo: ['VG*', 'G'],
      },
      {
        name: 'Poronkäristys',
        description: 'Perinteinen poronkäristys, puikulaperunat ja puolukkaa.',
        ingredients:
          'Sisältää: Suomalaista poronlihaa, puikulaperunoita, puolukkaa, suolakurkkuja, voita, sipulia, timjamia.',
        price: '28.50',
        dietaryInfo: ['G', 'L'],
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Jälkiruoat',
    icon: '🍰',
    imageUrl: 'https://placehold.co/800x500/?text=Jälkiruoat',
    items: [
      {
        name: 'Suklaafondant',
        description: 'Lämmin suklaakakku, vaniljajäätelöä ja marjoja.',
        ingredients:
          'Sisältää: Tummaa suklaata, voita, kananmunaa, vehnäjauhoja, sokeria, vaniljajäätelöä, tuoreita marjoja, minttua.',
        price: '10.50',
        dietaryInfo: ['VL'],
      },
      {
        name: 'Juustolautanen',
        description: 'Valikoima paikallisia juustoja, hilloa ja näkkileipää.',
        ingredients:
          'Sisältää: Vaihtuva valikoima paikallisia juustoja, hunajaa, viinimarjahilloa, pähkinöitä, näkkileipää, tuoreita hedelmiä.',
        price: '13.50',
        dietaryInfo: ['G*', 'VL'],
      },
      {
        name: 'Marjapiirakka',
        description: 'Kauden marjoista leivottu piirakka ja vaniljakastiketta.',
        ingredients:
          'Sisältää: Kotimaisia marjoja (mustikka, puolukka, mansikka - sesongin mukaan), murotaikinaa, vaniljakastiketta.',
        price: '8.90',
        dietaryInfo: ['VL'],
      },
    ],
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Banner />
      <NavigationBar />

      {/* Hero */}
      <div
        id="menu-hero"
        className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            À la carte
          </motion.h1>

          <motion.p
            className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Ruokamme valmistetaan parhaista raaka-aineista, suosien lähituottajia ja sesongin
            antimia.
          </motion.p>
        </div>
      </div>

      {/* Menu content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-6">
              Menuamme päivitetään säännöllisesti sesongin mukaan. Kysy henkilökunnalta päivän
              erikoisuudet.
            </p>

            {/* dietary info legend */}
            <div className="inline-flex flex-wrap justify-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-emerald-100">
              <span className="px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                <strong>G</strong> - Gluteeniton
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                <strong>L</strong> - Laktoositon
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                <strong>VL</strong> - Vähälaktoosinen
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                <strong>VG</strong> - Vegaaninen
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                <strong>*</strong> - Saatavilla pyydettäessä
              </span>
            </div>
          </motion.div>

          {/* Category navigation */}
          <div className="flex justify-center mb-16 flex-wrap gap-4">
            {menuCategories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-5 py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
                onClick={() =>
                  setActiveCategory(activeCategory === category.id ? null : category.id)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Menu categories */}
          {menuCategories.map((category) => (
            <motion.div
              key={category.id}
              className={`mb-20 ${
                activeCategory && activeCategory !== category.id ? 'hidden' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-10">
                <div className="h-px bg-emerald-200 w-16 mr-4"></div>
                <h2 className="text-3xl font-bold text-emerald-800 flex items-center">
                  <span className="mr-3 text-4xl">{category.icon}</span>
                  {category.title}
                </h2>
                <div className="h-px bg-emerald-200 w-16 ml-4"></div>
              </div>

              {/* Non-flippable menu card */}
              <div className="mb-12">
                <FlippableMenuCard
                  menuImageUrl={category.imageUrl}
                  isFlippable={false}
                  weeklyMenuItems={category.items.map((item) => ({
                    name: `${item.name} - ${item.price} €`,
                    description: item.description,
                    ingredients: item.ingredients,
                    dietaryInfo: item.dietaryInfo,
                  }))}
                />
              </div>

              <div className="mt-8 space-y-8 bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="font-medium text-emerald-800 text-center mb-6 text-xl">
                  {category.title} Menu
                </h3>
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={`${category.id}-${itemIndex}`}
                    className="border-b border-emerald-100 pb-6 last:border-0 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + itemIndex * 0.1 }}
                  >
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h3 className="text-xl font-semibold text-emerald-900">{item.name}</h3>
                      <span className="text-lg font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        {item.price} €
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2 leading-relaxed">{item.description}</p>
                    <p className="text-gray-500 mt-1 text-sm italic">{item.ingredients}</p>
                    <div className="mt-3 flex gap-2">
                      {item.dietaryInfo.map((info, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {info}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            className="text-center mt-16 py-8 border-t border-emerald-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="italic text-gray-700">
              Ilmoitathan allergioistasi ja erityisruokavalioistasi henkilökunnalle.
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Hinnat sisältävät ALV:n. Menu voi muuttua saatavuuden mukaan.
            </p>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-emerald-700 !text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <span>Varaa pöytä</span>
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
