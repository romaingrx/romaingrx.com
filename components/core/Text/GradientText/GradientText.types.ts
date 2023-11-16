import { CSS } from "@/design";

type variant = 'steady' | 'smoky' | 'radial-smoky';

interface GradientTextProps {
    children: React.ReactNode;
    css?: CSS;
    variant?: variant;
}

export type { GradientTextProps };