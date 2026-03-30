'use client';

import React, { useState, useEffect } from 'react';
import { Power, ShieldOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function MarketManager() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/markets')
      .then(data => {
        const result = (data as any).data || data;
        setMarkets(Array.isArray(result) ? result : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleMarket = async (id: number, currentStatus: boolean) => {
    try {
      // Corrected to hit the admin endpoint on port 3001
      await api.patch(`/admin/assets/${id}/toggle`, { active: !currentStatus });
      setMarkets(markets.map(m => m.id === id ? { ...m, active: !currentStatus } : m));
    } catch (err) {
      console.error("Failed to toggle market", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="mt-8 space-y-4">
      {markets.map(m => (
        <div key={m.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${m.active ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'}`} />
            <div>
              <p className="font-bold text-sm text-white/90">{m.name}</p>
              <p className="text-[10px] text-white/20 uppercase font-mono tracking-tighter">{m.marketHashName}</p>
            </div>
          </div>
          
          <button 
            onClick={() => toggleMarket(m.id, m.active)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
              m.active 
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
              : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
            }`}
          >
            {m.active ? <ShieldOff size={14}/> : <Power size={14}/>}
            {m.active ? 'Emergency Disable' : 'Enable Trading'}
          </button>
        </div>
      ))}
    </div>
  );
}