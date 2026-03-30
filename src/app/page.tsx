import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white">
      <main className="flex w-full max-w-3xl flex-col items-center gap-12 py-32 px-16 sm:items-start">
        <Image
          className="invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight">
            ClutchTrades <span className="text-white/40">Terminal</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Frontend is ready for development. Start by navigating to your auth or dashboard routes.
          </p>
        </div>
        
        <div className="flex gap-4">
          <a href="/auth/login" className="rounded-full bg-white px-8 py-3 text-black font-semibold hover:bg-zinc-200 transition">
            Log In
          </a>
          <a href="/auth/signup" className="rounded-full border border-white/20 px-8 py-3 hover:bg-white/5 transition">
            Register
          </a>
        </div>
      </main>
    </div>
  );
}