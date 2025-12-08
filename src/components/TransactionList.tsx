import React from 'react';
import { Transaction } from '../types';
import { useTransactions } from '../context/TransactionContext';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const { isLoading, error } = useTransactions();

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: Transaction['type']): string => {
    return type === 'sent'
      ? 'text-red-600 dark:text-red-400'
      : 'text-green-600 dark:text-green-400';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading transactions...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Fetching your transaction history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl animate-shake">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-lg mb-1">Error loading transactions</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-xl font-semibold mb-2">No transactions found</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-md">
            Transactions will appear here once you have activity on the selected network
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div
            key={tx.hash}
            className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getTypeColor(tx.type)} ${
                      tx.type === 'sent' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
                    }`}
                  >
                    {tx.type === 'sent' ? '↓ Sent' : '↑ Received'}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(tx.status)}`}
                  >
                    {tx.status.toUpperCase()}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {tx.network}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {parseFloat(tx.amount).toFixed(6)} {tx.network === 'Polygon' ? 'MATIC' : 'ETH'}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      ≈ ${tx.amountUSD}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">From:</span>
                      <span className="font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {tx.from.slice(0, 8)}...{tx.from.slice(-6)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">To:</span>
                      <span className="font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTimestamp(tx.timestamp)}</span>
                    {tx.blockNumber && (
                      <>
                        <span>•</span>
                        <span>Block #{tx.blockNumber.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={
                    tx.network === 'Polygon'
                      ? `https://polygonscan.com/tx/${tx.hash}`
                      : tx.network === 'Arbitrum'
                      ? `https://arbiscan.io/tx/${tx.hash}`
                      : `https://etherscan.io/tx/${tx.hash}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <span>View on Explorer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

