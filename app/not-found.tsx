import GameOfLifeBackground from '@/components/backgrounds/GameOfLife';

export default function Page404() {
  return (
    <>
      <div className="fixed inset-0 bg-white">
        <GameOfLifeBackground fill={'#ff00ff'} />
      </div>
      <div className="z-10">
        <div className="flex flex-col w-full">
          <h1 className="text-4xl font-bold z-10 mx-auto">404</h1>
          <p className="text-2xl font-medium z-10 mx-auto">Page not found</p>
        </div>
      </div>
    </>
  );
}
