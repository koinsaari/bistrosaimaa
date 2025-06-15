/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';
import FeaturedSection from './FeaturedSection';
import StorySection from './StorySection';
import ReviewsSection from './ReviewsSection';
import HeroSection from './HeroSection';
import ContactSection from './ContactSection';
import EventSection from './EventSection';

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <Banner />
      <NavigationBar />
      <HeroSection />
      <FeaturedSection />
      {/* <StorySection /> */}
      <ReviewsSection />
      {/* <EventSection /> */}
      <ContactSection />
      <Footer />
    </div>
  );
}
