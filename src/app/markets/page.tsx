'use client';

import { useMarkets } from '@/hooks/useMarkets';

export default function MarketsPage() {
  const { markets, loading } = useMarkets();

  if (loading) return <p>Loading markets...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Markets</h1>

      {markets.map((m) => (
        <div
          key={m.id}
          className="border p-4 rounded flex justify-between"
        >
          <div>
            <p className="font-semibold">{m.name}</p>
            <p className="text-sm text-gray-500">{m.symbol}</p>
          </div>

          <span
            className={
              m.active ? 'text-green-600' : 'text-red-600'
            }
          >
            {m.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      ))}
    </div>
  );
}
