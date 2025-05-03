/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import MenuCard from './MenuCard';

const Menu = () => {
  const menuImageUrl = 'https://placehold.co/800x1200/?text=Viikon+ruokalista';
  const weeklyMenuItems = [
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
    <section id="menu" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Viikon ruokalista</h2>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left side, menu card  */}
            <MenuCard menuImageUrl={menuImageUrl} weeklyMenuItems={weeklyMenuItems} />

            {/* Right side, information */}
            <div className="lg:w-2/5 bg-white p-8 rounded-lg shadow-md flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Ruokailutietoa</h3>

              <p className="text-gray-600 mb-4">
                Officia aliquip ipsum esse proident. Laboris dolore irure consectetur dolore magna
                sunt occaecat. Excepteur ex veniam officia commodo ex amet consectetur nulla aliqua.
                Do nulla tempor velit eiusmod excepteur fugiat qui voluptate voluptate veniam ea.
                Adipisicing laboris et quis id proident qui Lorem nisi sint est.
              </p>

              <p className="text-gray-600 mb-4">Ipsum ad ea incididunt est tempor id.</p>

              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-800">Viikon suositus:</h4>
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
    </section>
  );
};

export default Menu;
