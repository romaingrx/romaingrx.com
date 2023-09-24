import AboutTimeline from "@/components/about/Timeline";

export default function About(): JSX.Element {
    return (<>
        <div className='flex flex-row justify-center items-center pt-8'>
            <div className='flex flex-row justify-center items-center max-w-[1024px] lg:w-2/3 w-full'>
                <AboutTimeline />
            </div>
        </div>
    </>);
}