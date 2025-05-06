/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import './App.css';
import NavigationBar from './components/Navigation';
import Footer from './components/Footer';
import Banner from './components/Banner';
import FeaturedSection from './sections/home/FeaturedSection';
import Menu from './components/Menu';
import StorySection from './sections/home/StorySection';
import ReviewsSection from './sections/home/ReviewsSection';
import HeroSection from './sections/home/HeroSection';
import ContactSection from './sections/home/ContactSection';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Banner />
      <NavigationBar />
      <HeroSection />
      <FeaturedSection />
      <StorySection />
      <ReviewsSection />
      <Menu />
      <ContactSection />
      <Footer />
    </div>
  );
}
