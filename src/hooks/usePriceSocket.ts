import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Use your NestJS backend URL
const SOCKET_URL = 'http://localhost:3001'; 

export const usePriceSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ['websocket'], // Faster for real-time data
    });

    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));

    // Listen for the event we created in the MarketsGateway
    s.on('priceUpdate', (data) => {
      setLatestUpdate(data);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return { latestUpdate, isConnected };
};