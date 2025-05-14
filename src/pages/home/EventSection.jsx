/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import FeatureCard from '../../components/FeatureCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Mousewheel, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';

const EventCalendarInfoCard = () => {
  return (
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
          Bistro Saimaa järjestää monipuolisia tapahtumia ympäri vuoden. Kalenteristamme löydät
          esimerkiksi bingoiltoja sekä muita tapahtumia ja erikoismenuita juhlapäivien kunniaksi.
        </p>

        <p className="text-gray-600 mb-6">
          Voit myös varata pöydän kätevästi soittamalla numeroon:{' '}
          <a href="tel:+358504499322" className="text-emerald-600 font-medium hover-effect">
            +358 50 4499 322
          </a>
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
          Joihinkin tapahtumiin saatetaan vaatia pöytävaraus. Tarkista yksityiskohdat klikkaamalla
          tapahtumaa kalenterissa.
        </p>
      </div>
    </div>
  );
};

const PastEventsSection = () => {
  const pastEvents = [
    {
      id: 1,
      image: 'https://placehold.co/600x400/?text=Tapahtuma+1',
      title: 'Tapahtuma 1',
      date: '12.4.2025',
      description: 'Sit consequat irure est ullamco qui magna culpa eu dolore consectetur ad.',
      buttonText: 'Katso kuvat',
      buttonLink: '',
    },
    {
      id: 2,
      image: 'https://placehold.co/600x400/?text=Tapahtuma+2',
      title: 'Tapahtuma 2',
      date: '15.2.2025',
      description:
        'Irure nulla consequat deserunt consectetur nulla non proident laboris voluptate sunt anim excepteur.',
      buttonText: 'Katso kuvat',
      buttonLink: '',
    },
    {
      id: 3,
      image: 'https://placehold.co/600x400/?text=Tapahtuma+3',
      title: 'Tapahtuma 3',
      date: '23.1.2025',
      description: 'Laborum consequat ea excepteur Lorem ipsum minim aute non adipisicing.',
      buttonText: 'Katso kuvat',
      buttonLink: '',
    },
    {
      id: 4,
      image: 'https://placehold.co/600x400/?text=Tapahtuma+4',
      title: 'Tapahtuma 4',
      date: '10.12.2024',
      description: 'Cillum fugiat nulla adipisicing tempor.',
      buttonText: 'Katso kuvat',
      buttonLink: '',
    },
    {
      id: 5,
      image: 'https://placehold.co/600x400/?text=Taphtuma+5',
      title: 'Tapahtuma 5',
      date: '31.10.2024',
      description: 'Esse voluptate irure culpa ut qui.',
      buttonText: 'Katso kuvat',
      buttonLink: '',
    },
  ];

  return (
    <div className="py-12">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-700">Menneitä tapahtumiamme</h3>
      <div className="relative">
        {/* Scroll indication shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-emerald-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-50 to-transparent z-10"></div>
        <Swiper
          className="py-4"
          modules={[Autoplay, Pagination, Mousewheel, FreeMode]}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          loop={true}
          speed={2000}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          grabCursor={true}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
          }}
          freeMode={{
            enabled: true,
            momentum: false,
            sticky: false,
          }}
          observer={true}
          observeParents={true}
        >
          {pastEvents.map((event) => (
            <SwiperSlide key={event.id} className="w-auto pb-12">
              <FeatureCard
                image={event.image}
                title={`${event.title} - ${event.date}`}
                description={event.description}
                buttonText={event.buttonText}
                buttonLink={event.buttonLink}
                flippable={false}
                height="h-96"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Pyyhkäise tai vieritä selataksesi menneitä tapahtumia
      </p>
    </div>
  );
};

export default function EventSection() {
  return (
    <section id="events" className="pt-16 pb-4 bg-emerald-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Tapahtumakalenteri</h2>

        <div className="max-w-6xl mx-auto">
          <EventCalendarInfoCard />
          <PastEventsSection />
        </div>
      </div>
    </section>
  );
}
