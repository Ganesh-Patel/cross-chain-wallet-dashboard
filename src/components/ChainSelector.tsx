import React, { useEffect, useState } from 'react';
import { CHAINS, STORAGE_KEYS, getChainByName } from '../constants/chains';
import { ChainConfig } from '../types';

interface ChainSelectorProps {
  selectedChain: ChainConfig;
  onChainChange: (chain: ChainConfig) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, onChainChange }) => {
  const [selected, setSelected] = useState<ChainConfig>(selectedChain);

  useEffect(() => {
    // Load saved preference from local storage
    const savedChain = localStorage.getItem(STORAGE_KEYS.SELECTED_CHAIN);
    if (savedChain) {
      const chain = getChainByName(savedChain);
      if (chain) {
        setSelected(chain);
        onChainChange(chain);
      }
    }
  }, [onChainChange]);

  const handleChainChange = (chainName: string) => {
    const chain = getChainByName(chainName);
    if (chain) {
      setSelected(chain);
      localStorage.setItem(STORAGE_KEYS.SELECTED_CHAIN, chainName);
      onChainChange(chain);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Select Blockchain Network
        </h3>
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Choose a network to view transactions</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(CHAINS).map(([key, chain]) => (
          <button
            key={chain.id}
            onClick={() => handleChainChange(key)}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              selected.id === chain.id
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg shadow-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="text-left">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-bold text-lg ${
                  selected.id === chain.id
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {chain.name}
                </h4>
                {selected.id === chain.id && (
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full shadow-lg animate-bounce">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className={`text-sm font-medium ${
                selected.id === chain.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {chain.currencySymbol}
              </p>
              {selected.id === chain.id && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Active Network</p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

