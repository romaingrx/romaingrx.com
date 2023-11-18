type LiquidGradientProps = {
    rotation?: number;
    color1?: string;
    color2?: string;
    seed?: number;
    baseFrequency?: string;
    numOctaves?: number;
    stdDeviation?: string;
    mode?: string;
    x?: string;
    y?: string;
    width?: string;
    height?: string;
};

export default function LiquidGradient({
    rotation = 150,
    color1 = 'hsl(315, 100%, 72%)',
    color2 = 'hsl(227, 100%, 50%)',
    seed = 2,
    baseFrequency = '0.005 0.003',
    numOctaves = 2,
    stdDeviation = '20 0',
    mode = 'color-dodge',
    x = '0%',
    y = '0%',
    width = '100%',
    height = '100%',
}: LiquidGradientProps): React.ReactElement {
    return (<>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 700 700" width={width} height={height} preserveAspectRatio="none">
            <defs>
                <linearGradient gradientTransform={`rotate(${rotation}, 0.5, 0.5)`} x1="50%" y1="0%" x2="50%" y2="100%" id="ffflux-gradient"><stop stopColor={color1} stopOpacity="1" offset="0%"></stop><stop stopColor={color2} stopOpacity="1" offset="100%"></stop></linearGradient>
                <filter id="ffflux-filter" x={x} y={y} width={width} height={height} filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={numOctaves} seed={seed} stitchTiles="stitch" x={x} y={y} width={width} height={height} result="turbulence"></feTurbulence>
                    <feGaussianBlur stdDeviation={stdDeviation} x={x} y={y} width={width} height={height} in="turbulence" edgeMode="duplicate" result="blur"></feGaussianBlur>
                    <feBlend mode={mode} x={x} y={y} width={width} height={height} in="SourceGraphic" in2="blur" result="blend"></feBlend>
                </filter>
            </defs>
            <rect width={width} height={height} fill="url(#ffflux-gradient)" filter="url(#ffflux-filter)"></rect>
        </svg>
    </>);
}
