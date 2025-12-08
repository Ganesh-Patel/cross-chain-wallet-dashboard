// Chain configuration type
export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currency: string;
  currencySymbol: string;
}

// Transaction type
export interface Transaction {
  hash: string;
  timestamp: number;
  type: 'sent' | 'received';
  amount: string;
  amountUSD: string;
  from: string;
  to: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

// Wallet state type
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// Transaction state type
export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

