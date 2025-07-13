/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import { Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Bistro Saimaa</div>
            <p className="text-muted-foreground text-sm max-w-md">
              Ravintola, kabinetit ja pitopalvelut
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            {/* Contact Information */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center justify-center md:justify-start">
                <MapPin className="mr-2 h-5 w-5" />
                Yhteystiedot
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Brahentie 42, 52300 Ristiina</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  <a href="tel:+358504499322" className="hover:text-primary transition-colors">
                    +358 50 4499 322
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  <a
                    href="mailto:bistrosaimaa@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    bistrosaimaa@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center justify-center md:justify-start">
                <Clock className="mr-2 h-5 w-5" />
                Aukioloajat
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between max-w-48 mx-auto md:mx-0">
                  <span>Ma-Pe:</span>
                  <span>07:00 - 20:00</span>
                </div>
                <div className="flex justify-between max-w-48 mx-auto md:mx-0">
                  <span>La:</span>
                  <span>09:00 - 20:00</span>
                </div>
                <div className="flex justify-between max-w-48 mx-auto md:mx-0">
                  <span>Su:</span>
                  <span>11:00 - 20:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/bistrosaimaaoy"
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </a>
            {/* <a href="#" className="hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a> */}
          </div>

          {/* Copyright */}
          <div className="text-center border-t border-border pt-6 w-full">
            <p className="text-muted-foreground text-sm">
              &copy; 2025 Bistro Saimaa Oy. Kaikki oikeudet pidätetään. &nbsp;|&nbsp; Made with 🩵 by{' '}
              <a
                href="https://github.com/koinsaari"
                className="hover:underline transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aaro
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
