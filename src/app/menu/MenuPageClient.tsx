/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MenuVariant {
  name: string;
  normal?: string;
  big?: string;
}

interface CustomContentCategory {
  name: string;
  items: string[];
}

interface CustomContent {
  title: string;
  categories: CustomContentCategory[];
}

interface MenuItem {
  name: string;
  ingredients: string;
  information: string;
  variants?: MenuVariant[];
  customContent?: CustomContent;
  price?: string;
  dietaryInfo: string[];
}

interface MenuCategory {
  id: string;
  title: string;
  icon: string;
  imageUrl: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
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
      {
        name: 'Lasten lehtipihvi',
        ingredients: 'Naudan lehtipihvi, ranskalaiset, tomaatti, kurkku, maustevoi',
        information: '',
        price: '7,50',
        dietaryInfo: [],
      },
    ],
  },
];

export default function MenuPageClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        id="menu-hero"
        className="relative h-[85vh] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/lounas_3.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Menu
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Tutustu makuelämyksiin täynnä olevaan menuumme
          </motion.p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Category Navigation */}
          <motion.div
            className="flex justify-center mb-16 flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {menuCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-background hover:bg-muted border-2 hover:border-primary/50'
                }`}
                onClick={() =>
                  setActiveCategory(activeCategory === category.id ? null : category.id)
                }
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.title}</span>
              </Button>
            ))}
          </motion.div>

          {/* Menu Categories */}
          <div className="space-y-16">
            {menuCategories.map((category) => (
              <motion.div
                key={category.id}
                className={`${activeCategory && activeCategory !== category.id ? 'hidden' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-center mb-8">
                  <Separator className="flex-1 max-w-16" />
                  <div className="flex items-center gap-3 px-6">
                    <span className="text-4xl">{category.icon}</span>
                    <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
                  </div>
                  <Separator className="flex-1 max-w-16" />
                </div>

                {/* Category Items */}
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={`${category.id}-${itemIndex}`}
                          className="border-b border-border/50 pb-6 last:border-0 last:pb-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 + itemIndex * 0.05 }}
                        >
                          <div className="space-y-3">
                            {/* Item Name */}
                            <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>

                            {/* Ingredients */}
                            {item.ingredients && (
                              <p className="text-muted-foreground leading-relaxed">
                                {item.ingredients}
                              </p>
                            )}

                            {/* Information */}
                            {item.information && (
                              <p className="text-sm text-muted-foreground italic">
                                {item.information}
                              </p>
                            )}

                            {/* Variants */}
                            {item.variants && !item.customContent && (
                              <div className="space-y-2">
                                {category.id === 'pizzas' && item.name === 'Pizzat' ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {item.variants.map((variant, idx) => (
                                      <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/50 rounded-lg gap-2"
                                      >
                                        <span className="font-medium text-foreground">
                                          {variant.name}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="bg-primary/10 text-primary px-3 py-1 text-sm self-start sm:self-auto"
                                        >
                                          {variant.normal} €
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                ) : item.variants.length === 1 ? (
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/50 rounded-lg gap-2">
                                    <span className="font-medium text-foreground">{item.name}</span>
                                    <Badge
                                      variant="secondary"
                                      className="bg-primary/10 text-primary px-3 py-1 text-sm self-start sm:self-auto"
                                    >
                                      {item.variants[0].normal} €
                                    </Badge>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 bg-muted/50 rounded-lg gap-2">
                                      <span className="font-medium text-foreground">
                                        {item.name}
                                      </span>
                                      <div className="flex flex-wrap gap-2">
                                        {item.variants[0].normal && (
                                          <Badge
                                            variant="secondary"
                                            className="bg-primary/10 text-primary px-3 py-1 text-sm"
                                          >
                                            Norm. {item.variants[0].normal} €
                                          </Badge>
                                        )}
                                        {item.variants[0].big && (
                                          <Badge
                                            variant="secondary"
                                            className="bg-primary/10 text-primary px-3 py-1 text-sm"
                                          >
                                            Jätti {item.variants[0].big} €
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    {item.variants[1] && (
                                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 bg-muted/50 rounded-lg gap-2">
                                        <span className="font-medium text-foreground">
                                          {item.name} ateria
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {item.variants[1].normal && (
                                            <Badge
                                              variant="secondary"
                                              className="bg-primary/10 text-primary px-3 py-1 text-sm"
                                            >
                                              Norm. {item.variants[1].normal} €
                                            </Badge>
                                          )}
                                          {item.variants[1].big && (
                                            <Badge
                                              variant="secondary"
                                              className="bg-primary/10 text-primary px-3 py-1 text-sm"
                                            >
                                              Jätti {item.variants[1].big} €
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Custom Content (Pizza Toppings) */}
                            {item.customContent && (
                              <div className="space-y-4">
                                {item.customContent.title && (
                                  <h4 className="font-medium text-foreground">
                                    {item.customContent.title}
                                  </h4>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {item.customContent.categories.map((category, catIndex) => (
                                    <Card key={catIndex} className="bg-muted/30">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-foreground">
                                          {category.name}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="pt-0">
                                        <div className="flex flex-wrap gap-2">
                                          {category.items.map((topping, i) => (
                                            <Badge
                                              key={i}
                                              variant="outline"
                                              className="bg-background text-foreground"
                                            >
                                              {topping}
                                            </Badge>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Regular Price */}
                            {!item.variants && !item.customContent && item.price && (
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/50 rounded-lg gap-2">
                                <span className="font-medium text-foreground">{item.name}</span>
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-primary px-3 py-1 text-sm self-start sm:self-auto"
                                >
                                  {item.price} €
                                </Badge>
                              </div>
                            )}

                            {/* Dietary Info */}
                            {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {item.dietaryInfo.map((info, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-muted text-muted-foreground"
                                  >
                                    {info}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            className="text-center mt-16 py-8 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-muted-foreground">Hinnat sisältävät ALV:n.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
