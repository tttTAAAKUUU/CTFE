'use client';

import { useState, useEffect, use } from 'react';
import { Trophy, Clock, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CompetitionOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [comp, setComp] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [compRes, leaderRes] = await Promise.allSettled([
          api.get(`/competitions/${id}`),
          api.get(`/competitions/${id}/leaderboard`),
        ]);

        if (compRes.status === 'fulfilled') {
          const data: any = compRes.value;
          setComp(data?.data ?? data);
        }

        if (leaderRes.status === 'fulfilled') {
          const data: any = leaderRes.value;
          const arr = data?.data ?? data;
          setLeaderboard(Array.isArray(arr) ? arr : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-orange-500" />
      </div>
    );
  }

  if (!comp) {
    return (
      <div className="p-20 text-center text-white/40">
        Competition not found.
      </div>
    );
  }

  // ✅ Check whether current user is joined. Gate the "Browse Assets" CTA.
  const isJoined = comp.participants?.some((p: any) => p?.id === user?.id);

  return (
    <div className="space-y-8 pb-10">
      {/* Contest Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500/20 to-transparent p-8 rounded-[2.5rem] border border-orange-500/20 relative overflow-hidden">
          <Clock className="absolute -right-4 -bottom-4 w-32 h-32 text-orange-500/10 -rotate-12" />
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">Ends At</p>
          <h2 className="text-4xl font-black italic">
            {new Date(comp?.endsAt).toLocaleDateString()}
          </h2>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Max Participants</p>
          <h2 className="text-4xl font-black italic">
            {comp?.maxParticipants} <span className="text-sm font-normal text-white/40">Spots</span>
          </h2>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Total Prize Pool</p>
          <h2 className="text-4xl font-black italic text-green-400">
            {Number(comp?.prizePool).toLocaleString()} <span className="text-sm">TT</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* REAL LEADERBOARD SECTION */}
        <div className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={20} className="text-orange-500" />
            <h3 className="text-xl font-black uppercase italic">Top Contenders</h3>
          </div>

          <div className="space-y-4">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry: any, i: number) => (
                <div
                  key={entry.id ?? entry.userName ?? i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 font-mono font-bold text-white/20 text-lg">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                    <div>
                      <p className="font-bold text-sm">{entry.userName ?? 'Anonymous'}</p>
                      {typeof entry.pnl !== 'undefined' && (
                        <p className={`text-[10px] font-mono ${Number(entry.pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {Number(entry.pnl) >= 0 ? '+' : ''}
                          {entry.pnl}%
                        </p>
                      )}
                    </div>
                  </div>
                  {typeof entry.stake !== 'undefined' && (
                    <div className="text-right">
                      <p className="text-xs font-mono">{entry.stake} TT Stake</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">No contenders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/20 mb-6">Your Open Trades</h3>
            <div className="space-y-4 text-center py-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">No active positions</p>
            </div>
          </div>

          {/* ✅ Gate: if not joined, send them back to the list to join properly */}
          {isJoined ? (
            <Link
              href={`/dashboard/competitions/${comp?.id}/trade/${comp?.allowedAssets?.[0]?.id || ''}`}
              className="block w-full py-6 rounded-[2rem] bg-white text-black text-center font-black italic uppercase tracking-tighter hover:scale-[1.02] transition-transform"
            >
              Browse All Game Assets
            </Link>
          ) : (
            <button
              onClick={() => router.push('/dashboard/competitions')}
              className="w-full py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white/60 text-center font-black italic uppercase tracking-tighter hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              Join to unlock trading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
