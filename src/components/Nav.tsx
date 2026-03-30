import Link from 'next/link';

export default function Nav() {
  return (
    <aside className="w-56 border-r border-white/10 p-6">
      <h1 className="text-xl font-semibold mb-8">Clutch</h1>

      <nav className="space-y-4 text-sm">
        <Link href="/dashboard" className="block opacity-80 hover:opacity-100">
          Dashboard
        </Link>
        <Link href="/wallet" className="block opacity-80 hover:opacity-100">
          Wallet
        </Link>
        <Link href="/contests" className="block opacity-80 hover:opacity-100">
          Contests
        </Link>
      </nav>
    </aside>
  );
}
