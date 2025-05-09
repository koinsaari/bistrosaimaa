/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}
