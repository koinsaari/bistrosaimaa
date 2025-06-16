/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function FeaturedSection() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">Tarjontamme</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
          <motion.div
            className="flex-1 overflow-hidden bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src="/lounas_3.jpeg"
                alt="À la carte menu"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-gray-700 font-bold mb-2">Menu</h3>
              <p className="text-gray-700 mb-4">Tutustu à la carte -menuumme.</p>
              <a
                href="/menu"
                className="px-4 py-2 bg-emerald-600 rounded !text-white hover:bg-emerald-700 transition-colors"
              >
                Katso menu
              </a>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 overflow-hidden bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src="/lounas_1.jpeg"
                alt="Lounas"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-gray-700 font-bold mb-2">Viikoittain vaihtuva lounas</h3>
              <p className="text-gray-700 mb-4">Tarjoamme viikoittain vaihtuvan lounaan</p>
              <a
                href="https://www.facebook.com/bistrosaimaa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 rounded !text-white hover:bg-emerald-700 transition-colors"
              >
                Näytä lounaslista Facebookissa
              </a>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 overflow-hidden bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src="/kakku.jpeg"
                alt="Pitopalvelut"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-gray-700 font-bold mb-2">Pitopalvelut & kabinetti</h3>
              <p className="text-gray-700 mb-4">
                Ruokaa ja tarjoilua joko paikan päällä kabinetissa tai toimitettuna muualle.
              </p>
              <a
                href="/contact"
                className="px-4 py-2 bg-emerald-600 rounded !text-white hover:bg-emerald-700 transition-colors"
              >
                Kysy lisää
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
