import { useRef } from "react";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

export const pages = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog'},
    { name: 'Projects', href: '/projects'},
    { name: 'Contact', href: '/contact' },
];

export default function Header() : JSX.Element {
    return (<>
        <header className="pointer-events-none relative z-50 flex flex-col">
            <div className="top-0 z-10">
                <div className="" id="container">
                    <div className="relative flex gap-4">
                        <div className="relative flex flex-1 justify-end md:justify-center">
                            <MobileNavigation pages={pages} className="pointer-events-auto md:hidden"/>
                            <DesktopNavigation pages={pages} className="pointer-events-auto hidden md:block"/>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </>)
}