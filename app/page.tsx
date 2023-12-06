import { Transition } from '@/components/backgrounds/PixelBackground';
import Layout from '@/components/core/layout';
import { RecentBlogPosts } from '@/components/home/RecentBlogPosts';
import HeroSection from '@/components/home/Hero';

function Home() {
  return (
    <Transition>
      <HeroSection />
      <RecentBlogPosts />
    </Transition>
  );
}

export default Home;
