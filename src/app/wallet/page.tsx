'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Wallet, ArrowUpRight, ArrowDownLeft, Shield, Zap, History } from 'lucide-react';

type WalletData = {
  balance: number;
  lockedBalance: number;
  currency: string;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);

  useEffect(() => {
    // Dummy data for now so you can see the "Jazz" immediately
    setWallet({
      balance: 45200.50,
      lockedBalance: 12500.00,
      currency: 'TT'
    });
    
    // api.get('/wallet/me').then((res) => setWallet(res.data));
  }, []);

  if (!wallet) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-orange-400" />
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Secure Vault</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase">Vault</h1>
        </div>
        
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all active:scale-95">
            Deposit
          </button>
          <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
            Withdraw
          </button>
        </div>
      </header>

      {/* Main Glass Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-blue-500/10 blur-[80px] opacity-50" />
        
        <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Balance Section */}
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Available Capital</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black tracking-tighter font-mono italic">
                    {Number(wallet.balance).toLocaleString()}
                  </span>
                  <span className="text-2xl font-black text-orange-400 italic">TT</span>
                </div>
              </div>

              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Locked</p>
                  <p className="text-xl font-bold font-mono text-white/60">
                    {Number(wallet.lockedBalance).toLocaleString()}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/5" />
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Net Worth</p>
                  <p className="text-xl font-bold font-mono text-green-400">
                    {(wallet.balance + wallet.lockedBalance).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions / Visual */}
            <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 space-y-4">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Vault Security</p>
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Zap size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-bold">Instant Settlements</p>
                  <p className="text-[10px] text-white/40">TT tokens update in real-time</p>
                </div>
              </div>
              <p className="text-[9px] text-white/20 leading-relaxed italic">
                Notice: These are virtual contest credits used exclusively for the Clutch Trades competition platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History (Mockup) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <History size={18} className="text-white/20" />
          <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Competition</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <TransactionRow type="Entry" target="Dragon Lore Inv." status="Settled" amount="-500" />
              <TransactionRow type="Reward" target="Daily Sprint" status="Won" amount="+1,200" isPositive />
              <TransactionRow type="Entry" target="Butterfly Knife" status="Settled" amount="-2,500" />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function TransactionRow({ type, target, status, amount, isPositive }: any) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          {isPositive ? (
            <ArrowDownLeft size={16} className="text-green-400" />
          ) : (
            <ArrowUpRight size={16} className="text-white/40" />
          )}
          <span className="text-sm font-bold">{type}</span>
        </div>
      </td>
      <td className="px-8 py-5 text-sm text-white/60 font-medium">{target}</td>
      <td className="px-8 py-5">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
          {status}
        </span>
      </td>
      <td className={`px-8 py-5 text-right font-mono font-bold ${isPositive ? 'text-green-400' : 'text-white'}`}>
        {amount} <span className="text-[10px]">TT</span>
      </td>
    </tr>
  );
}