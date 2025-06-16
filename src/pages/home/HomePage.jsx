/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import ReviewsSection from './ReviewsSection';
import HeroSection from './HeroSection';
import ContactSection from './ContactSection';
import FeaturedSection from './FeaturedSection';

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <NavigationBar />
      <HeroSection />
      <FeaturedSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
