# 🚀 Monad Explorer - Quick Setup

## How to Run Locally

1. **Install Dependencies**
```bash
cd monad-explorer
npm install
```

2. **Set Environment Variable**
Create `.env.local` file:
```bash
MONAD_RPC_URL=https://monad-testnet.g.alchemy.com/v2/YOUR_API_KEY
```
**⚠️ Important:** Replace `YOUR_API_KEY` with your actual Alchemy API key

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Browser**
Visit: `http://localhost:3000`

## Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variable: `MONAD_RPC_URL`
- Deploy automatically

## Features Available
- ✅ Overview - Network stats and latest blocks
- ✅ Network - Network health and mempool
- ✅ Analytics - Gas trends and wallet analysis  
- ✅ DeFi - Protocol analytics and TVL
- ✅ NFTs - Collection tracking
- ✅ MEV - Bot tracking and profits
- ✅ Validators - Stake and performance
- ✅ Rich List - Top addresses by balance
- ✅ Bridges - Cross-chain analytics
- ✅ Whales - Large transaction alerts
- ✅ Tokens - Token prices and metrics

All data is fetched from real APIs - no dummy data!