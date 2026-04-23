'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { clearDeviceToken } from '@/lib/device';

export default function SideNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    clearDeviceToken();
    logout();
  };

  return (
    <aside className="w-72 h-screen sticky top-0 border-r border-white/5 bg-black p-8 flex flex-col justify-between">
      <div className="space-y-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Clutch Trades</h1>
        </div>

        <nav className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Main Terminal</p>
            <NavLink href="/dashboard" active={pathname === '/dashboard'} label="Portfolio" />
            <NavLink href="/dashboard/competitions" active={pathname?.startsWith('/dashboard/competitions') ?? false} label="Competitions" />
            <NavLink href="/dashboard/wallet" active={pathname === '/dashboard/wallet'} label="Wallet" />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Account</p>
            <NavLink href="/dashboard/profile" active={pathname === '/dashboard/profile'} label="Profile" />
          </div>
        </nav>
      </div>

      <div className="space-y-3">
        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Signed in as</p>
          <p className="text-sm font-black text-white italic truncate">{user?.userName || '—'}</p>
          <p className="text-[10px] text-white/30 truncate mt-1">{user?.email || ''}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 hover:border-red-500/30 transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function NavLink({ href, active, label }: any) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 py-2 text-sm font-bold transition-all ${
        active ? 'text-white translate-x-1' : 'text-white/30 hover:text-white'
      }`}
    >
      <div className={`w-1 h-1 rounded-full transition-all ${active ? 'bg-orange-500 scale-[2]' : 'bg-transparent'}`} />
      {label}
    </Link>
  );
}
