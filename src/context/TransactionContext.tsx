import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { Transaction, ChainConfig } from '../types';
import { fetchWalletTransactions } from '../services/rpcService';
import { useWallet } from './WalletContext';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (chain: ChainConfig) => Promise<void>;
  clearError: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const { wallet } = useWallet();

  const fetchTransactions = useCallback(
    async (chain: ChainConfig) => {
      if (!wallet.address) {
        setError('Wallet not connected');
        return;
      }

      // Prevent concurrent fetches using ref
      if (isFetchingRef.current) {
        console.log('[TransactionContext] Already fetching, skipping duplicate request');
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Validate wallet address
        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.address)) {
          throw new Error('Invalid wallet address');
        }

        console.log(`[TransactionContext] Fetching transactions for ${wallet.address} on ${chain.name}`);
        const txData = await fetchWalletTransactions(wallet.address, chain, 10);
        console.log(`[TransactionContext] Received ${txData.length} transactions:`, txData);
        setTransactions(txData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch transactions. Please try again later.';
        
        // Handle specific error types
        if (errorMessage.includes('rate limit') || errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
          setError('Rate limit exceeded. Please wait a few minutes and try again. The free Alchemy tier has rate limits.');
        } else if (errorMessage.includes('CORS') || errorMessage.includes('Access-Control-Allow-Origin')) {
          setError('CORS error: Please check your API key and ensure it\'s correctly configured in the .env file.');
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
          setError('Network error. Please check your connection and API key configuration.');
        } else {
          setError(errorMessage);
        }
        
        setTransactions([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [wallet.address]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        fetchTransactions,
        clearError,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

