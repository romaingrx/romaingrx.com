import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';

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
  {
    name: 'Contact',
    href: '/contact',
    icon: <FontAwesomeIcon icon={['fas', 'envelope']} />,
  },
];

export default function Header(): JSX.Element {
  return (
    <>
      <header className="pointer-events-none relative z-50 flex flex-col">
        <div className="top-0 z-10">
          <div className="" id="container">
            <div className="relative flex gap-4">
              <div className="relative flex flex-1 justify-end md:justify-center font-wise">
                <MobileNavigation
                  pages={pages}
                  className="pointer-events-auto md:hidden"
                />
                <DesktopNavigation
                  pages={pages}
                  className="pointer-events-auto hidden md:block"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
