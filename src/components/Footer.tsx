import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                OrbitXPay
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your gateway to cross-chain wallet activity tracking across multiple blockchain networks.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://ethereum.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Ethereum
                </a>
              </li>
              <li>
                <a
                  href="https://polygon.technology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Polygon
                </a>
              </li>
              <li>
                <a
                  href="https://arbitrum.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Arbitrum
                </a>
              </li>
              <li>
                <a
                  href="https://www.alchemy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Alchemy
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  MetaMask
                </a>
              </li>
              <li>
                <a
                  href="https://docs.metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} OrbitXPay. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Built with React, TypeScript & Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

