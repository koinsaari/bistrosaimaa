/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyHero = () => (
  <div className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tietosuojaseloste
      </motion.h1>
    </div>
  </div>
);

const PrivacyPolicyContent = () => (
  <motion.div
    className="max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Bistro Saimaan tietosuojaseloste</CardTitle>
        <p className="text-muted-foreground">Viimeksi päivitetty: 14.5.2025</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <p className="text-foreground">
            Tämä tietosuojaseloste kuvaa, miten Bistro Saimaa käsittelee henkilötietoja, joita
            keräämme yhteydenottolomakkeen kautta.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">1. Kerättävät tiedot</h3>
          <p className="text-foreground mb-3">
            Keräämme yhteydenottolomakkeen kautta seuraavat tiedot:
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Nimi</li>
            <li>Sähköpostiosoite</li>
            <li>Puhelinnumero (vapaaehtoinen)</li>
            <li>Yhteydenoton aihe</li>
            <li>Viestin sisältö</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            2. Tietojen käyttötarkoitus
          </h3>
          <p className="text-foreground">
            Kerättyjä tietoja käytetään ainoastaan asiakasviestintään, kuten yhteydenottoihin
            vastaamiseen, varauspyyntöjen käsittelemiseen ja viestien selkeämpään organisointiin
            sähköpostissa.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            3. Tietojen säilytys ja jakaminen
          </h3>
          <p className="text-foreground mb-4">Lomakkeen kautta kerättyjä tietoja:</p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Käsitellään ainoastaan Bistro Saimaan henkilökunnan toimesta</li>
            <li>
              Säilytetään rekisterissä (sähköpostissa) toistaiseksi, ellei poistamista pyydetä
            </li>
            <li>Ei luovuteta kolmansille osapuolille markkinointi- tai muihin tarkoituksiin</li>
            <li>Ei siirretä EU/ETA-alueen ulkopuolelle</li>
            <li>Viestin tekninen välitys tapahtuu Web3Forms-palvelun kautta (web3forms.com)</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">4. Verkkosivuanalytiikka</h3>
          <p className="text-foreground mb-4">
            Käytämme Vercel Analytics -palvelua kerätäksemme anonyymia käyttötietoa sivustostamme:
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Keräämme anonyymiä tietoa sivuston kävijämääristä ja suosituimmista sivuista</li>
            <li>Tietoa käytetään sivuston käytettävyyden ja toiminnan parantamiseen</li>
            <li>Emme yhdistä analytiikkatietoja henkilötietoihin</li>
            <li>Vercel Analytics ei käytä evästeitä eikä kerää yksilöivää käyttäjätietoa</li>
            <li>
              Voit lukea lisää Vercel Analyticsin tietosuojasta osoitteesta:{' '}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                vercel.com/docs/analytics/privacy-policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">5. Rekisteröidyn oikeudet</h3>
          <p className="text-foreground mb-3">Sinulla on oikeus:</p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>
              Tarkastaa mitä tietoja olemme sinusta keränneet, eli viestit joita olet lähettänyt
              lomakkeen kautta
            </li>
            <li>Pyytää tietojesi poistamista sähköpostistamme</li>
            <li>Pyytää tietojesi oikaisemista</li>
          </ul>
          <p className="text-foreground mt-3">
            Voit käyttää näitä oikeuksia ottamalla yhteyttä sähköpostitse osoitteeseen
            bistrosaimaa@gmail.com.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">6. Yhteystiedot</h3>
          <p className="text-foreground mb-3">Rekisterinpitäjä: Bistro Saimaa Oy</p>
          <p className="text-foreground mb-1">Osoite: Brahentie 42, 52300 Ristiina</p>
          <p className="text-foreground mb-1">Puhelin: +358 50 4499 322</p>
          <p className="text-foreground">Sähköposti: bistrosaimaa@gmail.com</p>
        </section>
      </CardContent>
    </Card>
  </motion.div>
);

export default function PrivacyPolicyPageClient() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <PrivacyPolicyHero />

      <div className="container mx-auto px-4 py-12">
        <PrivacyPolicyContent />
      </div>
    </div>
  );
}
