import GameOfLifeBackground from "@/components/GameOfLife";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="absolute top-0 left-0 inset-0 opacity-50 bg-white">
        <GameOfLifeBackground fill={"#b19cd9"} />
      </div>
      <div className="relative flex flex-col justify-center z-10 min-h-screen bg-transparent pointer-events-none">
        <div className="mx-auto flex flex-col p-4 rounded-md">
          <h1 className="lg:text-6xl md:text-4xl text-3xl font-bold text-zinc-700 mx-auto">
            🚧 Under construction 🚧
          </h1>
          <p className="text-zinc-700 lg:text-2xl md:text-xl text-md px-12 text-justify">
            This website is currently under construction. Please check back
            later.
          </p>
        </div>
      </div>
    </main>
  );
}
