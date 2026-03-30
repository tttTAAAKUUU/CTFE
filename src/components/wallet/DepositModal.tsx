'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Wallet, Loader2, ArrowRight } from 'lucide-react';

export default function DepositModal() {
  const [amount, setAmount] = useState<string>('100');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || Number(amount) < 5) return alert("Minimum deposit is $5");
    
    setLoading(true);
    try {
      // 1. Get the signed payment data from our backend
      const response = await api.post('/payments/payfast/init', { 
        amount: Number(amount) 
      }) as any;

      const { url, data } = response.data || response;

      // 2. Create a hidden form and submit it to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      Object.keys(data).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Failed to initialize payment.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic">Top Up Wallet</h2>
          <p className="text-white/20 text-[10px] uppercase font-mono tracking-tighter">Secure Payment via PayFast</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 ml-2">Amount (ZAR/USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/60 border border-white/5 rounded-2xl pl-10 pr-4 py-4 outline-none focus:border-orange-500/50 transition-all font-bold text-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['50', '100', '500'].map(val => (
            <button 
              key={val}
              onClick={() => setAmount(val)}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${amount === val ? 'bg-orange-500 border-orange-500 text-black' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
            >
              ${val}
            </button>
          ))}
        </div>

        <button 
          onClick={handleDeposit}
          disabled={loading}
          className="w-full py-5 bg-orange-500 hover:bg-orange-400 disabled:bg-white/10 disabled:text-white/20 text-black rounded-2xl font-black uppercase italic transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Proceed to Payment
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="text-[9px] text-center text-white/10 uppercase font-medium">
          Instant processing • Encrypted connection
        </p>
      </div>
    </div>
  );
}