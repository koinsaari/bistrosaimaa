/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import FlippableMenuCard from '../../components/FlippableMenuCard';

export default function MenuSection() {
  const menuImageUrl = 'https://placehold.co/800x1200/?text=Menu';
  const menuItems = [
    {
      name: 'Savulohikeitto',
      ingredients: 'Savulohta, perunaa, purjoa, tilliä, kermaa',
      dietaryInfo: ['🐟 Sisältää kalaa', '🥛 Sisältää maitotuotteita', '🧅 Gluteeniton'],
    },
    {
      name: 'Paistettu siika & tilliperunat',
      ingredients: 'Tuore siikafilee, tillillä maustetut varhaisperunat, sitruunavoikastike',
      dietaryInfo: ['🐟 Sisältää kalaa', '🧈 Sisältää maitotuotteita'],
    },
    {
      name: 'Halloumisalaatti',
      ingredients: 'Paistettua halloumia, salaattisekoitus, paahdettuja siemeniä, hunajavinegretti',
      dietaryInfo: ['🌱 Kasvis', '🥛 Sisältää maitotuotteita'],
    },
    {
      name: 'Karitsan entrecôte & punaviinikastike',
      ingredients: 'Grillattua karitsan entrecôtea, juurespyreetä, punaviinikastiketta',
      dietaryInfo: ['🥩 Sisältää lihaa', '🌾 Sisältää viljatuotteita'],
    },
    {
      name: 'Kesäinen kasvispasta',
      ingredients: 'Tagliatellea, paahdettuja kasviksia, yrttiöljyä, parmesania',
      dietaryInfo: ['🌱 Kasvis', '🌾 Sisältää viljatuotteita', '🥛 Sisältää maitotuotteita'],
    },
    {
      name: 'Mansikkapavlova',
      ingredients: 'Marenkipohja, kermavaahtoa, tuoreita mansikoita, minttua',
      dietaryInfo: ['🥚 Sisältää kananmunaa', '🥛 Sisältää maitotuotteita'],
    },
  ];

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">À la carte menu</h2>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left side: flippable card */}
            <div className="flex flex-col w-full lg:w-3/5">
              <FlippableMenuCard menuImageUrl={menuImageUrl} weeklyMenuItems={menuItems} />
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">
                  Klikkaa nähdäksesi tarkemmat tiedot annoksista ja niiden sisällöistä.
                </p>
              </div>
            </div>

            {/* Right side: information */}
            <div className="lg:w-2/5 bg-white p-8 rounded-lg shadow-md flex flex-col justify-center h-[550px] sm:h-[600px]">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">
                Maistuvaa ruokaa Saimaan rannalta
              </h3>

              <p className="text-gray-600 mb-4">
                À la carte -listaltamme löydät huolella valmistettuja annoksia. Panostamme
                paikallisiin raaka-aineisiin ja perinteisiin makuihin modernilla twistillä.
              </p>

              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
                    <span className="text-2xl">👨‍🍳</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-800">
                      Keittiömestarin suositus:
                    </h4>
                    <p className="font-medium text-gray-800">Savulohikeitto ja tilliperunat</p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500 italic">
                Huomioithan, että hinnat ja saatavuus voivat vaihdella. Ajankohtaisin menu löytyy
                aina ravintolastamme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
