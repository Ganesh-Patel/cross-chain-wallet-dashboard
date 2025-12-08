# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Alchemy API Keys (Free)
1. Go to [alchemy.com](https://www.alchemy.com)
2. Sign up for a free account
3. Create apps for Ethereum, Polygon, and Arbitrum
4. Copy your API keys

### Step 3: Configure API Keys

**Option A: Environment Variables (Recommended)**
Create a `.env` file:
```env
VITE_ALCHEMY_ETH_API_KEY=your_key_here
VITE_ALCHEMY_POLYGON_API_KEY=your_key_here
VITE_ALCHEMY_ARBITRUM_API_KEY=your_key_here
```

**Option B: Direct Configuration**
Edit `src/constants/chains.ts` and replace `YOUR_API_KEY` with your actual keys.

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Navigate to `http://localhost:5173`

### Step 6: Connect Wallet
1. Make sure MetaMask is installed
2. Click "Connect Wallet"
3. Approve the connection in MetaMask
4. Select a blockchain network
5. View your transactions!

## 🐛 Troubleshooting

**"MetaMask is not installed"**
- Install the [MetaMask extension](https://metamask.io)

**"Failed to fetch transactions"**
- Check your API keys are correct
- Verify your wallet has transaction history on the selected network
- Check browser console for detailed error messages

**"Rate limit exceeded"**
- Wait a few moments and try again
- The app includes automatic retry with exponential backoff

**Transactions not showing**
- Make sure you have transactions on the selected network
- Try switching to a different network
- Check that your wallet address is correct

## 📝 Notes

- The app caches transaction data for 1 minute to reduce API calls
- Free Alchemy tier has rate limits (but sufficient for development)
- Transaction fetching may take a few seconds on first load

