import GameOfLifeBackground from '@/components/backgrounds/GameOfLife';

export default function Page404() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <GameOfLifeBackground fill={'rgba(200, 200, 200, 0.5)'} fps={5}/>
      </div>
      <div className="h-full flex flex-col flex-grow justify-center items-center">
        <div className='justify-center items-center flex flex-col font-wise flex-grow'>
          <h1 className="text-8xl font-bold z-10">404</h1>
          <p className="text-2xl font-medium z-10">Page not found</p>
        </div>
      </div>
    </>
  );
}
