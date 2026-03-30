import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Market } from '@/lib/types';

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Market[]>('/markets')
      .then((res) => setMarkets(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { markets, loading };
}
