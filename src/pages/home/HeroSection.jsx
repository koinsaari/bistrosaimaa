/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import Button from '../../components/Button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative h-screen bg-gray-900 flex items-center justify-center text-center text-white w-full"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        className="relative z-10 max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          variants={itemVariants}
        >
          Tervetuloa Bistro Saimaaseen
        </motion.h1>
        <motion.p className="text-xl mb-8" variants={itemVariants}>
          Paikallista ruokaa Saimaan sydämestä
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Button href="/contact">Tee varauspyyntö</Button>
          <Button href="#menu" variant="outline">
            Näytä menu
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
