'use client';

import { useState, useEffect } from 'react';
import { Trophy, Clock, Users, Zap, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CompetitionOverview({ params }: { params: { id: string } }) {
  const [comp, setComp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/competitions/${params.id}`)
      .then(res => setComp(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" /></div>;

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
        {/* LEADERBOARD SECTION */}
        <div className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
           <div className="flex items-center gap-3 mb-8">
             <Trophy size={20} className="text-orange-500" />
             <h3 className="text-xl font-black uppercase italic">Top Contenders</h3>
           </div>
           
           <div className="space-y-4">
             {/* Note: In a real app, fetch /competitions/:id/leaderboard here */}
             {[1, 2, 3, 4, 5].map((rank) => (
               <div key={rank} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <span className="w-8 font-mono font-bold text-white/20 text-lg">0{rank}</span>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                    <div>
                      <p className="font-bold text-sm">CryptoWhale_{rank}</p>
                      <p className="text-[10px] text-green-500 font-mono">+$2,410.50 P&L</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono">1.2k TT Stake</p>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* YOUR OPEN POSITIONS & ASSET BROWSER */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/20 mb-6">Your Open Trades</h3>
              <div className="space-y-4 text-center py-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">No active positions</p>
              </div>
           </div>
           
           {/* ✅ Dynamic Asset Browser Link: Takes you to the first allowed asset of this competition */}
           <Link 
              href={`/dashboard/competitions/${comp?.id}/trade/${comp?.allowedAssets?.[0]?.id || 'browse'}`} 
              className="block w-full py-6 rounded-[2rem] bg-white text-black text-center font-black italic uppercase tracking-tighter hover:scale-[1.02] transition-transform"
            >
              Browse All Game Assets
           </Link>
        </div>
      </div>
    </div>
  );
}