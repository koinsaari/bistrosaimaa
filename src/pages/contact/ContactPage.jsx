/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';
import ContactForm from '../../components/ContactForm';

const ContactHero = () => (
  <div
    id="contact-hero"
    className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-24 relative overflow-hidden"
  >
    <div className="absolute inset-0 opacity-20">
      <img src="/images/contact-pattern.jpg" alt="" className="w-full h-full object-cover" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Ota yhteyttä
      </motion.h1>

      <motion.p
        className="text-center text-lg md:text-xl max-w-2xl mx-auto text-emerald-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Varaa kabinetti, tilaa pitopalvelu tai kysy lisää
      </motion.p>
    </div>
  </div>
);

const ContactInfoCard = () => (
  <motion.div
    className="lg:w-2/5"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-64 overflow-hidden">
        <img
          src="https://placehold.co/600x400/?text=Bistro+Saimaa+kuva"
          alt="Bistro Saimaa julkisivu"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bistro Saimaa</h2>

        <div className="space-y-6 px-6">
          {/* Address */}
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <span className="text-xl">📍</span>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800">Osoite</h3>
              <p className="text-gray-600">
                Brahentie 42
                <br />
                52300 Ristiina
              </p>
              <a
                href="https://maps.google.com/?q=Bistro+Saimaa+Ristiina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 text-sm mt-1 inline-block"
              >
                Näytä kartalla →
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <span className="text-xl">📞</span>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800">Puhelin</h3>
              <p className="text-gray-600">
                <a href="tel:+358504499322" className="hover:text-emerald-600">
                  +358 50 4499 322
                </a>
              </p>
            </div>
          </div>

          {/* Email with tooltip */}
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <span className="text-xl">📧</span>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800">Sähköposti</h3>
              <div className="relative group">
                <p className="text-gray-600">
                  <a href="mailto:bistrosaimaa@gmail.com" className="hover:text-emerald-600">
                    bistrosaimaa@gmail.com
                  </a>
                </p>

                <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-10">
                  <div className="bg-gray-800 text-white text-xs rounded py-2 px-3 max-w-xs shadow-lg">
                    <p>
                      Toivomme, että käytät ensisijaisesti sivulla olevaa lomaketta. Se helpottaa
                      meillä yhteydenottoviestien lajittelua ja varmistaa nopeamman vastauksen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <span className="text-xl">🕒</span>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800">Aukioloajat</h3>
              <div className="grid grid-cols-[100px_auto] gap-y-1 text-gray-600">
                <span>Ma-To:</span> <span>11:00 - 21:00</span>
                <span>Pe-La:</span> <span>11:00 - 23:00</span>
                <span>Su:</span> <span>12:00 - 20:00</span>
              </div>
            </div>
          </div>

          {/* Social media */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <h3 className="font-medium text-gray-800 mb-3">Sosiaalinen media</h3>
            <div className="flex justify-center space-x-6 mt-3">
              <a
                href="https://www.facebook.com/bistrosaimaaoy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-600 h-12 w-12 rounded-full flex items-center justify-center transition-colors"
                arial-label="Facebook"
              >
                <FaFacebookF className="text-xl" />
              </a>
              <a
                href="" // TODO
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-600 h-12 w-12 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const MapSection = () => (
  <motion.div
    className="mt-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Löydä perille</h2>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-[400px] w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1903.368771025145!2d27.256036077234!3d61.50666667574106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469073801b964d6d%3A0xa50b1dbd31d8cb94!2sBistro%20Saimaa!5e0!3m2!1sfi!2sfi!4v1746872264794!5m2!1sfi!2sfi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bistro Saimaa sijainti"
          className="w-full h-full"
        ></iframe>
      </div>

      <div className="p-6">
        <p className="text-gray-700">
          Bistro Saimaa sijaitsee Ristiinan laitamilla, vain 20 minuutin ajomatkan päässä
          Mikkelistä, valtatien 15 varrella.
        </p>
      </div>
    </div>
  </motion.div>
);

export default function ContactPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Banner />
      <NavigationBar />
      <ContactHero />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <ContactInfoCard />
            <ContactForm initialSubject="Kabinettivaraus" className="lg:w-3/5" />
          </div>
          <MapSection />
        </div>
      </div>

      <Footer />
    </div>
  );
}
