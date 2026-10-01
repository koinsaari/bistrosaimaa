import { Suspense } from 'react';
import Hero from './Hero';
import PlaceStrip from './PlaceStrip';
import Offerings from './Offerings';
import LunchThisWeek, { LunchSkeleton } from './LunchThisWeek';
import GalleryPreview from './GalleryPreview';
import Reviews from './Reviews';
import LocationStrip from './LocationStrip';

export default function HomePage() {
  return (
    <div className="font-sans bg-background">
      <Hero />
      <PlaceStrip />
      <Offerings />
      <Suspense fallback={<LunchSkeleton />}>
        <LunchThisWeek />
      </Suspense>
      <GalleryPreview />
      <Reviews />
      <LocationStrip />
    </div>
  );
}
