import AboutTimeline from '@/components/about/Timeline';
import { Transition } from '@/components/backgrounds/PixelBackground';
import Layout from '@/components/core/layout';

export default function About(): JSX.Element {
  return (
    <>
      <Transition>
        <Layout>
          <AboutTimeline />
        </Layout>
      </Transition>
    </>
  );
}
