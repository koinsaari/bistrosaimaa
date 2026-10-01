import Hero from './Hero';
import PlaceStrip from './PlaceStrip';
import Offerings from './Offerings';
import LunchThisWeek from './LunchThisWeek';
import GalleryPreview from './GalleryPreview';
import Reviews from './Reviews';
import LocationStrip from './LocationStrip';

export default function HomePage() {
  return (
    <div className="font-sans bg-background">
      <Hero />
      <PlaceStrip />
      <Offerings />
      <LunchThisWeek />
      <GalleryPreview />
      <Reviews />
      <LocationStrip />
    </div>
  );
}
