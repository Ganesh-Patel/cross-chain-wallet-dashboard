import React from 'react';
import { useWallet } from '../context/WalletContext';
import { getChainById } from '../constants/chains';
import { NetworkSwitcher } from './NetworkSwitcher';

export const WalletConnection: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!wallet.isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Connect your MetaMask wallet to view your transaction history across multiple blockchain networks
            </p>
          </div>
          <button
            onClick={connectWallet}
            disabled={wallet.isConnecting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {wallet.isConnecting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
          {wallet.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm max-w-md w-full animate-shake">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{wallet.error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentChain = wallet.chainId ? getChainById(wallet.chainId) : null;

  return (
    <div className="space-y-6 mb-6">
      {/* Wallet Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">Wallet Connected</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Wallet Address</p>
              <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white break-all">
                {formatAddress(wallet.address!)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Disconnect</span>
            </button>
          </div>
        </div>
        {wallet.error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm animate-shake">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{wallet.error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Network Switcher */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Network Settings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Switch between different blockchain networks
          </p>
        </div>
        <NetworkSwitcher />
      </div>
    </div>
  );
};

