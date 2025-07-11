/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Facebook, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactForm from './ContactForm';

const ContactHero = () => (
  <div id="contact-hero" className="bg-black/30 text-white py-48 relative overflow-hidden">
    <div className="absolute inset-0">
      <Image src="/kakku.jpeg" alt="" fill className="object-cover" />
    </div>
    <div className="absolute inset-0 bg-black/20"></div>

    <div className="container mx-auto px-4 relative z-10">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Ota yhteyttä
      </motion.h1>

      <motion.p
        className="text-center text-lg md:text-xl max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Varaa kabinetti, tilaa pitopalvelu tai kysy lisää
      </motion.p>
    </div>
  </div>
);

const ContactInfoCard = () => (
  <motion.div
    className="lg:w-2/5"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Bistro Saimaa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground">Osoite</h3>
            <p className="text-muted-foreground">
              Brahentie 42
              <br />
              52300 Ristiina
            </p>
            <a
              href="https://maps.google.com/?q=Bistro+Saimaa+Ristiina"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm mt-1 inline-flex items-center space-x-1"
            >
              <span>Näytä kartalla</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground">Puhelin</h3>
            <p className="text-muted-foreground">
              <a href="tel:+358504499322" className="hover:text-primary transition-colors">
                +358 50 4499 322
              </a>
            </p>
          </div>
        </div>

        {/* Email with tooltip */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground">Sähköposti</h3>
            <div className="relative group">
              <p className="text-muted-foreground">
                <a
                  href="mailto:bistrosaimaa@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  bistrosaimaa@gmail.com
                </a>
              </p>

              <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-10">
                <div className="bg-popover text-popover-foreground text-xs rounded-md py-2 px-3 max-w-xs shadow-lg border border-border">
                  <p>
                    Toivomme, että käytät ensisijaisesti sivulla olevaa lomaketta. Se helpottaa
                    meillä yhteydenottoviestien lajittelua ja varmistaa nopeamman vastauksen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground">Aukioloajat</h3>
            <div className="grid grid-cols-[100px_auto] gap-y-1 text-muted-foreground">
              <span>Ma-Pe:</span> <span>07:00 - 20:00</span>
              <span>La:</span> <span>09:00 - 20:00</span>
              <span>Su:</span> <span>11:00 - 20:00</span>
            </div>
          </div>
        </div>

        {/* Social media */}
        <div className="pt-4 border-t border-border text-center">
          <h3 className="font-medium text-foreground mb-3">Sosiaalinen media</h3>
          <div className="flex justify-center space-x-6 mt-3">
            <a
              href="https://www.facebook.com/bistrosaimaaoy"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary h-12 w-12 rounded-full flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            {/* <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary h-12 w-12 rounded-full flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a> */}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const MapSection = () => (
  <motion.div
    className="mt-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sijainti</CardTitle>
      </CardHeader>
      <div className="h-[400px] w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1903.368771025145!2d27.256036077234!3d61.50666667574106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469073801b964d6d%3A0xa50b1dbd31d8cb94!2sBistro%20Saimaa!5e0!3m2!1sfi!2sfi!4v1746872264794!5m2!1sfi!2sfi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bistro Saimaa sijainti"
          className="w-full h-full"
        ></iframe>
      </div>

      <CardContent className="p-6">
        <p className="text-muted-foreground">
          Bistro Saimaa sijaitsee Ristiinan laitamilla, vain 20 minuutin ajomatkan päässä
          Mikkelistä.
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ContactPageContent() {
  return (
    <div className="font-sans bg-background">
      <ContactHero />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <ContactInfoCard />
            <ContactForm initialSubject="Kabinettivaraus" className="lg:w-3/5" />
          </div>
          <MapSection />
        </div>
      </div>
    </div>
  );
}
