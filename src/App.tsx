import React, { useState, useEffect, useRef } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WalletConnection } from './components/WalletConnection';
import { ChainSelector } from './components/ChainSelector';
import { TransactionList } from './components/TransactionList';
import { ChainConfig } from './types';
import { CHAINS, getChainByName, STORAGE_KEYS } from './constants/chains';

const DashboardContent: React.FC = () => {
  const { wallet } = useWallet();
  const { transactions, fetchTransactions, clearError } = useTransactions();
  const [selectedChain, setSelectedChain] = useState<ChainConfig>(CHAINS.ethereum);

  // Store fetchTransactions in a ref to avoid dependency issues
  const fetchTransactionsRef = useRef(fetchTransactions);
  useEffect(() => {
    fetchTransactionsRef.current = fetchTransactions;
  }, [fetchTransactions]);

  // Load saved chain preference
  useEffect(() => {
    const savedChain = localStorage.getItem(STORAGE_KEYS.SELECTED_CHAIN);
    if (savedChain) {
      const chain = getChainByName(savedChain);
      if (chain) {
        setSelectedChain(chain);
      }
    }
  }, []);

  // Fetch transactions when wallet is connected and chain is selected
  // Use ref to track last fetched to prevent infinite loops
  const lastFetchedRef = useRef<string>('');
  const isFetchingRef = useRef<boolean>(false);
  const rateLimitCooldownRef = useRef<number>(0);
  
  useEffect(() => {
    const fetchKey = `${wallet.address}-${selectedChain.id}`;
    const now = Date.now();
    
    // Check if we're in a rate limit cooldown period (5 minutes)
    if (rateLimitCooldownRef.current > now) {
      const remainingSeconds = Math.ceil((rateLimitCooldownRef.current - now) / 1000);
      console.log(`[App] Rate limit cooldown active, ${remainingSeconds}s remaining`);
      return;
    }
    
    // Only fetch if wallet is connected, we haven't fetched this combination yet, and not currently fetching
    if (
      wallet.isConnected && 
      wallet.address && 
      lastFetchedRef.current !== fetchKey &&
      !isFetchingRef.current
    ) {
      lastFetchedRef.current = fetchKey;
      isFetchingRef.current = true;
      
      console.log(`[App] Triggering fetch for ${fetchKey}`);
      
      fetchTransactionsRef.current(selectedChain)
        .catch((err) => {
          console.error(`[App] Error fetching transactions:`, err);
          // On rate limit errors, set a cooldown period (5 minutes)
          const errorMsg = err.message || '';
          if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
            console.log(`[App] Rate limit error, setting 5 minute cooldown`);
            rateLimitCooldownRef.current = now + (5 * 60 * 1000); // 5 minutes
            lastFetchedRef.current = ''; // Allow retry after cooldown
          } else if (errorMsg.includes('CORS')) {
            // For CORS errors, don't retry automatically
            console.log(`[App] CORS error, not retrying automatically`);
          }
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
    }
  }, [wallet.isConnected, wallet.address, selectedChain.id]);

  const handleChainChange = (chain: ChainConfig) => {
    setSelectedChain(chain);
    clearError();
    // Reset the fetch ref so it can fetch the new chain
    lastFetchedRef.current = '';
    // The useEffect will automatically trigger the fetch
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Cross-Chain Wallet Activity Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Track and analyze your transaction history across Ethereum, Polygon, and Arbitrum networks in one unified dashboard
            </p>
          </div>

          <div className="space-y-6">
            <WalletConnection />

            {wallet.isConnected && (
              <>
                <ChainSelector selectedChain={selectedChain} onChainChange={handleChainChange} />
                <TransactionList transactions={transactions} />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <TransactionProvider>
          <DashboardContent />
        </TransactionProvider>
      </WalletProvider>
    </ThemeProvider>
  );
};

export default App;

