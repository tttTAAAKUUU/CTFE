export interface Market {
  id: number;
  name: string;
  symbol: string;
  active: boolean;
}

export interface Position {
  id: number;
  side: 'LONG' | 'SHORT';
  stake: number;
  entryPrice: number;
  exitPrice?: number;
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number;
  takeProfit?: number;
}

export interface Wallet {
  availableBalance: number;
  lockedBalance: number;
  currency: string;
}
