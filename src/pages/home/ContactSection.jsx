/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-emerald-700 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 place-items-center gap-16">
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold mb-6">Aukioloajat</h2>
            <ul className="space-y-2">
              <li className="flex justify-between gap-8">
                <span>Maanantai-Perjantai:</span>
                <span>7:00 - 20:00</span>
              </li>
              <li className="flex justify-between gap-8">
                <span>Lauantai:</span>
                <span>9:00 - 20:00</span>
              </li>
              <li className="flex justify-between gap-8">
                <span>Sunnuntai:</span>
                <span>11:00 - 20:00</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Löydät meidät</h2>
            <address className="not-italic space-y-2">
              <p>
                <a
                  href="https://maps.google.com/?q=Brahentie+42,+52300+Ristiina,+Finland"
                  className="text-white underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Brahentie 42
                </a>
              </p>
              <p>
                <a
                  href="https://maps.google.com/?q=Ristiina,+Finland"
                  className="text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  52300 Ristiina
                </a>
              </p>
              <p>
                Puhelin:&nbsp;
                <a href="tel:+358504499322" className="text-white ">
                  +358 50 4499 322
                </a>
              </p>
              <p>
                Sähköposti:&nbsp;
                <a href="mailto:bistrosaimaa@gmail.com" className="text-white ">
                  bistrosaimaa@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
