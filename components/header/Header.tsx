import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DesktopNavigation from './DesktopNavigation';

export type PageProps = {
  name: string;
  href: string;
  icon: JSX.Element;
};

export const pages = [
  {
    name: 'Home',
    href: '/',
    icon: <FontAwesomeIcon icon={['fas', 'home']} />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <FontAwesomeIcon icon={['fas', 'user']} />,
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: <FontAwesomeIcon icon={['fas', 'blog']} />,
  },
];

export default function Header(): JSX.Element {
  return (
    <>
      <header className="pointer-events-none relative z-50 flex flex-col h-12">
        <div className="top-0 z-10">
          <div className="" id="container">
            <div className="flex gap-4">
                <div className="relative flex flex-1 justify-end md:justify-center font-wise">
                  <DesktopNavigation
                    pages={pages}
                    className="pointer-events-auto block"
                  />
                </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
