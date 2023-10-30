"use client"

import { useEffect, useState } from "react";
import { RandomPixelBackground } from "@/components/backgrounds/PixelBackground";

export default function Test() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, 1000);
    }, []);

    return (<>
        <div className="h-screen w-screen fixed top-0 left-0">
            <RandomPixelBackground />
        </div>
    </>)
}