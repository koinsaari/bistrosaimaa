/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import { getISOWeek } from 'date-fns';
import MenuLoadError from '../../components/MenuLoadError';

export default function LunchMenuSection() {
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuImage = '/lounaslista.jpg';
  const currentWeek = getISOWeek(new Date());
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <section id="menu" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Viikon {currentWeek} lounaslista
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left side: menu */}
            <div className="lg:w-3/5 flex flex-col">
              <div className="flex-grow rounded-lg shadow-lg overflow-hidden bg-white h-[85vh]">
                {!hasError ? (
                  <div className="cursor-pointer block w-full h-full" onClick={openModal}>
                    <img
                      src={menuImage}
                      alt="Bistro Saimaan viikon lounaslista"
                      className="w-full h-full object-contain transition-transform hover:scale-105"
                      onError={() => {
                        console.error('Error loading menu image');
                        setHasError(true);
                      }}
                    />
                  </div>
                ) : (
                  <MenuLoadError />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">
                  Päivitetään joka sunnuntai. Klikkaa kuvaa suurentaaksesi.
                </p>
              </div>
            </div>

            {/* Right side: information */}
            <div className="lg:w-2/5 bg-white p-8 rounded-lg shadow-md flex flex-col h-[85vh] justify-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Ruokailutietoa</h3>

              <p className="text-gray-600 mb-4">
                Tarjoilemme arkisin maittavan ja vaihtelevan lounaan klo 11–14. Lounas sisältää
                runsaan salaattipöydän, tuoretta leipää ja jälkiruokakahvin tai teen.
              </p>

              <p className="text-gray-600 mb-4">
                Ruokalistamme vaihtuu viikoittain sesongin ja saatavuuden mukaan. Erityisruokavaliot
                huomioidaan mahdollisuuksien mukaan – kysythän henkilökunnalta lisätietoja.
              </p>

              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
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
            </div>
          </div>
        </div>
      </div>
      {/* Simple lightbox modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <img
            src={menuImage}
            alt="Bistro Saimaan viikon lounaslista"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl scale-110"
          />
        </div>
      )}
    </section>
  );
}
