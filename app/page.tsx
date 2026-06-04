import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Achievements from '@/components/sections/Achievements';
import WhyMLRIT from '@/components/sections/WhyMLRIT';
import SuccessStories from '@/components/sections/SuccessStories';
import Programs from '@/components/sections/Programs';
import Placements from '@/components/sections/Placements';
import Events from '@/components/sections/Events';
import Testimonials from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      {/* New order: Accreditations → Why MLRIT → Success Stories THEN Programs */}
      <Achievements />
      <WhyMLRIT />
      <SuccessStories />
      <Programs />
      <Placements />
      <Testimonials />
      <Events />
    </>
  );
}
