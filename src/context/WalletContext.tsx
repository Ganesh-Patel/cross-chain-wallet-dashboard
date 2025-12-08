import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';
import { getChainById } from '../constants/chains';

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = (): boolean => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Get provider
  const getProvider = (): ethers.BrowserProvider | null => {
    if (!isMetaMaskInstalled()) return null;
    return new ethers.BrowserProvider(window.ethereum);
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setWallet((prev) => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
      }));
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error('Provider not available');
      }

      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      setWallet({
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWallet((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  // Handle account changes
  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      const provider = getProvider();
      if (provider) {
        const network = await provider.getNetwork();
        setWallet((prev) => ({
          ...prev,
          address: accounts[0],
          chainId: Number(network.chainId),
        }));
      }
    }
  }, []);

  // Handle chain changes
  const handleChainChanged = useCallback(async (chainId: string) => {
    const provider = getProvider();
    if (provider) {
      const network = await provider.getNetwork();
      setWallet((prev) => ({
        ...prev,
        chainId: Number(network.chainId),
      }));
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, [handleAccountsChanged, handleChainChanged]);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!isMetaMaskInstalled()) {
      setWallet((prev) => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If chain doesn't exist, try to add it
      if (error.code === 4902) {
        const chain = getChainById(chainId);
        if (chain) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: chain.name,
                  nativeCurrency: {
                    name: chain.currency,
                    symbol: chain.currencySymbol,
                    decimals: 18,
                  },
                  rpcUrls: [chain.rpcUrl],
                  blockExplorerUrls: [chain.explorerUrl],
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding chain:', addError);
            setWallet((prev) => ({
              ...prev,
              error: `Failed to add ${chain.name} network`,
            }));
          }
        }
      } else {
        console.error('Error switching network:', error);
        setWallet((prev) => ({
          ...prev,
          error: error.message || 'Failed to switch network',
        }));
      }
    }
  }, []);

  // Refresh wallet state
  const refreshWallet = useCallback(async () => {
    if (!isMetaMaskInstalled() || !wallet.isConnected) return;

    try {
      const provider = getProvider();
      if (!provider) return;

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      setWallet((prev) => ({
        ...prev,
        address,
        chainId,
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    }
  }, [wallet.isConnected]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const provider = getProvider();
        if (!provider) return;

        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          const chainId = Number(network.chainId);

          setWallet({
            address,
            chainId,
            isConnected: true,
            isConnecting: false,
            error: null,
          });

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      send: (method: string, params?: any[]) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

