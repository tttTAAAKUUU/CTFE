'use client';

import React, { useState, useEffect } from 'react';
import { Search, Check, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api'; 

export default function MarketSelector({ selectedIds, onChange }: any) {
  const [allMarkets, setAllMarkets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/markets');
        // Handle Axios unwrap or direct array
        const result = (data as any).data || data;
        setAllMarkets(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Failed to load markets:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMarkets();
  }, []);

  const filteredMarkets = allMarkets.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
        <input 
          type="text"
          placeholder="Filter assets..."
          className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 text-xs text-white outline-none focus:border-orange-500/50"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 h-64">
        <div className="bg-black/60 rounded-2xl border border-white/5 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full gap-2">
              <Loader2 className="animate-spin text-orange-500" size={16} />
              <span className="text-[10px] uppercase font-black text-white/20">Loading DB...</span>
            </div>
          ) : filteredMarkets.length > 0 ? (
            filteredMarkets.map(market => (
              <button
                key={market.id}
                onClick={() => {
                  const newIds = selectedIds.includes(market.id)
                    ? selectedIds.filter((id: number) => id !== market.id)
                    : [...selectedIds, market.id];
                  onChange(newIds);
                }}
                className={`w-full flex items-center justify-between p-3 mb-1 rounded-xl text-left transition-all ${
                  selectedIds.includes(market.id) ? 'bg-orange-500/20 border border-orange-500/40' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <p className="text-[10px] font-bold text-white/80">{market.name}</p>
                {selectedIds.includes(market.id) && <Check size={12} className="text-orange-500" />}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/10">
              <AlertCircle size={20} className="mb-2" />
              <p className="text-[10px] uppercase font-black">Database Empty</p>
              <p className="text-[8px] text-center px-4 mt-1 italic">Restart backend to seed assets from PriceEmpire</p>
            </div>
          )}
        </div>

        {/* Selected List */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-4 overflow-y-auto">
          <p className="text-[8px] font-black uppercase text-white/20 mb-4 tracking-widest">Selected Assets</p>
          <div className="flex flex-wrap gap-2">
            {selectedIds.map((id: number) => {
              const m = allMarkets.find(x => x.id === id);
              return (
                <span key={id} className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md text-[9px] text-orange-500">
                  {m?.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}