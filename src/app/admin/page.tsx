'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Activity, ShieldAlert, 
  BarChart3, Settings, Search, CheckCircle2,
  Trophy, Users, Flame, TrendingUp, AlertCircle
} from 'lucide-react';
import CompetitionCreator from '@/components/admin/CompetitionCreator';
import MarketManager from '@/components/admin/MarketManager';
import CompetitionList from '@/components/admin/CompetitionList';
import { api } from '@/lib/api'; 

interface AdminStats {
  activeCompetitions: number;
  totalPrizeLocked: number;
}

interface VolatileAsset {
  market_id: number;
  market_name: string;
  market_currentPrice: string;
  volatility_score: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitions' | 'markets'>('overview');
  const [volatileAssets, setVolatileAssets] = useState<VolatileAsset[]>([]);
  const [loadingVolatile, setLoadingVolatile] = useState(true);
  const [stats, setStats] = useState<AdminStats>({ 
    activeCompetitions: 0, 
    totalPrizeLocked: 0 
  });

  useEffect(() => {
    // Fetch General Stats
    api.get<AdminStats>('/admin/stats')
      .then((res: any) => {
        const finalData = res.data || res;
        setStats({
          activeCompetitions: finalData.activeCompetitions ?? 0,
          totalPrizeLocked: finalData.totalPrizeLocked ?? 0
        });
      })
      .catch(err => console.error("Stats fetch error:", err));

    // Fetch Volatile Assets
    setLoadingVolatile(true);
    api.get('/markets/discovery/volatile')
      .then((res: any) => {
        // Defensive check: handle direct array or .data wrapper
        const data = Array.isArray(res) ? res : (res.data || []);
        setVolatileAssets(data);
      })
      .catch(err => console.error("Volatility fetch error:", err))
      .finally(() => setLoadingVolatile(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Admin Console</h1>
            <p className="text-white/40 text-[10px] font-mono tracking-[0.3em] uppercase mt-1">
              Real-time Exchange Management • v2.0.4
            </p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'competitions'} onClick={() => setActiveTab('competitions')} icon={<PlusCircle size={16}/>} label="Contests" />
            <TabButton active={activeTab === 'markets'} onClick={() => setActiveTab('markets')} icon={<ShieldAlert size={16}/>} label="Markets" />
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Active Contests" value={stats.activeCompetitions.toString()} icon={<Activity className="text-orange-500" />} />
              <StatCard label="Total Prize Locked" value={`$${stats.totalPrizeLocked.toLocaleString()}`} icon={<Trophy className="text-yellow-500" />} />
              <StatCard label="System Status" value="Online" icon={<Settings className="text-blue-500" />} />
            </div>

            {/* Volatile Discovery Grid */}
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-3xl relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] pointer-events-none rounded-full" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Flame className="text-orange-500" fill="currentColor" size={20} />
                  <h3 className="text-xl font-black italic uppercase">Hot Markets (Volatility Rank)</h3>
                </div>
                {volatileAssets.length > 0 && (
                   <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Showing top {volatileAssets.length}</span>
                )}
              </div>
              
              {loadingVolatile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
                </div>
              ) : volatileAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {volatileAssets.slice(0, 4).map((asset) => (
                    <div key={asset.market_id} className="bg-black/40 border border-white/10 p-5 rounded-2xl hover:border-orange-500 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-orange-500 font-mono">#{asset.market_id}</span>
                        <div className="flex items-center gap-1 text-[#22c55e] text-[10px] font-black uppercase italic">
                          <TrendingUp size={12} /> {Number(asset.volatility_score).toFixed(2)}
                        </div>
                      </div>
                      <h4 className="text-lg font-black italic uppercase mt-1 truncate">{asset.market_name}</h4>
                      <p className="text-sm font-mono text-white/40">${Number(asset.market_currentPrice).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded-3xl border border-dashed border-white/10">
                   <AlertCircle className="text-white/10 mb-3" size={32} />
                   <p className="text-[10px] font-black uppercase text-white/20 tracking-widest text-center px-6">
                     No Volatility Data Detected. <br/> Run the Mock Data script or wait for market movements.
                   </p>
                </div>
              )}
            </div>

            {/* PERFORMANCE CHART MOCKUP */}
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm font-black uppercase italic text-white/60">Trade Volume Pulse</h3>
              </div>
              <div className="h-48 flex items-end gap-2 px-2">
                {[40, 70, 45, 90, 65, 80, 95, 100, 85, 60, 75, 50, 65, 90, 110, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/5 rounded-t-lg group relative cursor-crosshair">
                     <div 
                        className="bg-gradient-to-t from-orange-600 to-orange-400 w-full rounded-t-lg absolute bottom-0 transition-all duration-700 opacity-60 group-hover:opacity-100" 
                        style={{ height: `${(h / 110) * 100}%` }} 
                      />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS (Same as before) */}
        {activeTab === 'competitions' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <CompetitionCreator />
            <div className="pt-12 border-t border-white/5">
              <CompetitionList />
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="animate-in fade-in duration-500">
            <MarketManager />
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components TabButton and StatCard remain the same...

// Sub-components TabButton and StatCard remain the same...

// --- SUB-COMPONENTS ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-tighter ${
        active 
        ? 'bg-white text-black shadow-lg' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">
          {label}
        </p>
        <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-mono font-black italic tracking-tighter">
        {value}
      </p>
    </div>
  );
}