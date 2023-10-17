import AboutTimeline from "@/components/about/Timeline";
import { Transition } from "@/components/backgrounds/PixelBackground";

export default function About(): JSX.Element {
    return (<>
        <Transition>
            <div className='flex flex-row justify-center items-center pt-8'>
                <div className='flex flex-row justify-center items-center max-w-[1024px] lg:w-2/3 w-full'>
                    <AboutTimeline />
                </div>
            </div>
        </Transition>
    </>);
}