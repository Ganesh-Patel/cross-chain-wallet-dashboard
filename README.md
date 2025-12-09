# 🌐 OrbitXPay - Cross-Chain Wallet Activity Dashboard

A beautiful, modern dashboard to view and track your cryptocurrency wallet transactions across multiple blockchain networks. Built with React, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Table of Contents

- [What is This?](#-what-is-this)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [How to Use](#-how-to-use)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 What is This?

OrbitXPay is a web application that lets you:

- **Connect your MetaMask wallet** to view your transaction history
- **View transactions** across multiple blockchain networks (Ethereum, Polygon, Arbitrum)
- **See transaction details** including amounts, timestamps, status, and more
- **Switch between networks** easily with a beautiful UI
- **Track your activity** with a clean, professional dashboard

Perfect for anyone who wants to monitor their crypto wallet activity in one place!

---

## ✨ Features

### 🔐 Wallet Management
- **MetaMask Integration**: Connect and disconnect your wallet seamlessly
- **Network Switching**: Switch between Ethereum, Polygon, and Arbitrum networks
- **Auto-Detection**: Automatically detects your current network
- **Connection Status**: Visual indicators for wallet connection status

### 📊 Transaction Display
- **Last 10 Transactions**: View your most recent transactions
- **Complete Details**: See all transaction information:
  - Transaction hash (with explorer links)
  - Timestamp (formatted date/time)
  - Type (Sent or Received)
  - Amount (in token units and USD equivalent)
  - From/To addresses
  - Network/Chain name
  - Status (Confirmed, Pending, or Failed)
  - Block number

### 🎨 User Interface
- **Modern Design**: Beautiful, professional UI with gradients and animations
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Loading States**: Smooth loading animations while fetching data
- **Error Handling**: Clear error messages when something goes wrong

### 🚀 Smart Features
- **Demo Mode**: Shows demo transactions if your wallet has no activity
- **Caching**: Reduces API calls with smart caching
- **Rate Limit Handling**: Gracefully handles API rate limits
- **Local Storage**: Remembers your preferred network selection

---

## 📸 Screenshots

### Dashboard View
- Clean, modern interface with wallet connection card
- Network switcher with visual indicators
- Transaction list with detailed information
- Dark/light theme toggle

### Mobile View
- Fully responsive design
- Touch-friendly buttons
- Optimized layouts for small screens

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **MetaMask** browser extension
   - Install from [metamask.io](https://metamask.io/)
   - Create or import a wallet

4. **Alchemy API Keys** (free tier available)
   - Sign up at [alchemy.com](https://www.alchemy.com/)
   - Create apps for Ethereum, Polygon, and Arbitrum
   - Get your API keys from the dashboard

---

## 📦 Installation

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd orbitxpay
```

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

This will install:
- React and React DOM
- TypeScript
- Tailwind CSS
- ethers.js (for blockchain interactions)
- Vite (build tool)

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your Alchemy API keys:

```env
VITE_ALCHEMY_ETH_API_KEY=your_ethereum_api_key_here
VITE_ALCHEMY_POLYGON_API_KEY=your_polygon_api_key_here
VITE_ALCHEMY_ARBITRUM_API_KEY=your_arbitrum_api_key_here
```

**Important**: 
- Replace `your_ethereum_api_key_here` with your actual API keys
- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see output like:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

---

## ⚙️ Configuration

### API Keys Setup

#### Getting Alchemy API Keys

1. **Sign Up**: Go to [alchemy.com](https://www.alchemy.com/) and create a free account

2. **Create Apps**: 
   - Create an app for Ethereum Mainnet
   - Create an app for Polygon Mainnet
   - Create an app for Arbitrum One

3. **Get API Keys**:
   - Click on each app
   - Copy the "API Key" (it looks like: `3l9bY4vU-R8eZheFyzKmw`)
   - Add them to your `.env` file

#### Alternative: Direct Configuration

If you prefer not to use environment variables, you can directly edit `src/constants/chains.ts`:

```typescript
rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY_HERE',
```

### Chain Configuration

To add or modify blockchain networks, edit `src/constants/chains.ts`:

```typescript
export const CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: getRpcUrl('https://eth-mainnet.g.alchemy.com/v2', ...),
    // ... other config
  },
  // Add more chains here
};
```

---

## 🎮 How to Use

### 1. Connect Your Wallet

1. Click the **"Connect Wallet"** button
2. MetaMask will open and ask for permission
3. Click **"Connect"** in MetaMask
4. Your wallet address will appear

### 2. View Transactions

Once connected:
- Transactions will automatically load for the selected network
- If you have no transactions, demo transactions will be shown
- Look for the "DEMO DATA" badge to know when demo data is displayed

### 3. Switch Networks

**Option 1: Using the Network Switcher**
- Click on the current network card
- Select a network from the dropdown (Ethereum, Polygon, or Arbitrum)
- Transactions will reload for the new network

**Option 2: Using MetaMask**
- Click the network dropdown in MetaMask
- Select a network
- The dashboard will automatically update

### 4. View Transaction Details

Each transaction card shows:
- **Type**: Sent (↓) or Received (↑)
- **Status**: Confirmed (green), Pending (yellow), or Failed (red)
- **Amount**: In token units and USD
- **Addresses**: From and To addresses (shortened)
- **Timestamp**: When the transaction occurred
- **Block Number**: The block containing the transaction
- **View Link**: Click to see on blockchain explorer

### 5. Toggle Theme

- Click the sun/moon icon in the header
- Switch between light and dark mode
- Your preference is saved automatically

### 6. Disconnect Wallet

- Click the **"Disconnect"** button
- Your wallet connection will be removed
- You can reconnect anytime

---

## 📁 Project Structure

```
orbitxpay/
├── src/
│   ├── components/          # React UI components
│   │   ├── Header.tsx       # Top navigation with theme toggle
│   │   ├── Footer.tsx       # Footer with links
│   │   ├── WalletConnection.tsx    # Wallet connect/disconnect UI
│   │   ├── NetworkSwitcher.tsx     # Network selection dropdown
│   │   ├── ChainSelector.tsx       # Chain filter selector
│   │   └── TransactionList.tsx     # Transaction display
│   │
│   ├── context/             # State management (Context API)
│   │   ├── WalletContext.tsx       # Wallet state
│   │   ├── TransactionContext.tsx  # Transaction state
│   │   └── ThemeContext.tsx       # Theme (dark/light) state
│   │
│   ├── services/            # Business logic
│   │   └── rpcService.ts          # API calls to Alchemy
│   │
│   ├── constants/           # Configuration
│   │   └── chains.ts              # Chain configurations
│   │
│   ├── data/                # Static data
│   │   └── demoTransactions.json  # Demo transaction data
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── .env                     # Environment variables (not in git)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # This file
```

---

## 🔧 How It Works

### Architecture Overview

```
User → React App → Context API → Services → Alchemy API → Blockchain
```

### Data Flow

1. **User connects wallet** → `WalletContext` manages connection
2. **User selects network** → `TransactionContext` triggers fetch
3. **Service fetches data** → `rpcService.ts` calls Alchemy API
4. **Data is processed** → Transactions are formatted and cached
5. **UI updates** → Components display the transactions

### Key Components Explained

#### WalletContext
- Manages wallet connection state
- Handles MetaMask interactions
- Listens for account/network changes
- Provides wallet info to components

#### TransactionContext
- Manages transaction data
- Handles loading and error states
- Coordinates data fetching
- Caches results to reduce API calls

#### rpcService
- Fetches transactions from Alchemy API
- Uses `alchemy_getAssetTransfers` method
- Falls back to demo data if no transactions found
- Implements caching and error handling

### Caching Strategy

- **Cache Duration**: 1 minute
- **Cache Key**: `{walletAddress}-{chainId}`
- **Purpose**: Reduces API calls and improves performance
- **Invalidation**: Automatically expires after 1 minute

### Demo Data System

If your wallet has no transactions:
- The system automatically loads demo transactions
- Demo data shows all transaction types (sent/received)
- All statuses are shown (confirmed/pending/failed)
- A "DEMO DATA" badge indicates demo mode

---

## 🛠️ Tech Stack

### Core Technologies

- **React 18.2**: Modern UI library
- **TypeScript 5.2**: Type-safe JavaScript
- **Vite 5.0**: Fast build tool and dev server
- **Tailwind CSS 3.3**: Utility-first CSS framework

### Blockchain Libraries

- **ethers.js 6.9**: Ethereum library for wallet interactions

### Development Tools

- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

### Why These Choices?

- **React**: Industry standard, great ecosystem
- **TypeScript**: Catches errors early, better IDE support
- **Tailwind CSS**: Fast development, consistent design
- **Vite**: Lightning-fast development experience
- **ethers.js**: Most popular Ethereum library

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "MetaMask is not installed"
**Solution**: Install MetaMask browser extension from [metamask.io](https://metamask.io/)

#### 2. "API key not configured"
**Solution**: 
- Create a `.env` file in the root directory
- Add your Alchemy API keys
- Restart the development server

#### 3. "Rate limit exceeded"
**Solution**: 
- Wait a few minutes before trying again
- Free Alchemy tier has rate limits
- Consider upgrading to a paid plan for higher limits

#### 4. "CORS error"
**Solution**: 
- Verify your API key is correct
- Make sure you're using the right network (mainnet vs testnet)
- Check that your API key has the correct permissions

#### 5. "No transactions found"
**Solution**: 
- This is normal if your wallet has no activity
- Demo transactions will be shown automatically
- Try switching to a different network

#### 6. "Failed to fetch"
**Solution**: 
- Check your internet connection
- Verify API keys are correct
- Check browser console for detailed error messages

### Debug Mode

To see detailed logs:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages starting with `[RPC Service]` or `[TransactionContext]`

### Getting Help

1. Check the browser console for error messages
2. Verify all prerequisites are installed
3. Ensure API keys are correctly configured
4. Try disconnecting and reconnecting your wallet

---

## 🚀 Building for Production

### Build the Project

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy

You can deploy the `dist/` folder to any static hosting service:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Follow GitHub Pages deployment guide

---

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Alchemy**: For providing excellent blockchain APIs
- **MetaMask**: For wallet integration
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the browser console for error messages
3. Ensure all prerequisites are properly installed
4. Verify API keys are correctly configured

---

## 🎯 Future Enhancements

Planned features:
- [ ] Support for more blockchain networks (Optimism, Base, etc.)
- [ ] ERC-20 token transaction support
- [ ] Transaction filtering and search
- [ ] Export transaction history (CSV/JSON)
- [ ] Real-time transaction updates via WebSocket
- [ ] Gas fee display
- [ ] Transaction pagination (load more than 10)
- [ ] Unit and integration tests

---

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

---

*Last updated: 2025*
