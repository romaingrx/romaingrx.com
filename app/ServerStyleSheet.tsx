'use client';

import React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { getCssText, globalStyles } from '@/design';

export function ServerStylesheet({ children }: { children?: JSX.Element }) {
    useServerInsertedHTML(() => {
        if (typeof window === 'undefined') {
            return (
                <style
                    id="stitches"
                    dangerouslySetInnerHTML={{ __html: getCssText() }}
                />
            );
        }
    });

    globalStyles();
    return children ? <>{children}</> : null;
}