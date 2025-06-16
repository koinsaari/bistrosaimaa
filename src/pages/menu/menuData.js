/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

export const menuCategories = [
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
        name: 'Pizzat',
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
        name: 'Täytteet',
        ingredients: '',
        information: 'Valitse mieleiset täytteet pizzaasi',
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
            {
              name: 'Erikoistäytteet',
              items: ['Vuohenjuusto (+2,00€)', 'Paholaisenhillo (+2,00€)', 'Valkosipuli (+0,70€)'],
            },
            {
              name: 'Pohja',
              items: ['Ohut', 'Normaali', 'Gluteeniton (+2,50€)', 'Keto (+2,50€)'],
            },
            {
              name: 'Dipit ja lisät (1,00€/kpl)',
              items: ['Chilimajoneesi', 'BBQ-kastike', 'Valkosipulikastike', 'Salaatti'],
            },
          ],
        },
        dietaryInfo: [],
      },
    ],
  },
  {
    id: 'snacks',
    title: 'Pieneen nälkään',
    icon: '🍟',
    imageUrl: '',
    items: [
      {
        name: 'Ranskalaiset pienet',
        ingredients: '',
        information: '',
        price: '3,50',
        dietaryInfo: [],
      },
      {
        name: 'Ranskalaiset isot',
        ingredients: '',
        information: '',
        price: '4,90',
        dietaryInfo: [],
      },
      {
        name: 'Auraranskalaiset pienet',
        ingredients: '',
        information: '',
        price: '5,50',
        dietaryInfo: [],
      },
      {
        name: 'Auraranskalaiset isot',
        ingredients: '',
        information: '',
        price: '6,90',
        dietaryInfo: [],
      },
      {
        name: 'Dippikori',
        ingredients:
          'Ranskalaiset, mozzarellatikkuja, kanafilefinger 2 kpl, sipulirengas 2 kpl, majoneesi, ketsuppi, tomaatti, kurkku',
        information: '',
        price: '9,90',
        dietaryInfo: [],
      },
      {
        name: 'Kanakori',
        ingredients: 'Ranskalaiset, kanafilefinger, ketsuppi, valitse dippi, tomaatti, kurkku',
        information: '',
        price: '9,90',
        dietaryInfo: [],
      },
      {
        name: 'Makkarakori',
        ingredients: 'Ranskalaiset, makkaraa, tomaatti, kurkku',
        information: '',
        price: '8,90',
        dietaryInfo: [],
      },
      {
        name: 'Saimaan makkis-pekkis kori',
        ingredients:
          'Makkaraa, paistettu kananmuna, pekonia, ranskalaiset, sipuli, ketsuppi, sinappi',
        information: '',
        price: '9,90',
        dietaryInfo: [],
      },
      {
        name: 'Dipit ja extraa',
        ingredients: '',
        information: '',
        customContent: {
          title: '',
          categories: [
            {
              name: 'Dipit (1,00€/kpl)',
              items: [
                'Hampurilaismajoneesi',
                'Chilimajoneesi',
                'Remoulademajoneesi',
                'Currymajoneesi',
                'Valkosipulimajoneesi',
                'Makea chilikastike',
                'Barbequekastike',
                'Barbequemajoneesi',
              ],
            },
            {
              name: 'Extraa',
              items: [
                'Mozzarella tikut 5 kpl (5,00€)',
                'Sipulirenkaat 5 kpl (4,00€)',
                'Kanafilefingerit 5 kpl (5,50€)',
              ],
            },
          ],
        },
        dietaryInfo: [],
      },
    ],
  },
  {
    id: 'kids',
    title: 'Lasten menu',
    icon: '👶',
    imageUrl: '',
    items: [
      {
        name: 'Makkarakori',
        ingredients: 'Makkaraa, ranskalaisia, tomaattia, kurkkua ja ketsuppia.',
        information: '',
        price: '5,50',
        dietaryInfo: [],
      },
      {
        name: 'Kanakori',
        ingredients: 'Kanafiletikkuja, ranskalaisia, tomaattia, kurkkua ja ketsuppia.',
        information: '',
        price: '6,00',
        dietaryInfo: [],
      },
      {
        name: 'Dippikori',
        ingredients:
          'Kanafile- ja mozarellatikkuja, sipulirenkaita, ranskalaisia, ketsuppia, talon majoneesia, tomaattia ja kurkkua.',
        information: '',
        price: '6,50',
        dietaryInfo: [],
      },
      {
        name: 'Lasten pizza',
        ingredients: 'Pizzaan kuuluu juusto ja tomaattikastike.',
        information: 'Valitse kaksi täytettä.',
        price: '7,50',
        dietaryInfo: [],
      },
    ],
  },
];
