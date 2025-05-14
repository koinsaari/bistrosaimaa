/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { motion } from 'framer-motion';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';

const PrivacyPolicyHero = () => (
  <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-16 relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <img src="" alt="" className="w-full h-full object-cover" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tietosuojaseloste
      </motion.h1>
    </div>
  </div>
);

const PrivacyPolicyContent = () => (
  <motion.div
    className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bistro Saimaan tietosuojaseloste</h2>
      <p className="text-gray-600 mb-4">Viimeksi päivitetty: 11.5.2025</p>
      <p className="text-gray-700">
        Tämä tietosuojaseloste kuvaa, miten Bistro Saimaa käsittelee henkilötietoja, joita keräämme
        yhteydenottolomakkeen kautta.
      </p>
    </section>

    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Kerättävät tiedot</h3>
      <p className="text-gray-700 mb-3">Keräämme yhteydenottolomakkeen kautta seuraavat tiedot:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Nimi</li>
        <li>Sähköpostiosoite</li>
        <li>Puhelinnumero (vapaaehtoinen)</li>
        <li>Yhteydenoton aihe</li>
        <li>Viestin sisältö</li>
      </ul>
    </section>

    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Tietojen käyttötarkoitus</h3>
      <p className="text-gray-700">
        Kerättyjä tietoja käytetään ainoastaan asiakasviestintään, kuten yhteydenottoihin
        vastaamiseen, varauspyyntöjen käsittelemiseen ja viestien selkeämpään organisointiin
        sähköpostissa.
      </p>
    </section>

    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        3. Tietojen säilytys ja jakaminen
      </h3>
      <p className="text-gray-700 mb-4">Lomakkeen kautta kerättyjä tietoja:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Käsitellään ainoastaan Bistro Saimaan henkilökunnan toimesta</li>
        <li>Säilytetään rekisterissä (sähköpostissa) toistaiseksi, ellei poistamista pyydetä</li>
        <li>Ei luovuteta kolmansille osapuolille markkinointi- tai muihin tarkoituksiin</li>
        <li>Ei siirretä EU/ETA-alueen ulkopuolelle</li>
        <li>Viestin tekninen välitys tapahtuu Web3Forms-palvelun kautta (web3forms.com)</li>
      </ul>
    </section>

    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Rekisteröidyn oikeudet</h3>
      <p className="text-gray-700 mb-3">Sinulla on oikeus:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>
          Tarkastaa mitä tietoja olemme sinusta keränneet, eli viestit joita olet lähettänyt
          lomakkeen kautta
        </li>
        <li>Pyytää tietojesi poistamista sähköpostistamme</li>
        <li>Pyytää tietojesi oikaisemista</li>
      </ul>
      <p className="text-gray-700 mt-3">
        Voit käyttää näitä oikeuksia ottamalla yhteyttä sähköpostitse osoitteeseen
        bistrosaimaa@gmail.com.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Yhteystiedot</h3>
      <p className="text-gray-700 mb-3">Rekisterinpitäjä: Bistro Saimaa Oy</p>
      <p className="text-gray-700 mb-1">Osoite: Brahentie 42, 52300 Ristiina</p>
      <p className="text-gray-700 mb-1">Puhelin: +358 50 4499 322</p>
      <p className="text-gray-700">Sähköposti: bistrosaimaa@gmail.com</p>
    </section>
  </motion.div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Banner />
      <NavigationBar />
      <PrivacyPolicyHero />

      <div className="container mx-auto px-4 py-12 text-left">
        <PrivacyPolicyContent />
      </div>

      <Footer />
    </div>
  );
}
