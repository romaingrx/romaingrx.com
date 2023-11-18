import GameOfLifeBackground from '@/components/backgrounds/GameOfLife';

export default function Page404() {
  return (
    <>
      <div className="pointer-events-auto fixed inset-0 z-0 text-romaingrx-emphasis">
        <GameOfLifeBackground fill={'currentColor'} fps={5} />
      </div>
      <div className="flex h-full flex-grow flex-col items-center justify-center">
        <div className="flex flex-grow flex-col items-center justify-center font-wise">
          <h1 className="z-10 text-8xl font-bold">404</h1>
          <p className="z-10 text-2xl font-medium">Page not found</p>
        </div>
      </div>
    </>
  );
}
