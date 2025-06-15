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
    id: 'salads',
    title: 'Salaatit',
    icon: '🥗',
    imageUrl: '',
    items: [
      {
        name: 'Kreikkalainen salaatti',
        ingredients: 'Salaattia, kurkkua, tomaattia, fetaa, punasipulia, oliiveja.',
        information: 'Kastike: sinappi, thousand, tomaatti, valkosipuli, chilimajoneesi.',
        variants: [{ name: 'Annos', normal: '10,50' }],
        dietaryInfo: [],
      },
      {
        name: 'Kanasalaatti',
        ingredients: 'Salaattia, kurkkua, tomaattia, persikkaa, kanaa, paprikaa.',
        information: 'Kastike: sinappi, thousand, tomaatti, valkosipuli, chilimajoneesi.',
        variants: [{ name: 'Annos', normal: '10,50' }],
        dietaryInfo: [],
      },
      {
        name: 'Tonnikalasalaatti',
        ingredients: 'Salaattia, kurkkua, tomaattia, punasipulia, tonnikalaa.',
        information: 'Kastike: sinappi, thousand, tomaatti, valkosipuli, chilimajoneesi.',
        variants: [{ name: 'Annos', normal: '10,50' }],
        dietaryInfo: [],
      },
      {
        name: 'Kana-pekonisalaatti',
        ingredients: 'Salaattia, kurkkua, punasipulia, kanaa, pekonia, aurajuustoa.',
        information: 'Kastike: sinappi, thousand, tomaatti, valkosipuli, chilimajoneesi.',
        variants: [{ name: 'Annos', normal: '11,50' }],
        dietaryInfo: [],
      },
      {
        name: 'Vuohenjuustosalaatti',
        ingredients:
          'Salaattia, kurkkua, tomaattia, persikkaa, oliiveja, vouhenjuustoa, paholaisen hilloa.',
        information: 'Kastike: sinappi, thousand, tomaatti, valkosipuli, chilimajoneesi.',
        variants: [{ name: 'Annos', normal: '12,50' }],
        dietaryInfo: [],
      },
    ],
  },
  {
    id: 'steaks',
    title: 'Pihvit ja leikkeet',
    icon: '🥩',
    imageUrl: '',
    items: [
      {
        name: 'Porsaanleike',
        ingredients: 'Paneroitu porsaanleike, ranskalaiset tai lohkoperunat, grillikasviksia.',
        information: 'Kastike: bearnaise, metsäsieni, aurajuusto, pippuri',
        variants: [{ name: 'Annos', normal: '15,90' }],
        dietaryInfo: [],
      },
      {
        name: 'Broilerleike',
        ingredients: 'Paneroitu broilerleike, ranskalaiset tai lohkoperunat, grillikasviksia.',
        information: 'Kastike: bearnaise, metsäsieni, aurajuusto, pippuri',
        variants: [{ name: 'Annos', normal: '15,90' }],
        dietaryInfo: [],
      },
      {
        name: 'Paholaisen broileri',
        ingredients:
          'Paneroitu broilerileike, ranskalaiset tai lohkoperunat, paholaisenhilloa, grillikasviksia.',
        information: '',
        variants: [{ name: 'Annos', normal: '16,90' }],
        dietaryInfo: [],
      },
      {
        name: 'Lehtipihvi',
        ingredients:
          'Pariloitu naudan ulkofilepihvi, maustevoi, ranskalaiset tai lohkoperunat, grillikasvikset.',
        information: '',
        variants: [{ name: 'Annos', normal: '16,90' }],
        dietaryInfo: [],
      },
      {
        name: 'Metsästäjänleipä',
        ingredients: '',
        information: '',
        variants: [{ name: 'Annos', normal: '10,90' }],
        dietaryInfo: [],
      },
      {
        name: 'Talon leipä',
        ingredients: '',
        information: '',
        variants: [{ name: 'Annos', normal: '11,90' }],
        dietaryInfo: [],
      },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgerit',
    icon: '🍔',
    imageUrl: '',
    items: [
      {
        name: 'Hampurilainen',
        ingredients: 'Salaatti, suolakurkku, hampurilaismajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '4,00', big: '6,90' },
          { name: 'Ateria', normal: '7,00', big: '9,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Juustohampurilainen',
        ingredients: 'Salaatti, suolakurkku, cheddar, hampurilaismajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '4,50', big: '7,50' },
          { name: 'Ateria', normal: '7,50', big: '10,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Pekonihampurilainen',
        ingredients:
          'Salaatti, suolakurkku, kananmuna, pekoni, punasipuli, hampurilais- ja savumajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '6,90', big: '7,90' },
          { name: 'Ateria', normal: '9,90', big: '11,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Aura-pekoni hampurilainen',
        ingredients:
          'Salaatti, suolakurkku, aurajuusto, pekoni, tomaatti, sipulirenkaat, hampurilais- ja remumajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '6,90', big: '7,90' },
          { name: 'Ateria', normal: '9,90', big: '11,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Paholaishampurilainen',
        ingredients: 'Salaatti, suolakurkku, tomaatti, punasipuli, jalapeno, chilimajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '6,90', big: '7,90' },
          { name: 'Ateria', normal: '9,90', big: '11,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Aurajuusto-hampurilainen',
        ingredients:
          'Salaatti, suolakurkku, aurajuusto, tomaatti, punasipuli, hampurilaismajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '6,90', big: '7,90' },
          { name: 'Ateria', normal: '9,90', big: '11,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Kanahampurilainen',
        ingredients: 'Salaatti, suolakurkku, tomaatti, currymajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '6,90' },
          { name: 'Ateria', normal: '9,90' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Vuohenjuustohampurilainen',
        ingredients:
          'Salaatti, suolakurkku, tomaatti, punasipuli, ananas, vuohenjuusto, paholaisenhillo',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', normal: '7,50' },
          { name: 'Ateria', normal: '11,90' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Astuvan Akka -hampurilainen',
        ingredients: 'Salaatti, punasipuli, ananas, 2 isoa pihviä, cheddar, remumajoneesi,',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', big: '8,90' },
          { name: 'Ateria', big: '13,90' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Astuvan Ukko -hampurilainen',
        ingredients:
          'Salaatti, punasipuli, ananas, 3 isoa pihviä, cheddar, hampurilais- ja savumajoneesi,',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', big: '9,90' },
          { name: 'Ateria', big: '14,90' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Tukkijätkä-hampurilainen',
        ingredients:
          'Salaatti, suolakurkku, tomaatti, punasipuli, pekoni, koskenlaskija, 2 isoa pihviä, hampurilais- ja savumajoneesi',
        information: 'Ateria sisältää: Ranskalaiset ja juoman (norm. 0,33l; jätti 0,5l)',
        variants: [
          { name: 'Pelkkä burgeri', big: '9,90' },
          { name: 'Ateria', big: '13,90' },
        ],
        dietaryInfo: [],
      },
    ],
  },
  {
    id: 'pizzas',
    title: 'Pizzat',
    icon: '🍕',
    imageUrl: '',
    items: [
      {
        name: 'Hinnasto',
        ingredients: '',
        information: 'Valitse täytteiden määrä ja kokoa oma pizzasi',
        variants: [
          { name: '1 täytteen pizza', normal: '10,00' },
          { name: '2 täytteen pizza', normal: '11,50' },
          { name: '3 täytteen pizza', normal: '12,50' },
          { name: '4 täytteen pizza', normal: '13,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Valitse pohja',
        ingredients: '',
        information: '',
        variants: [
          { name: 'Ohut tai Normaali', normal: '0,00' },
          { name: 'Gluteeniton tai keto', normal: '+2,50' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Valitse täytteet',
        ingredients: '',
        information: '',
        customContent: {
          title: 'Perustäytteet (1,00€/kpl)',
          categories: [
            {
              name: 'Liha',
              items: ['Kana', 'Kinkku', 'Pepperoni', 'Salami', 'Pekoni', 'Kebab', 'Jauheliha'],
            },
            {
              name: 'Kala',
              items: ['Tonnikala', 'Katkarapu', 'Anjovis'],
            },
            {
              name: 'Kasvikset',
              items: [
                'Ananas',
                'Persikka',
                'Sipuli',
                'Punasipuli',
                'Paprika',
                'Maustekurkku',
                'Oliivi',
                'Herkkusieni',
                'Jalapeno',
                'Tomaatti',
              ],
            },
            {
              name: 'Juustot',
              items: ['Mozzarella', 'Aurajuusto', 'Feta', 'Tuplajuusto'],
            },
          ],
        },
        dietaryInfo: [],
      },
      {
        name: 'Erikoistäytteet',
        ingredients: '',
        information: '',
        variants: [
          { name: 'Vuohenjuusto', normal: '2,00' },
          { name: 'Paholaisenhillo', normal: '2,00' },
          { name: 'Valkosipuli', normal: '0,70' },
        ],
        dietaryInfo: [],
      },
      {
        name: 'Dipit ja lisät',
        ingredients: '',
        information: 'Paiston jälkeen tai dippaa reunat',
        variants: [
          { name: 'Chilimajoneesi', normal: '1,00' },
          { name: 'BBQ-kastike', normal: '1,00' },
          { name: 'Valkosipulikastike', normal: '1,00' },
          { name: 'Salaatti', normal: '1,00' },
        ],
        dietaryInfo: [],
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
      <div id="menu-hero" className="text-white py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/lounas_3.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Menu
          </motion.h1>

          <motion.p
            className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Ruokamme valmistetaan laadukkaista ja tuoreista raaka-aineista. */}
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
            {/* <p className="text-lg text-gray-700 mb-6">
              Monille jo tutuksi tullut menumme tarjoaa maistuvia suosikkeja. Kysy henkilökunnalta
              päivän erikoisuudet.
            </p> */}

            {/* dietary info legend */}
            {/* <div className="inline-flex flex-wrap justify-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-emerald-100">
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
            </div> */}
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
              {/* <div className="mb-12">
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
              </div> */}

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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      </div>
                    </div>
                    {item.ingredients && (
                      <p className="text-gray-700 mt-2 leading-relaxed">{item.ingredients}</p>
                    )}
                    {item.information && (
                      <p className="text-gray-500 mt-1 text-sm italic">{item.information}</p>
                    )}

                    {/* Render variants if they exist */}
                    {item.variants && !item.customContent && (
                      <div className="mt-3 space-y-2">
                        {item.variants.length === 1 ? (
                          // price display for salads and steaks
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-emerald-900 font-medium">{item.name}</span>
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                              {item.variants[0].normal} €
                            </span>
                          </div>
                        ) : category.id === 'pizzas' && item.name !== 'Hinnasto' ? (
                          // Pizza menu items with multiple options
                          <div className="grid grid-cols-1 gap-2">
                            {item.variants.map((variant, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-emerald-900 font-medium">{variant.name}</span>
                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                  {variant.normal} €
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Burger style display with multiple variants
                          <>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-emerald-900 font-medium">{item.name}</span>
                              <div className="flex gap-3">
                                {item.variants[0].normal && (
                                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                    Norm. {item.variants[0].normal} €
                                  </span>
                                )}
                                {item.variants[0].big && (
                                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                    Jätti {item.variants[0].big} €
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-emerald-900 font-medium">
                                {item.name} ateria
                              </span>
                              <div className="flex gap-3">
                                {item.variants[1].normal && (
                                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                    Norm. {item.variants[1].normal} €
                                  </span>
                                )}
                                {item.variants[1].big && (
                                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                    Jätti {item.variants[1].big} €
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* content for pizza toppings */}
                    {item.customContent && (
                      <div className="mt-3">
                        <h4 className="text-emerald-900 font-medium mb-2">
                          {item.customContent.title}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.customContent.categories.map((category, catIndex) => (
                            <div key={catIndex} className="bg-emerald-50 p-3 rounded-lg">
                              <h5 className="font-medium text-emerald-800 mb-2">{category.name}</h5>
                              <div className="flex flex-wrap gap-2">
                                {category.items.map((topping, i) => (
                                  <span
                                    key={i}
                                    className="bg-white px-2 py-1 rounded text-sm text-emerald-700"
                                  >
                                    {topping}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular price if no variants */}
                    {!item.variants && !item.customContent && (
                      <div className="mt-2">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                          {item.price} €
                        </span>
                      </div>
                    )}

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
            {/* <p className="italic text-gray-700">
              Ilmoitathan allergioistasi ja erityisruokavalioistasi henkilökunnalle.
            </p> */}
            <p className="mt-4 text-sm text-gray-600">
              {/* Hinnat sisältävät ALV:n. Menu voi muuttua saatavuuden mukaan. */}
              Hinnat sisältävät ALV:n.
            </p>
          </motion.div>

          {/* <motion.div
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
          </motion.div> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
