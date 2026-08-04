import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Achievements from '@/components/sections/Achievements';
import WhyMLRIT from '@/components/sections/WhyMLRIT';
import Programs from '@/components/sections/Programs';
import Placements from '@/components/sections/Placements';
import Events from '@/components/sections/Events';
import Testimonials from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Achievements />
      <WhyMLRIT />
      <Programs />
      <Placements />
      <Testimonials />
      <Events />
    </>
  );
}
