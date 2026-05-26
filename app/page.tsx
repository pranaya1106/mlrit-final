import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import SuccessStories from '@/components/sections/SuccessStories';
import WhyMLRIT from '@/components/sections/WhyMLRIT';
import Achievements from '@/components/sections/Achievements';
import Placements from '@/components/sections/Placements';
import Events from '@/components/sections/Events';
import Testimonials from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <SuccessStories />
      <WhyMLRIT />
      <Achievements />
      <Placements />
      <Events />
      <Testimonials />
    </>
  );
}
