# Cross-Chain Wallet Activity Dashboard

A minimal, production-ready dashboard for viewing wallet activity across multiple blockchain networks (Ethereum, Polygon, Arbitrum). Built with React, TypeScript, Tailwind CSS, and ethers.js.

## 🚀 Features

- **Wallet Connection**: Connect MetaMask/Web3 wallet with seamless network switching
- **Multi-Chain Support**: View transactions across Ethereum, Polygon, and Arbitrum
- **Transaction History**: Display last 10 transactions with:
  - Timestamp
  - Transaction type (sent/received)
  - Amount in token units and USD equivalent
  - Recipient/Sender addresses
  - Network/Chain name
  - Status (pending, confirmed, failed)
- **Chain Selection**: Filter activity by blockchain with local storage persistence
- **Error Handling**: Graceful handling of network failures, invalid addresses, and rate limiting
- **Loading States**: Proper loading indicators and placeholder states
- **Responsive Design**: Mobile-first, fully responsive UI
- **Caching**: Transaction data caching to avoid redundant RPC calls

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask browser extension installed
- Alchemy API keys (free tier available at [alchemy.com](https://www.alchemy.com))

## 🛠️ Installation

1. **Clone the repository** (or navigate to the project directory)

```bash
cd orbitxpay
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Alchemy API Keys**

Create a `.env` file in the root directory:

```env
VITE_ALCHEMY_ETH_API_KEY=your_ethereum_api_key
VITE_ALCHEMY_POLYGON_API_KEY=your_polygon_api_key
VITE_ALCHEMY_ARBITRUM_API_KEY=your_arbitrum_api_key
```

Alternatively, you can directly update the RPC URLs in `src/constants/chains.ts`:

```typescript
rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Architecture

### Component Structure

```
src/
├── components/          # React components
│   ├── WalletConnection.tsx    # Wallet connect/disconnect UI
│   ├── ChainSelector.tsx       # Chain selection with persistence
│   └── TransactionList.tsx     # Transaction display component
├── context/             # Context API providers
│   ├── WalletContext.tsx       # Wallet state management
│   └── TransactionContext.tsx  # Transaction state management
├── services/           # Business logic
│   └── rpcService.ts          # RPC calls and transaction fetching
├── constants/          # Configuration
│   └── chains.ts              # Chain configurations
├── types/              # TypeScript types
│   └── index.ts               # Type definitions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles with Tailwind
```

### State Management: Context API

**Why Context API?**
- **Simplicity**: No external dependencies, built into React
- **Suitability**: Perfect for this use case with moderate state complexity
- **Performance**: Combined with React hooks, provides efficient re-renders
- **Maintainability**: Clear separation of concerns with dedicated contexts

**Architecture Decision:**
- `WalletContext`: Manages wallet connection state, address, chain ID, and MetaMask interactions
- `TransactionContext`: Handles transaction fetching, loading states, and error management
- Both contexts are independent, allowing for clean separation of concerns

### Data Fetching Strategy

**Multi-Chain Data Fetching: Sequential with Caching**

- **Why Sequential?**: 
  - Prevents overwhelming RPC providers with parallel requests
  - Better error handling and rate limit management
  - User typically views one chain at a time
- **Caching Strategy**:
  - 1-minute cache duration for transaction data
  - Cache key: `{address}-{chainId}`
  - Reduces redundant API calls and improves performance

### RPC Service Implementation

The `rpcService.ts` provides two approaches:

1. **Standard RPC Method** (default): Uses ethers.js to query recent blocks and filter transactions
2. **Alchemy Enhanced API** (recommended): Uses Alchemy's `getAssetTransfers` API for better performance

**Note**: The current implementation uses the standard RPC method. To use Alchemy's Enhanced API, update the service to use `fetchWalletTransactionsAlchemy()`.

### Styling: Tailwind CSS

**Why Tailwind CSS?**
- **Rapid Development**: Utility-first approach speeds up UI development
- **Consistency**: Built-in design system ensures visual consistency
- **Responsive**: Mobile-first breakpoints make responsive design easy
- **Performance**: Purges unused styles in production
- **Maintainability**: Styles co-located with components

**Mobile-First Approach**: All components are designed mobile-first, then enhanced for larger screens using Tailwind's responsive breakpoints (`sm:`, `md:`, `lg:`).

## 🔧 Configuration

### Chain Configuration

Edit `src/constants/chains.ts` to:
- Add new chains
- Update RPC URLs
- Modify chain metadata

### API Keys

For production, use environment variables:

1. Create `.env` file
2. Add your Alchemy API keys
3. Update `src/constants/chains.ts` to read from environment:

```typescript
rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_ETH_API_KEY}`,
```

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Select Chain**: Choose a blockchain network (Ethereum, Polygon, or Arbitrum)
3. **View Transactions**: Your last 10 transactions will automatically load
4. **Switch Networks**: Use the network buttons in the wallet connection card or switch in MetaMask
5. **Disconnect**: Click "Disconnect" to remove wallet connection

## 🎨 Design Decisions

### Mobile-First Responsive Design

- **Breakpoints**: 
  - Mobile: Default (< 640px)
  - Tablet: `sm:` (≥ 640px)
  - Desktop: `md:` (≥ 768px), `lg:` (≥ 1024px)
- **Layout**: Stacked on mobile, horizontal on desktop
- **Touch-Friendly**: Large tap targets (min 44px) for mobile users

### Error Handling

- **Network Errors**: User-friendly messages with retry suggestions
- **Rate Limiting**: Automatic delays and clear error messages
- **Invalid Addresses**: Validation before API calls
- **Wallet Errors**: Clear instructions for MetaMask issues

### Loading States

- **Skeleton Loaders**: For transaction list
- **Spinner Indicators**: For async operations
- **Placeholder States**: Empty state messages when no data

## 🧪 Testing

To test the application:

1. **Install MetaMask** browser extension
2. **Connect a wallet** with transaction history
3. **Switch between networks** to test multi-chain functionality
4. **Test error scenarios**:
   - Disconnect wallet mid-fetch
   - Switch networks rapidly
   - Use invalid addresses

## 🚧 Known Limitations & Future Improvements

### Current Limitations

1. **Transaction Fetching**: Currently uses standard RPC method (slower, limited to recent blocks)
2. **Price Fetching**: Uses CoinGecko free API (may have rate limits)
3. **No Pending Transaction Detection**: Only shows confirmed transactions
4. **Limited Chain Support**: Currently supports 3 chains (easily extensible)

### Future Improvements

- [ ] Implement Alchemy Enhanced API for better transaction fetching
- [ ] Add WebSocket support for real-time transaction updates
- [ ] Support for ERC-20 token transactions
- [ ] Transaction pagination (load more than 10)
- [ ] Export transaction history (CSV/JSON)
- [ ] Dark/light mode toggle (currently uses system preference)
- [ ] Unit tests for critical components
- [ ] Integration tests for wallet connection flow
- [ ] Add more chains (Optimism, Base, etc.)
- [ ] Transaction filtering and search
- [ ] Gas fee display

## 📦 Dependencies

- **react** ^18.2.0: UI framework
- **ethers** ^6.9.0: Ethereum library for wallet and blockchain interactions
- **typescript** ^5.2.2: Type safety
- **tailwindcss** ^3.3.6: Utility-first CSS framework
- **vite** ^5.0.8: Build tool and dev server

## 🔐 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Wallet Security**: All wallet operations require user approval via MetaMask
- **No Private Keys**: Application never handles private keys
- **HTTPS**: Always use HTTPS in production

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check the [Known Limitations](#-known-limitations--future-improvements) section
- Review error messages in the browser console
- Ensure MetaMask is properly installed and configured

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

