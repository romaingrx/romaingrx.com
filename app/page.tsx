import { Transition } from '@/components/backgrounds/PixelBackground';
import { RecentBlogPosts } from '@/components/home/RecentBlogPosts';
import HeroSection from '@/components/home/Hero';
import { ContactMe } from '@/components/home/Contact';

function Home() {
  return (
    <Transition>
      <HeroSection />
      <RecentBlogPosts />
      <ContactMe />
    </Transition>
  );
}

export default Home;
