/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

const EventSection = () => {
  return (
    <section id="events" className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Tapahtumakalenteri</h2>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch bg-white rounded-lg shadow-md overflow-hidden">
            {/* Left side: Google Calendar */}
            <div className="lg:w-3/5">
              <div className="h-[500px] md:h-[600px] w-full">
                <iframe
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FHelsinki&showPrint=0&showTz=0&title=Bistro%20Saimaan%20tapahtumakalenteri&hl=fi&src=ZDUwNDlmNGNlZWIyMmJhNWU3NGViMmRlY2ZhNDY0ZjJhMjEyZTc2N2IxZjg2YzczNWQ3MzVlYWIwYWEwNDAzNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5"
                  style={{ borderWidth: 0 }}
                  width="100%"
                  height="100%"
                  title="Bistro Saimaan tapahtumakalenteri"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Right side: Event information */}
            <div className="lg:w-2/5 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Tule mukaan tapahtumiimme!</h3>

              <p className="text-gray-600 mb-4">
                Bistro Saimaa järjestää monipuolisia tapahtumia ympäri vuoden. Kalenteristamme
                löydät esimerkiksi bingoiltoja, teemallisia tapahtumia sekä erikoismenuita
                juhlapäivien kunniaksi.
              </p>

              <p className="text-gray-600 mb-6">
                Voit myös varata pöydän kätevästi soittamalla numeroon:{' '}
                <a href="tel:+358504499322" className="text-emerald-600 font-medium hover-effect">
                  +358 50 4499 322
                </a>{' '}
                tai lähettämällä sähköpostia osoitteeseen{' '}
                <a
                  href="mailto:bistrosaimaa@gmail.com"
                  className="text-emerald-600 font-medium hover-effect"
                >
                  bistrosaimaa@gmail.com
                </a>
                .
              </p>

              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-4">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-800">Tuleva tapahtuma:</h4>
                    <p className="font-medium text-gray-800">
                      {' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="text-emerald-700 hover-effect cursor-pointer"
                      >
                        Äitienpäivämenu
                      </a>{' '}
                      11.5.2025
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500 italic">
                Joihinkin tapahtumiin saatetaan vaatia pöytävaraus. Tarkista yksityiskohdat
                klikkaamalla tapahtumaa kalenterissa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSection;
