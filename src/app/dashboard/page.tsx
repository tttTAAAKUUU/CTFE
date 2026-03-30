'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Users, TrendingUp, Zap, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api'; // ✅ Import your existing API utility

export default function DashboardHome() {
  const { user } = useAuth(); 
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activePositionsCount, setActivePositionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        setLoading(true);

        // ✅ Using Axios (api) handles the base URL (3001) and Token automatically
        // We use Promise.allSettled so if one fails (like an empty leaderboard), the others still load
        const results = await Promise.allSettled([
          api.get('/competitions'),
          api.get('/competitions/1/leaderboard'),
          api.get('/positions/me')
        ]);

        // Process Competitions
        if (results[0].status === 'fulfilled') {
          const compData = results[0].value.data || results[0].value;
          setCompetitions(Array.isArray(compData) ? compData : []);
        }

        // Process Leaderboard
        if (results[1].status === 'fulfilled') {
          const leaderData = results[1].value.data || results[1].value;
          setLeaderboard(Array.isArray(leaderData) ? leaderData : []);
        }

        // Process Positions
        if (results[2].status === 'fulfilled') {
          const posData = results[2].value.data || results[2].value;
          setActivePositionsCount(Array.isArray(posData) ? posData.length : 0);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="text-red-500" size={48} />
        <h2 className="text-xl font-bold italic uppercase">Connection Error</h2>
        <p className="text-white/40 text-center max-w-xs text-[10px] uppercase font-mono">
          Unable to synchronize with the trading terminal.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] italic"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="flex justify-between items-start pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Live Feed</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white">
            {user?.userName ? `${user.userName}'s Portfolio` : 'PORTFOLIO'}
          </h1>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-6 py-3 text-right">
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Active Stakes</p>
          <p className="text-2xl font-black tracking-tight text-orange-400">
            {loading ? '...' : activePositionsCount}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tokens" value={loading ? "..." : "45,200"} subValue="TT Balance" isPositive icon={<Zap size={18} className="text-orange-400" />} />
        <StatCard title="Global Rank" value="#1,204" subValue="Top 5%" icon={<Trophy size={18} className="text-blue-400" />} />
        <StatCard title="Win Ratio" value="68.2%" subValue="Profitable" icon={<TrendingUp size={18} className="text-green-400" />} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">Live Competitions</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white/[0.01] rounded-[2rem] border border-white/5">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            ) : competitions.length > 0 ? (
              competitions.map((comp: any) => (
                <Link key={comp.id} href={`/dashboard/competitions/${comp.id}/trade/1`}>
                    <CompetitionItem 
                        name={comp.name} 
                        prize={`${Number(comp.prizePool).toLocaleString()} TT`} 
                        players={`${Math.floor(Math.random() * 20)}/${comp.maxParticipants || 100}`} 
                        trend={comp.status?.toUpperCase() || 'ACTIVE'} 
                    />
                </Link>
              ))
            ) : (
              <div className="text-white/20 italic text-center py-16 border border-dashed border-white/10 rounded-[2rem]">
                <p className="text-sm">No active competitions found.</p>
                <p className="text-[10px] uppercase font-black tracking-widest mt-2">Check the admin panel to seed data</p>
              </div>
            )}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-white/40">Top Traders</h2>
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
                  <span className="text-white/10 font-black italic text-xl w-8">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="flex-1 px-4 font-bold text-white/80 truncate">{entry.userName}</span>
                  <div className="text-right">
                     <p className={`font-mono font-black ${entry.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.pnl >= 0 ? '+' : ''}{entry.pnl}%
                     </p>
                  </div>
                </div>
              ))
            ) : (
                <div className="py-10 text-center"><p className="text-white/20 text-[10px] uppercase font-black tracking-widest">Rankings Pending</p></div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, isPositive, icon }: any) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] p-8 border border-white/5">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{title}</p>
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">{icon}</div>
      </div>
      <p className="text-4xl font-black tracking-tighter mb-2 italic uppercase text-white">{value}</p>
      <p className={`text-[10px] font-black uppercase tracking-widest ${isPositive ? 'text-green-400' : 'text-white/20'}`}>{subValue}</p>
    </div>
  );
}

function CompetitionItem({ name, prize, players, trend }: any) {
  return (
    <div className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[1.8rem] hover:bg-white/[0.05] transition-all cursor-pointer">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-all">
          <Zap size={24} className="text-white/20 group-hover:text-orange-500 transition-colors" />
        </div>
        <div>
          <h3 className="font-black text-xl tracking-tight italic uppercase text-white/90 group-hover:text-white">{name}</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1.5"><Users size={12}/> {players}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-orange-400/80">{trend}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Prize Pool</p>
        <p className="text-2xl font-black text-white italic tracking-tighter group-hover:text-orange-500 transition-colors">{prize}</p>
      </div>
    </div>
  );
}