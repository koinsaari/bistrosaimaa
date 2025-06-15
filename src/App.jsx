/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/home/HomePage';
import MenuPage from './pages/menu/MenuPage';
import LunchMenuPage from './pages/lunch_menu/LunchMenuPage';
import ContactPage from './pages/contact/ContactPage';
import AboutPage from './pages/about/AboutPage';
import PrivacyPolicyPage from './pages/privacy/PrivacyPolicyPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        {/* <Route path="/lunch" element={<LunchMenuPage />} /> */}
        <Route path="/contact" element={<ContactPage />} />
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}
