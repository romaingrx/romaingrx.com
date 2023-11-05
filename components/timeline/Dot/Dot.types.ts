type DotVariant = 'normal' | 'pulsating' | 'inView';

interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: DotVariant;
}

export type { DotProps, DotVariant };