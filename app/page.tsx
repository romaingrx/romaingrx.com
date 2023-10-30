"use client"
import { Transition } from "@/components/backgrounds/PixelBackground";
import { AnimatePresence } from "framer-motion";
import { TypeWriterOptions } from "@/components/typewritter/TypeWriterOptions";

function Home() {
  return (
    <AnimatePresence>
      <Transition>
        <div id="offset" className="h-12 md:h-16" />
        <span className="text-3xl md:text-5xl font-bold">
          Hi, I&apos;m Romain, a
          <TypeWriterOptions
            cursor={"|"}
            strings={[" Machine Learning Engineer", " Software Engineer"]}
          />
        </span>
      </Transition>
    </AnimatePresence>
  );
}


export default Home;