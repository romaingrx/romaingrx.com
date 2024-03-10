import GradientBackground from '@/components/core/GradientBackground';

export default function Page() {
  return (
    <GradientBackground elements={[]}>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex h-1/2 w-1/2 flex-col items-center justify-center gap-4 rounded-lg">
          <h1 className="bg-opacity-10 bg-gradient-to-r from-orange-500 to-default-300 bg-clip-text text-center font-polysans text-6xl font-bold text-transparent">
            Gradient Background
          </h1>
          <p className="text-center">
            This is a gradient background component.
          </p>
        </div>
      </div>
    </GradientBackground>
  );
}
