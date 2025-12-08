import { ChainConfig } from '../types';

// Chain configurations
// Note: Replace YOUR_API_KEY with your Alchemy API keys
// You can get free API keys at https://www.alchemy.com
// For environment variables, use: import.meta.env.VITE_ALCHEMY_ETH_API_KEY

const getRpcUrl = (baseUrl: string, apiKey?: string): string => {
  const key = apiKey || 'YOUR_API_KEY';
  return `${baseUrl}/${key}`;
};

export const CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: getRpcUrl(
      'https://eth-mainnet.g.alchemy.com/v2',
      import.meta.env.VITE_ALCHEMY_ETH_API_KEY
    ),
    explorerUrl: 'https://etherscan.io',
    currency: 'ETH',
    currencySymbol: 'ETH',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpcUrl: getRpcUrl(
      'https://polygon-mainnet.g.alchemy.com/v2',
      import.meta.env.VITE_ALCHEMY_POLYGON_API_KEY
    ),
    explorerUrl: 'https://polygonscan.com',
    currency: 'MATIC',
    currencySymbol: 'MATIC',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    rpcUrl: getRpcUrl(
      'https://arb-mainnet.g.alchemy.com/v2',
      import.meta.env.VITE_ALCHEMY_ARBITRUM_API_KEY
    ),
    explorerUrl: 'https://arbiscan.io',
    currency: 'ETH',
    currencySymbol: 'ETH',
  },
};

// Get chain by ID
export const getChainById = (chainId: number): ChainConfig | undefined => {
  return Object.values(CHAINS).find((chain) => chain.id === chainId);
};

// Get chain by name
export const getChainByName = (name: string): ChainConfig | undefined => {
  return CHAINS[name.toLowerCase()];
};

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_CHAIN: 'wallet-dashboard-selected-chain',
};

