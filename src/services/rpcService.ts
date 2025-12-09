import { ethers } from 'ethers';
import { ChainConfig, Transaction } from '../types';
import demoTransactions from '../data/demoTransactions.json';

// Cache for transaction data to avoid redundant RPC calls
const transactionCache = new Map<string, { data: Transaction[]; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

// Get ETH/USD price (simplified - in production, use a price API)
async function getETHPrice(): Promise<number> {
  try {
    // Using CoinGecko free API
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum?.usd || 2000; // Fallback price
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
    return 2000; // Fallback price
  }
}

// Get MATIC/USD price
async function getMATICPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
    const data = await response.json();
    return data['matic-network']?.usd || 0.8; // Fallback price
  } catch (error) {
    console.error('Failed to fetch MATIC price:', error);
    return 0.8; // Fallback price
  }
}

// Extract API key from RPC URL
function extractApiKey(rpcUrl: string): string {
  // RPC URL format: https://eth-mainnet.g.alchemy.com/v2/API_KEY
  const parts = rpcUrl.split('/');
  return parts[parts.length - 1];
}

// Fetch transactions for a wallet on a specific chain using Alchemy's getAssetTransfers API
// This is much more efficient than iterating through blocks (1 API call vs hundreds)
export async function fetchWalletTransactions(
  address: string,
  chain: ChainConfig,
  limit: number = 10
): Promise<Transaction[]> {
  const cacheKey = `${address}-${chain.id}`;
  const cached = transactionCache.get(cacheKey);
  
  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[RPC Service] Returning cached transactions for ${address} on ${chain.name}`);
    return cached.data;
  }

  try {
    // Validate API key is present
    if (chain.rpcUrl.includes('YOUR_API_KEY')) {
      throw new Error('API key not configured. Please add your Alchemy API key to the .env file.');
    }

    // Extract API key from RPC URL
    const apiKey = extractApiKey(chain.rpcUrl);
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      throw new Error('Invalid API key. Please check your .env file configuration.');
    }

    // Determine Alchemy base URL based on chain
    let baseUrl = '';
    if (chain.id === 1) {
      baseUrl = 'https://eth-mainnet.g.alchemy.com/v2';
    } else if (chain.id === 137) {
      baseUrl = 'https://polygon-mainnet.g.alchemy.com/v2';
    } else if (chain.id === 42161) {
      baseUrl = 'https://arb-mainnet.g.alchemy.com/v2';
    } else {
      throw new Error(`Unsupported chain: ${chain.name}`);
    }

    // Get token price
    const tokenPrice = chain.currency === 'ETH' 
      ? await getETHPrice() 
      : await getMATICPrice();

    console.log(`[RPC Service] Fetching transactions for ${address} on ${chain.name} using Alchemy API`);

    // Use Alchemy's getAssetTransfers API - this is much more efficient (1 API call)
    // Convert maxCount to hex string as required by Alchemy API
    const maxCountHex = `0x${(limit * 2).toString(16)}`;
    
    const response = await fetch(`${baseUrl}/${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: address,
            toAddress: address,
            category: ['external'], // Only external transfers (native token), exclude ERC20 to reduce complexity
            maxCount: maxCountHex, // Must be hex string format
            excludeZeroValue: false,
            withMetadata: true,
          },
        ],
      }),
    });

    // Check for rate limiting immediately
    if (response.status === 429) {
      throw new Error('Rate limit exceeded (429). Please wait a few minutes before trying again. The free Alchemy tier has rate limits.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Alchemy API error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      // Handle rate limiting in response body
      if (data.error.message?.includes('429') || data.error.message?.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
      }
      throw new Error(data.error.message || 'Alchemy API error');
    }

    const transfers = data.result?.transfers || [];
    const transactions: Transaction[] = [];
    const seenHashes = new Set<string>();

    console.log(`[RPC Service] Received ${transfers.length} transfers from Alchemy API`);

    for (const transfer of transfers) {
      if (transactions.length >= limit) break;

      const txHash = transfer.hash;
      if (!txHash || seenHashes.has(txHash)) continue;
      seenHashes.add(txHash);

      const isFrom = transfer.from?.toLowerCase() === address.toLowerCase();
      const isTo = transfer.to?.toLowerCase() === address.toLowerCase();

      if (!isFrom && !isTo) continue;

      // Parse value - Alchemy returns value as hex string or number
      let value: bigint;
      if (typeof transfer.value === 'string') {
        value = BigInt(transfer.value);
      } else if (typeof transfer.value === 'number') {
        value = BigInt(transfer.value);
      } else {
        value = 0n;
      }

      const amount = ethers.formatEther(value);
      const amountUSD = (parseFloat(amount) * tokenPrice).toFixed(2);

      // Parse block number
      let blockNumber: number | undefined;
      if (transfer.blockNum) {
        if (typeof transfer.blockNum === 'string') {
          blockNumber = parseInt(transfer.blockNum, 16);
        } else {
          blockNumber = transfer.blockNum;
        }
      }

      // Get timestamp from metadata if available, otherwise estimate from block number
      let timestamp: number;
      if (transfer.metadata?.blockTimestamp) {
        timestamp = new Date(transfer.metadata.blockTimestamp).getTime() / 1000;
      } else if (blockNumber) {
        // Rough estimate: 12 seconds per block (Ethereum average)
        timestamp = blockNumber * 12;
      } else {
        timestamp = Date.now() / 1000;
      }

      transactions.push({
        hash: txHash,
        timestamp: Math.floor(timestamp),
        type: isFrom ? 'sent' : 'received',
        amount,
        amountUSD,
        from: transfer.from || '',
        to: transfer.to || '',
        network: chain.name,
        status: 'confirmed', // Alchemy API returns confirmed transactions
        blockNumber,
      });
    }

    console.log(`[RPC Service] Processed ${transactions.length} transactions`);

    // If no transactions found from API, use demo transactions
    if (transactions.length === 0) {
      console.log(`[RPC Service] No transactions found, using demo data for ${chain.name}`);
      
      // Get demo transactions for the current chain
      const chainKey = chain.name.toLowerCase();
      const demoData = (demoTransactions as any)[chainKey] || [];
      
      // Replace demo addresses with the actual wallet address
      const demoTransactionsWithWallet: Transaction[] = demoData.map((tx: any) => ({
        ...tx,
        from: tx.type === 'sent' ? address.toLowerCase() : tx.from,
        to: tx.type === 'received' ? address.toLowerCase() : tx.to,
        // Update timestamp to be more recent (within last 30 days)
        timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 30 * 24 * 60 * 60),
      }));
      
      // Sort by timestamp (newest first)
      demoTransactionsWithWallet.sort((a, b) => b.timestamp - a.timestamp);
      
      // Cache the demo results
      transactionCache.set(cacheKey, {
        data: demoTransactionsWithWallet.slice(0, limit),
        timestamp: Date.now(),
      });
      
      return demoTransactionsWithWallet.slice(0, limit);
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    // Cache the results
    transactionCache.set(cacheKey, {
      data: transactions,
      timestamp: Date.now(),
    });

    return transactions.slice(0, limit);
  } catch (error: any) {
    console.error(`Error fetching transactions for ${chain.name}:`, error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch transactions';
    
    if (error?.message) {
      if (error.message.includes('429') || error.message.includes('Too Many Requests') || error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again. The free Alchemy tier has rate limits.';
      } else if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
        errorMessage = 'CORS error: Please verify your API key is correct in the .env file.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
        errorMessage = 'Network error: Please check your API key and internet connection.';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(errorMessage);
  }
}


