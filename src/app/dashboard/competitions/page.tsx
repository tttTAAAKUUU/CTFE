// src/app/dashboard/competitions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Trophy, Users, Loader2, DollarSign, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CompetitionsListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res: any = await api.get('/competitions');
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      setCompetitions(rawData);
    } catch (err) {
      console.error('Failed to fetch competitions:', err);
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (comp: any) => {
    if (!user) {
      alert('Still loading your session. Try again in a moment.');
      return;
    }

    // Compare as numbers — participant.id and user.id should both be numbers
    // but coerce just in case one side is a string
    const isJoined = comp.participants?.some((p: any) => Number(p.id) === Number(user.id));

    if (isJoined) {
      const assetId = comp.allowedAssets?.[0]?.id || 1;
      router.push(`/dashboard/competitions/${comp.id}/trade/${assetId}`);
      return;
    }

    if (!confirm(`Join ${comp.name} for $10?`)) return;

    setJoiningId(comp.id);

    try {
      const res: any = await api.post(`/competitions/${comp.id}/join`);

      // Refetch from server — authoritative source
      await fetchCompetitions();

      alert('Success! Entry fee deducted.');

      const firstAssetId = res.firstAssetId || res?.data?.firstAssetId || comp.allowedAssets?.[0]?.id || 1;
      router.push(`/dashboard/competitions/${comp.id}/trade/${firstAssetId}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to join. Check balance.';
      alert(msg);
    } finally {
      setJoiningId(null);
    }
  };

  // Wait for BOTH auth and competitions to be ready before rendering the list,
  // otherwise the "isJoined" check flickers and shows wrong button
  if (loading || authLoading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-orange-500 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Loading Arena...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 p-6">
      <header className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Live Tournaments</p>
        <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter">Competitions</h1>
      </header>

      {competitions.length === 0 ? (
        <div className="text-white/20 italic text-center py-16 border border-dashed border-white/10 rounded-[2rem]">
          <p className="text-sm">No active competitions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => {
            // Safe isJoined check — user is guaranteed non-null here thanks to authLoading gate
            const isJoined = comp.participants?.some((p: any) => Number(p?.id) === Number(user?.id));
            const isJoining = joiningId === comp.id;

            return (
              <div key={comp.id} className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all relative overflow-hidden">
                {isJoined && (
                  <div className="absolute top-0 right-0 bg-green-500 text-black px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl">
                    Joined
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <Trophy className={isJoined ? 'text-green-500' : 'text-orange-500'} />
                  <p className="text-2xl font-black italic text-white">
                    {Number(comp.prizePool).toLocaleString()} <span className="text-xs uppercase text-white/40">TT</span>
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{comp.name}</h3>
                <p className="text-xs text-white/40 mb-8 line-clamp-2">{comp.description}</p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase text-white/20">
                    <Users size={12} className="inline mr-1 text-white/40" />
                    {comp.participants?.length || 0} / {comp.maxParticipants} <span className="hidden sm:inline">Contenders</span>
                  </span>

                  <button
                    onClick={() => handleJoin(comp)}
                    disabled={isJoining}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic transition-all active:scale-95 ${
                      isJoined
                        ? 'bg-green-500 text-black hover:bg-green-400'
                        : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    {isJoining ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : isJoined ? (
                      <>Enter Arena <Zap size={12} fill="currentColor" /></>
                    ) : (
                      <>Join Now <DollarSign size={12} /> 10</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
