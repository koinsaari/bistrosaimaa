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
      className="relative h-screen flex items-center justify-center text-center text-white w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/saimaa-interior_1.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* <video autoPlay muted loop className="absolute w-full h-full object-cover">
        <source
          src="https://videos.pexels.com/video-files/11998490/11998490-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video> */}

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
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Button href="/contact">Tee varauspyyntö</Button>
          <Button href="/menu" variant="outline">
            Näytä menu
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
