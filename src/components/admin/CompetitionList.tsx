'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, Trash2, ExternalLink, Clock } from 'lucide-react';
import { api } from '@/lib/api'; // ✅ Using your shared API utility

export default function CompetitionList() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data so we can call it on mount and after creation
  const loadCompetitions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/competitions');
      // Axios usually puts the array in .data
      const data = (res as any).data || res;
      setCompetitions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load competitions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-white/20 bg-white/5 border-white/10';
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-white/20 animate-pulse uppercase tracking-widest text-[10px]">Synchronizing Contest Data...</div>;

  return (
    <div className="mt-8 space-y-4">
      {competitions.length === 0 ? (
        <div className="p-20 text-center border border-dashed border-white/5 rounded-[2rem]">
          <p className="text-[10px] uppercase font-black text-white/10 tracking-[0.3em]">No contests found in database</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 px-6 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <div className="col-span-4">Competition Details</div>
            <div className="col-span-2 text-center">Prize Pool</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Timeline</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {[...competitions].reverse().map((comp) => (
            <div key={comp.id} className="grid grid-cols-12 items-center bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  {comp.name.toUpperCase().includes('AWP') ? '🎯' : '🔪'}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white/90">{comp.name}</h4>
                  <p className="text-[10px] text-white/30 uppercase truncate max-w-[200px] font-mono">{comp.description || 'No description provided'}</p>
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="font-mono font-black text-orange-500">${Number(comp.prizePool).toLocaleString()}</span>
              </div>

              <div className="col-span-2 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(comp.status)}`}>
                  {comp.status}
                </span>
              </div>

              <div className="col-span-2 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[9px] text-white/40 font-mono">
                  <Clock size={10} /> {new Date(comp.endsAt).toLocaleDateString()}
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                  <ExternalLink size={16} />
                </button>
                <button className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg text-red-500/40 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}