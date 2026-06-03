import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import MenuPageClient from './MenuPageClient';
import { routing, type Locale } from '@/i18n/routing';
import { localeAlternates } from '@/i18n/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadata.menu' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    robots: { index: true, follow: true },
    alternates: localeAlternates('/menu', locale as Locale),
  };
}

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': 'https://bistrosaimaa.fi/menu',
  name: 'Bistro Saimaa Menu 2026',
  url: 'https://bistrosaimaa.fi/menu',
  inLanguage: ['fi', 'en'],
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Burgers',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Hamburger',
          description: 'Hamburger mayonnaise, lettuce, pickles',
          offers: { '@type': 'Offer', price: '5.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Cheeseburger',
          description: 'Hamburger mayonnaise, lettuce, pickles, cheddar-cheese',
          offers: { '@type': 'Offer', price: '5.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Devil's Burger",
          description: 'Chiilimayonnaise, lettuce, tomato, red onion, pickles, jalapeño',
          offers: { '@type': 'Offer', price: '7.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Bacon Burger',
          description: 'Hamburger mayonnaise, red onion, pickles, bacon, fried egg, sriracha',
          offers: { '@type': 'Offer', price: '7.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Bluecheese Burger',
          description: 'Hamburger mayonnaise, red onion, pickles, bluecheese',
          offers: { '@type': 'Offer', price: '7.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Bluecheese-Bacon Burger',
          description: 'Hamburger mayonnaise, lettuce, tomato, pickles, bacon, bluecheese, remoulade',
          offers: { '@type': 'Offer', price: '7.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Chicken Burger',
          description: 'Curry mayonnaise, lettuce, tomato, pickles, pineapple ring',
          offers: { '@type': 'Offer', price: '7.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Goat Cheese Burger',
          description: 'Hamburger mayonnaise, lettuce, tomato, red onion, pickles, pineapple, Devil\'s jam, goat cheese',
          offers: { '@type': 'Offer', price: '8.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Double Cheese Burger',
          description: 'Hamburger mayonnaise, lettuce, tomato, double big-steak, double cheddar-cheese',
          offers: { '@type': 'Offer', price: '7.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Lumberjack',
          description: 'Hamburger mayonnaise, lettuce, tomato, red onion, pickles, bacon, double big steak, koskenlaskija-cheese',
          offers: { '@type': 'Offer', price: '11.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Astuvan Akke',
          description: 'Hamburger mayonnaise, red onion, pineapple ring, double big-steak, double cheddar-cheese, remoulade mayonnaise',
          offers: { '@type': 'Offer', price: '11.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Astuvan Ukko',
          description: 'Hamburger mayonnaise, red onion, triple big steak, triple cheddar-cheese, BBQ-sauce',
          offers: { '@type': 'Offer', price: '12.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Saimaan Open Burger',
          description: 'Two hamburgers as an open burger with cucumber mayonnaise, lettuce, tomato, pickles, bacon, Montereyjack-cheese, chipotle-ranch mayonnaise, Devil\'s jam',
          offers: { '@type': 'Offer', price: '12.90', priceCurrency: 'EUR' },
        },
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Pizzas',
      description: 'Large pizzas. Build your own with 1–4 toppings from €11–€14.',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Basic Pizza',
          description: 'Ham, pineapple, bluecheese',
          offers: { '@type': 'Offer', price: '13.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'BBQ Chicken Pizza',
          description: 'Chicken, bluecheese, red onion, BBQ-sauce',
          offers: { '@type': 'Offer', price: '14.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Metti Pizza',
          description: 'Ham, minced meat, kebab, salami-sausage, bluecheese',
          offers: { '@type': 'Offer', price: '15.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Four Cheeses Pizza',
          description: 'Mozzarella, double cheese, blue cheese, feta',
          offers: { '@type': 'Offer', price: '14.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Tomalo-Mozzarella Pizza',
          description: 'Fresh tomato, mozzarella, arugula, olive, balsamic-sauce',
          offers: { '@type': 'Offer', price: '14.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Burger Pizza',
          description: 'Minced meat, cheddar, pickles, salad, thousand island-salad dressing',
          offers: { '@type': 'Offer', price: '14.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Devil's Chicken Pizza",
          description: 'Chicken, goat cheese, arugula, redanion, Devil\'s jam',
          offers: { '@type': 'Offer', price: '16.50', priceCurrency: 'EUR' },
        },
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'À la carte',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Grilled Chicken Steak',
          description: 'Grilled chicken, grilled vegetables. Choice of French fries or potato wedges',
          offers: { '@type': 'Offer', price: '15.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Breaded Pork Steak',
          description: 'Breaded pork steak, grilled vegetables. Choice of French fries or potato wedges',
          offers: { '@type': 'Offer', price: '15.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Grilled Devil's Chicken",
          description: 'Grilled chicken, grilled vegetables, goat cheese, pineapple, bearnaise sauce. Choice of French fries or potato wedges',
          offers: { '@type': 'Offer', price: '16.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Beef's Leaf Steak",
          description: "Beef's leaf steak, grilled vegetables, grillbutter. Choice of French fries or potato wedges",
          offers: { '@type': 'Offer', price: '16.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Hunter's Bread",
          description: 'Breaded pork steak, wild-mushroom sauce, toasted bread, salad, cucumber, tomato',
          offers: { '@type': 'Offer', price: '12.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Houses Bread',
          description: "Grilled chicken steak, pineapple, bearnaise sauce, Devil's jam, salad, cucumber, tomato, toasted bread",
          offers: { '@type': 'Offer', price: '12.90', priceCurrency: 'EUR' },
        },
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Salads',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Greek Salad',
          description: 'Salad, cucumber, tomato, feta, red onion, olives, salad dressing cup',
          offers: { '@type': 'Offer', price: '11.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Salad with Chicken',
          description: 'Salad, cucumber, tomato, grilled chicken, peach, red pepper, salad dressing cup',
          offers: { '@type': 'Offer', price: '12.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Salad with Tuna',
          description: 'Salad, cucumber, tomato, red onion, olives, salad dressing cup',
          offers: { '@type': 'Offer', price: '12.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Salad with Chicken and Bacon',
          description: 'Salad, cucumber, grilled chicken, red onion, bacon, blue cheese, salad dressing cup',
          offers: { '@type': 'Offer', price: '13.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Salad with Goat Cheese',
          description: "Salad, cucumber, tomato, peach, olives, goat cheese, Devil's jam",
          offers: { '@type': 'Offer', price: '13.50', priceCurrency: 'EUR' },
        },
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'From the Grill',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Fries with Sausage',
          description: 'Crinkle fries, sausage, tomato, cucumber, red onion, cucumber salad',
          offers: { '@type': 'Offer', price: '10.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Saimaa's Makkis-Pekkis",
          description: 'Crinkle fries, sausage, bacon, tomato, cucumber, red onion, cucumber salad, fried egg',
          offers: { '@type': 'Offer', price: '11.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Chicken Basket',
          description: 'Crinkle fries, six chicken fingers, tomato, cucumber, dip of your choice',
          offers: { '@type': 'Offer', price: '10.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Dip Basket',
          description: 'Crinkle fries, two chicken fingers, two mozzarella sticks, two onion rings, tomato, cucumber',
          offers: { '@type': 'Offer', price: '10.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Garlic Delicacy',
          description: 'Crinkle fries, tomato, cucumber, red onion, three hamburger patty, garlic dressing jo garlic butter, pickles (with your choice bluecheese +1€)',
          offers: { '@type': 'Offer', price: '13.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Delicious Grill Plate',
          description: 'Crinkle fries, sausage, tomato, cucumber, red onion, cucumber salad, two hamburger patty, bacon, bluecheese, garlic butter',
          offers: { '@type': 'Offer', price: '14.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Loaded Fries',
          description: 'Crinkle fries, pickled red onion, cheddar sauce',
          offers: { '@type': 'Offer', price: '6.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Small French Fries',
          offers: { '@type': 'Offer', price: '3.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Large French Fries',
          offers: { '@type': 'Offer', price: '4.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Mozzarella Sticks',
          offers: { '@type': 'Offer', price: '5.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Onion Rings',
          offers: { '@type': 'Offer', price: '5.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Chicken Fingers',
          offers: { '@type': 'Offer', price: '6.50', priceCurrency: 'EUR' },
        },
      ],
    },
    {
      '@type': 'MenuSection',
      name: "Children's Menu",
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Fries with Sausage (children)',
          description: 'Crinkle fries, sausage, tomato, cucumber, ketchup-dip',
          offers: { '@type': 'Offer', price: '6.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Kanakori',
          description: 'Crinkle fries, tomato, cucumber, three chicken fingers, hamburger mayonnaise dip',
          offers: { '@type': 'Offer', price: '7.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Dippikori',
          description: 'Crinkle fries, one chicken finger, one onion ring, one mozzarella stick, tomato, cucumber, hamburger mayonnaise dip',
          offers: { '@type': 'Offer', price: '7.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: "Children's Pizza",
          description: 'Small size pizza with two toppings of your choice',
          offers: { '@type': 'Offer', price: '8.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Burger Meal (children)',
          description: 'Burger with patty, ketchup, cheddar, bun, fries, drink 0.33l soda or juice box',
          offers: { '@type': 'Offer', price: '8.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Dip Vegetables (children)',
          description: 'Cucumber, tomato, carrot sticks with dip of your choice',
          offers: { '@type': 'Offer', price: '3.50', priceCurrency: 'EUR' },
        },
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Vegetarian Menu',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: 'Basket with Vegan Frankfurters',
          description: 'Crinkle fries, vegan frankfurters, tomato, cucumber, ketchup-dip',
          offers: { '@type': 'Offer', price: '10.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Basket with Vegan Nuggets',
          description: 'Crinkle fries, tomato, cucumber, six vegan nuggets, vegan mayonnaise dip',
          offers: { '@type': 'Offer', price: '10.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Delicious Basket (veg)',
          description: 'Crinkle fries, vegan frankfurters, three vegan nuggets, tomato, cucumber, vegan mayonnaise dip',
          offers: { '@type': 'Offer', price: '11.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Dip Vegetables (veg)',
          description: 'Cucumber, tomato, carrot sticks, vegan mayonnaise dip',
          offers: { '@type': 'Offer', price: '3.50', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Vegan Cheese Pizza',
          description: 'Vegan pizza with toppings of your choice',
          offers: { '@type': 'Offer', price: '12.00', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Vegan Burger',
          description: 'Vegan mayonnaise, lettuce, tomato, red onion, pineapple, pickles, Devil\'s jam, vegan patty',
          offers: { '@type': 'Offer', price: '8.90', priceCurrency: 'EUR' },
        },
        {
          '@type': 'MenuItem',
          name: 'Goat Cheese Burger (veg)',
          description: 'Hamburger mayonnaise, lettuce, tomato, red onion, pickles, pineapple, Devil\'s jam, goat cheese',
          offers: { '@type': 'Offer', price: '8.90', priceCurrency: 'EUR' },
        },
      ],
    },
  ],
};

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <MenuPageClient />
    </>
  );
}
