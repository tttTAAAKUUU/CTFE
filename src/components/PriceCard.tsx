import React, { useState, useEffect } from 'react';
import { usePriceSocket } from '../hooks/usePriceSocket';

export const PriceCard = ({ marketId, initialPrice }: { marketId: number, initialPrice: number }) => {
  const [price, setPrice] = useState(initialPrice);
  const { latestUpdate, isConnected } = usePriceSocket();

  useEffect(() => {
    // Only update if the broadcast matches THIS specific item
    if (latestUpdate && latestUpdate.marketId === marketId) {
      setPrice(latestUpdate.price);
    }
  }, [latestUpdate, marketId]);

  return (
    <div className={`card ${isConnected ? 'online' : 'offline'}`}>
      <h3>Current Price</h3>
      <div className="price-tag">${price.toFixed(2)}</div>
      {isConnected ? <span>● Live</span> : <span>○ Reconnecting...</span>}
    </div>
  );
};