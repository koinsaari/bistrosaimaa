/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import { menuCategories } from './menuData';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
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
          ></motion.p>
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
          ></motion.div>

          {/* Category navigation */}
          <div className="flex justify-center mb-16 flex-wrap gap-4">
            {menuCategories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-5 py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-emerald-600'
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

              <div className="mt-8 space-y-8 bg-white p-8 rounded-2xl shadow-sm">
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
                        {category.id === 'pizzas' && item.name === 'Pizzat' ? (
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
                        ) : item.variants.length === 1 ? (
                          // price display for salads and steaks
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-emerald-900 font-medium">{item.name}</span>
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                              {item.variants[0].normal} €
                            </span>
                          </div>
                        ) : (
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
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-emerald-900 font-medium">{item.name}</span>
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                            {item.price} €
                          </span>
                        </div>
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
            <p className="mt-4 text-sm text-gray-600">Hinnat sisältävät ALV:n.</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
