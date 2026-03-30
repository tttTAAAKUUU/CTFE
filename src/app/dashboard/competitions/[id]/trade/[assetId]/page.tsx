// src/app/dashboard/competitions/[id]/trade/[assetId]/page.tsx
'use client';

import { useState, useEffect, use, useRef, useMemo } from 'react';
import { Loader2, TrendingUp, TrendingDown, Search, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TradingScreen({ params }: { params: Promise<{ id: string, assetId: string }> }) {
  const { id, assetId } = use(params);
  const router = useRouter();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  const [competition, setCompetition] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [myPositions, setMyPositions] = useState<any[]>([]);
  const [stake, setStake] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return competition?.allowedAssets?.filter((a: any) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [competition, searchTerm]);

  const fetchPositions = async () => {
    try {
      const res: any = await api.get('/positions/me');
      setMyPositions(res.data ?? res);
    } catch (e) { console.error("Positions fetch failed"); }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res: any = await api.get(`/competitions/${id}`);
        const data = res.data ?? res;
        setCompetition(data);
        const asset = data.allowedAssets?.find((a: any) => Number(a.id) === Number(assetId));
        if (asset) setSelectedAsset({ ...asset, currentPrice: Number(asset.currentPrice) });
      } catch (err) { setError("Failed to load competition."); }
    }
    fetchData();
    fetchPositions();
  }, [id, assetId]);

  useEffect(() => {
    if (!chartContainerRef.current || !selectedAsset) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#A0A0A0' },
      grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
      width: chartContainerRef.current.clientWidth,
      height: 450,
      timeScale: { timeVisible: true },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e', downColor: '#ef4444', borderVisible: false,
      wickUpColor: '#22c55e', wickDownColor: '#ef4444',
    });
    chartRef.current = chart;
    seriesRef.current = series;

    api.get(`/markets/${selectedAsset.id}/history`).then((res: any) => {
      const history = res.data ?? res;
      if (history.length > 0) {
        series.setData(history.map((c: any) => ({
          time: c.time,
          open: Number(c.open), high: Number(c.high), low: Number(c.low), close: Number(c.close)
        })));
        chart.timeScale().fitContent();
      }
    });

    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, [selectedAsset]);

  const handleTrade = async (type: 'LONG' | 'SHORT') => {
    if (!stake || Number(stake) <= 0) return alert("Enter valid stake");
    setLoading(true);
    try {
      await api.post('/positions', { competitionId: Number(id), marketId: Number(selectedAsset.id), type, stake: Number(stake) });
      setStake('');
      fetchPositions();
    } catch (err: any) { alert(err.response?.data?.message || "Trade failed"); }
    finally { setLoading(false); }
  };

  const closePosition = async (posId: number) => {
    try {
      await api.post(`/positions/${posId}/close`);
      fetchPositions();
    } catch (e) { alert("Close failed"); }
  };

  if (error) return <div className="h-screen flex items-center justify-center text-red-500 font-black italic uppercase">{error}</div>;
  if (!selectedAsset) return <div className="h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="space-y-6 pb-20 p-4 max-w-[1400px] mx-auto">
      {/* Search & Tabs */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input className="w-full bg-black border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold uppercase italic outline-none focus:border-orange-500" placeholder="Search Assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filteredAssets.map((a: any) => (
            <Link key={a.id} href={`/dashboard/competitions/${id}/trade/${a.id}`} className={`px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase italic whitespace-nowrap transition-all ${selectedAsset.id === a.id ? 'bg-orange-500 border-orange-500 text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>{a.name}</Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
          <div className="mb-8">
            <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter leading-none">{selectedAsset.name}</h2>
            <p className="text-3xl font-mono font-bold text-orange-500 mt-2">${selectedAsset.currentPrice.toFixed(2)}</p>
          </div>
          <div ref={chartContainerRef} className="w-full min-h-[450px]" />
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8">
            <label className="text-[10px] font-black uppercase text-white/20 block mb-2">Stake (TT)</label>
            <input type="number" value={stake} onChange={(e) => setStake(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-2xl font-mono text-white outline-none focus:border-orange-500" placeholder="0.00" />
            <div className="space-y-3 mt-6">
              <button onClick={() => handleTrade('LONG')} disabled={loading} className="w-full bg-[#22c55e] text-black font-black py-5 rounded-2xl uppercase italic flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"><TrendingUp size={20} /> Open Long</button>
              <button onClick={() => handleTrade('SHORT')} disabled={loading} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase italic flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-95 transition-all"><TrendingDown size={20} /> Open Short</button>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
        <h3 className="text-xl font-black italic uppercase text-white mb-6">Your Open Positions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-white/20 border-b border-white/5">
                <th className="pb-4">Asset</th>
                <th className="pb-4">Side</th>
                <th className="pb-4">Entry</th>
                <th className="pb-4">Stake</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-white uppercase italic">
              {myPositions.map((pos: any) => (
                <tr key={pos.id} className="border-b border-white/5">
                  <td className="py-4">{pos.market?.name}</td>
                  <td className={`py-4 ${pos.side === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>{pos.side}</td>
                  <td className="py-4 font-mono">${Number(pos.entryPrice).toFixed(2)}</td>
                  <td className="py-4 font-mono">{pos.stake} TT</td>
                  <td className="py-4 text-right">
                    <button onClick={() => closePosition(pos.id)} className="text-white/40 hover:text-red-500 transition-colors"><XCircle size={20} /></button>
                  </td>
                </tr>
              ))}
              {myPositions.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-white/20 text-xs">No active trades in this competition.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}