'use client';

import React, { useState, useEffect } from 'react';
import MarketSelector from './MarketSelector'; 
import { api } from '@/lib/api'; 
import { Flame, Sparkles, Zap } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  onChangeValue: (value: string) => void;
  isTextArea?: boolean;
}

function Input({ label, onChangeValue, isTextArea, ...props }: InputProps) {
  const className = "w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-all font-medium text-sm text-white placeholder:text-white/10";
  
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest">{label}</label>
      {isTextArea ? (
        <textarea 
          {...(props as any)}
          onChange={(e) => onChangeValue(e.target.value)}
          className={`${className} min-h-[100px] resize-none`}
        />
      ) : (
        <input 
          {...(props as any)}
          onChange={(e) => onChangeValue(e.target.value)}
          className={className} 
        />
      )}
    </div>
  );
}

export default function CompetitionCreator() {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    pool: 1000, 
    winners: 5, 
    startsAt: '', 
    endsAt: '',
    marketIds: [] as number[] 
  });
  
  const [trending, setTrending] = useState<any[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Trending Assets (PriceEmpire Discovery)
  useEffect(() => {
    api.get('/markets/discovery/trending')
      .then((res: any) => {
        const data = res.data || res;
        setTrending(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Trending fetch error:", err));
  }, []);

  // Payout Preview Logic
  useEffect(() => {
    if (formData.pool > 0 && formData.winners > 0) {
      api.get<any[]>(`/admin/payouts/preview?pool=${formData.pool}&winners=${formData.winners}`)
        .then(data => {
          const result = (data as any).data || data;
          setPreview(Array.isArray(result) ? result : []);
        })
        .catch(() => setPreview([]));
    }
  }, [formData.pool, formData.winners]);

  const toggleTrendingAsset = (id: number) => {
    setFormData(prev => ({
      ...prev,
      marketIds: prev.marketIds.includes(id) 
        ? prev.marketIds.filter(mId => mId !== id)
        : [...prev.marketIds, id]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.startsAt || !formData.endsAt) {
      alert("Please fill in all details.");
      return;
    }

    if (formData.marketIds.length === 0) {
      alert("Select at least one asset.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/competitions', {
        name: formData.title,
        description: formData.description,
        prizePool: formData.pool,
        maxParticipants: 100, 
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        marketIds: formData.marketIds 
      });

      alert("🚀 Competition Live!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create competition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="col-span-12 lg:col-span-7 space-y-8 bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md">
        
        {/* --- TRENDING DISCOVERY SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-500">
              <Flame size={16} fill="currentColor" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Trending Discovery</h3>
            </div>
            <span className="text-[9px] text-white/20 font-mono italic">Powered by PriceEmpire</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
            {trending.length > 0 ? trending.map((asset) => (
              <button
                key={asset.id}
                onClick={() => toggleTrendingAsset(asset.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-2 ${
                  formData.marketIds.includes(asset.id)
                  ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {formData.marketIds.includes(asset.id) && <Zap size={10} fill="currentColor" />}
                {asset.name}
              </button>
            )) : (
              <div className="h-10 flex items-center text-white/10 text-[10px] uppercase font-black italic">
                Loading live trends...
              </div>
            )}
          </div>
        </div>

        <hr className="border-white/5" />

        <div className="space-y-6">
          <Input 
            label="Competition Title" 
            placeholder="e.g. Operation Wildfire Sprint" 
            value={formData.title}
            onChangeValue={(v) => setFormData({...formData, title: v})} 
          />

          <Input 
            label="Contest Description" 
            placeholder="Describe the rules or the vibe of this contest..." 
            value={formData.description}
            isTextArea={true}
            onChangeValue={(v) => setFormData({...formData, description: v})} 
          />

          <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Prize Pool ($)" 
               type="number" 
               value={formData.pool} 
               onChangeValue={(v) => setFormData({...formData, pool: Number(v)})} 
             />
             <Input 
               label="Max Winners" 
               type="number" 
               value={formData.winners} 
               onChangeValue={(v) => setFormData({...formData, winners: Number(v)})} 
             />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Start Date" 
               type="datetime-local" 
               value={formData.startsAt}
               onChangeValue={(v) => setFormData({...formData, startsAt: v})} 
             />
             <Input 
               label="End Date" 
               type="datetime-local" 
               value={formData.endsAt}
               onChangeValue={(v) => setFormData({...formData, endsAt: v})} 
             />
          </div>
        </div>

        <MarketSelector 
           selectedIds={formData.marketIds}
           onChange={(ids: number[]) => setFormData({ ...formData, marketIds: ids })}
          />

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black uppercase italic mt-4 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 ${
            loading 
            ? 'bg-white/10 text-white/20 cursor-not-allowed' 
            : 'bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/20'
          }`}
        >
          {loading ? 'Processing...' : (
            <>
              <Sparkles size={18} />
              Launch Live Competition
            </>
          )}
        </button>
      </div>

      {/* --- PREVIEW PANEL --- */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 h-fit sticky top-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-white/20" size={14} />
            <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Payout Distribution</h3>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {preview.length > 0 ? (
              preview.map((p, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5 group hover:border-orange-500/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-white/20 uppercase">Position</span>
                    <span className="text-xs font-black italic text-white/60">Rank #{p.rank || index + 1}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-500 font-mono font-black block">${Number(p.amount).toFixed(2)}</span>
                    <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/40">{p.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center opacity-20">
                <Sparkles size={40} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-tighter text-center">Set pool & winners <br/> to view math</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}