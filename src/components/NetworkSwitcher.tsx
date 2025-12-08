import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { CHAINS, getChainById } from '../constants/chains';

export const NetworkSwitcher: React.FC = () => {
  const { wallet, switchNetwork } = useWallet();
  const [isSwitching, setIsSwitching] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentChain = wallet.chainId ? getChainById(wallet.chainId) : null;

  const handleNetworkSwitch = async (chainId: number) => {
    setIsSwitching(chainId);
    try {
      await switchNetwork(chainId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching network:', error);
    } finally {
      setIsSwitching(null);
    }
  };

  const getChainIcon = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case 'ethereum':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
          </svg>
        );
      case 'polygon':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L3.75 6v12L12 24l8.25-6V6L12 0zm0 2.18l6 4.36v8.72l-6 4.36-6-4.36V6.54l6-4.36z"/>
          </svg>
        );
      case 'arbitrum':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L2 6v12l10 6 10-6V6L12 0zm0 2.5l7.5 4.5v9l-7.5 4.5-7.5-4.5V7l7.5-4.5z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  if (!wallet.isConnected) {
    return null;
  }

  return (
    <div className="relative">
      {/* Current Network Display / Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
      >
        <div className="flex items-center space-x-2">
          {currentChain && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
              {getChainIcon(currentChain.name)}
            </div>
          )}
          <div className="text-left">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Current Network
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {currentChain?.name || 'Unknown'}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Network Selection Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Switch Network
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select a blockchain network to view transactions
              </p>
            </div>
            
            <div className="p-2">
              {Object.entries(CHAINS).map(([key, chain]) => {
                const isActive = wallet.chainId === chain.id;
                const isSwitchingTo = isSwitching === chain.id;

                return (
                  <button
                    key={chain.id}
                    onClick={() => handleNetworkSwitch(chain.id)}
                    disabled={isActive || isSwitchingTo}
                    className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-500 dark:border-blue-400'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${isSwitchingTo ? 'opacity-50 cursor-wait' : ''} ${
                      !isActive && !isSwitchingTo ? 'hover:scale-105 active:scale-95' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {getChainIcon(chain.name)}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {chain.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {chain.currencySymbol}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isSwitchingTo && (
                        <svg
                          className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      {isActive && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            Active
                          </span>
                        </div>
                      )}
                      {!isActive && !isSwitchingTo && (
                        <svg
                          className="w-5 h-5 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                You may need to approve the network switch in MetaMask
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

