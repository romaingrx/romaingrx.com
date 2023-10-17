"use client"

import { TargetAndTransition, motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

type PixelBackgroundProps = {
    visible: boolean;
    columns?: number;
    className?: string;
    backgroundColor?: string;
}

type CorePixelBackgroundProps = PixelBackgroundProps & {
    variants: {
        hidden: ({ row, column, rows, columns }: { row: number, column: number, rows: number, columns: number }) => TargetAndTransition;
        visible: ({ row, column, rows, columns }: { row: number, column: number, rows: number, columns: number }) => TargetAndTransition;
    };
}

function CorePixelBackground({
    visible,
    className,
    columns = 20,
    variants = {
        hidden: () => ({ opacity: 0 }),
        visible: () => ({ opacity: 1 }),
    },
    backgroundColor = "var(--color-bob)",
}: CorePixelBackgroundProps): JSX.Element {

    const { innerWidth = 1600, innerHeight = 1600 } = typeof window !== 'undefined' ? window : {};
    const pixelSize = innerWidth / columns;
    const rows = Math.ceil(innerHeight / pixelSize);

    return (<>
        <div className={clsx(className, "flex h-full")} onClick={() => { }}>
            {Array.from(Array(columns).keys()).map((_, column) => {
                return (<div
                    key={`${column}`}
                    className="h-full"
                    style={{
                        width: `${100 / columns}vw`
                    }}
                >
                    {Array.from(Array(rows).keys()).map((_, row) => {
                        return (<motion.div
                            key={`${row}-${column}`}
                            className="h-full"
                            variants={variants}
                            initial={'hidden'}
                            animate={visible ? 'visible' : 'hidden'}
                            custom={{ row, column, rows, columns }}
                            style={{
                                height: `${pixelSize}px`,
                                width: `${100 / columns}vw`,
                                backgroundColor: backgroundColor
                            }}
                        />)
                    })}
                </div>)
            })}
        </div>
    </>)
}

type RandomPixelBackgroundProps = PixelBackgroundProps & {
    delay?: number;
    duration?: number;
}

const RandomPixelBackground = ({ visible, className, delay = 0.5, duration = 0.1 }: RandomPixelBackgroundProps): JSX.Element => {
    return (<CorePixelBackground
        visible={visible}
        className={className}
        columns={Math.floor(Math.random() * 10) + 1}
        variants={{
            hidden: () => ({
                opacity: 0,
                transition: {
                    duration: duration,
                    delay: delay * Math.random(),
                },
            }),
            visible: () => ({
                opacity: 1,
            }),
        }}
    />)
}

export default CorePixelBackground;
export type { CorePixelBackgroundProps, PixelBackgroundProps, RandomPixelBackgroundProps };
export { RandomPixelBackground };