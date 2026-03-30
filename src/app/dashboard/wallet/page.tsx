// src/app/dashboard/wallet/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ArrowUpRight, ArrowDownLeft, Shield, Zap, History, Loader2, RefreshCcw } from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletData = async () => {
    try {
      // ✅ Fixed Type Casting for Promise.all
      const [walletData, txData]: any = await Promise.all([
        api.get('/wallet/me'),
        api.get('/wallet/transactions')
      ]);
      
      setWallet(walletData);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err) {
      console.error("Failed to sync vault:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTestDeposit = async () => {
    try {
      setRefreshing(true);
      // ✅ Hits the temporary dev endpoint we're adding to the backend
      await api.post('/wallet/add-test-funds', { amount: 1000 });
      await fetchWalletData();
      alert("Test Funds Added: +1000 TT");
    } catch (err) {
      alert("Failed to add test funds. Ensure backend endpoint exists.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <Loader2 className="animate-spin mx-auto text-orange-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Vault...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-orange-400" />
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Secure Vault</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white">Vault</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => { setRefreshing(true); fetchWalletData(); }}
            className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"
          >
            <RefreshCcw size={20} className={refreshing ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={handleTestDeposit}
            disabled={refreshing}
            className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {refreshing ? 'Processing...' : 'Add Test Funds'}
          </button>
        </div>
      </header>

      {/* Balance Card */}
      <div className="relative group px-4 md:px-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-blue-500/10 blur-[80px] opacity-50" />
        <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Available Capital</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black tracking-tighter font-mono italic">
                    {Number(wallet?.availableBalance || 0).toLocaleString()}
                  </span>
                  <span className="text-2xl font-black text-orange-400 italic">{wallet?.currency || 'TT'}</span>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Locked</p>
                  <p className="text-xl font-bold font-mono text-white/60">{Number(wallet?.lockedBalance || 0).toLocaleString()}</p>
                </div>
                <div className="w-px h-10 bg-white/5" />
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Net Worth</p>
                  <p className="text-xl font-bold font-mono text-green-400">
                    {(Number(wallet?.availableBalance || 0) + Number(wallet?.lockedBalance || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 space-y-4 flex flex-col justify-center">
               <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Zap size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-bold">Real-time Settlements</p>
                  <p className="text-[10px] text-white/40">Tokens update instantly on join</p>
                </div>
              </div>
              <p className="text-[9px] text-white/20 leading-relaxed italic">
                Vault activity is encrypted and stored on-chain for the duration of the contest.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <section className="space-y-6 px-4 md:px-0">
        <div className="flex items-center gap-3">
          <History size={18} className="text-white/20" />
          <h2 className="text-xl font-bold tracking-tight text-white">Recent Activity</h2>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Type</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length > 0 ? transactions.map((tx) => (
                  <TransactionRow 
                    key={tx.id} 
                    type={tx.type} 
                    status={tx.status} 
                    amount={tx.amount} 
                    date={new Date(tx.createdAt).toLocaleDateString()}
                    isPositive={tx.type === 'DEPOSIT' || tx.type === 'BET_SETTLEMENT'} 
                  />
                )) : (
                  <tr><td colSpan={4} className="p-10 text-center text-white/20 uppercase text-[10px] font-black">No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function TransactionRow({ type, status, amount, isPositive, date }: any) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors text-white">
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          {isPositive ? <ArrowDownLeft size={16} className="text-green-400" /> : <ArrowUpRight size={16} className="text-white/40" />}
          <span className="text-sm font-bold uppercase tracking-tight">{type.replace('_', ' ')}</span>
        </div>
      </td>
      <td className="px-8 py-5 text-[10px] text-white/40 font-mono">{date}</td>
      <td className="px-8 py-5">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
          {status}
        </span>
      </td>
      <td className={`px-8 py-5 text-right font-mono font-bold ${isPositive ? 'text-green-400' : 'text-white'}`}>
        {isPositive ? '+' : '-'}{amount} <span className="text-[10px]">TT</span>
      </td>
    </tr>
  );
}