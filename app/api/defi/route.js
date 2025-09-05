import { NextResponse } from 'next/server';

export async function GET() {
  // Monad testnet DeFi ecosystem
  const monadProtocols = [
    {
      name: 'MonadSwap',
      tvl: (Math.random() * 1000000 + 100000).toFixed(0),
      volume24h: (Math.random() * 100000 + 10000).toFixed(0),
      users24h: Math.floor(Math.random() * 500 + 50),
      apy: (Math.random() * 15 + 5).toFixed(2),
      category: 'DEX',
      risk: 'Medium'
    },
    {
      name: 'MonadLend',
      tvl: (Math.random() * 500000 + 50000).toFixed(0),
      volume24h: (Math.random() * 50000 + 5000).toFixed(0),
      users24h: Math.floor(Math.random() * 200 + 20),
      apy: (Math.random() * 10 + 3).toFixed(2),
      category: 'Lending',
      risk: 'Low'
    },
    {
      name: 'MonadStake',
      tvl: (Math.random() * 2000000 + 200000).toFixed(0),
      volume24h: (Math.random() * 80000 + 8000).toFixed(0),
      users24h: Math.floor(Math.random() * 300 + 30),
      apy: (Math.random() * 8 + 4).toFixed(2),
      category: 'Staking',
      risk: 'Low'
    },
    {
      name: 'MonadYield',
      tvl: (Math.random() * 300000 + 30000).toFixed(0),
      volume24h: (Math.random() * 30000 + 3000).toFixed(0),
      users24h: Math.floor(Math.random() * 150 + 15),
      apy: (Math.random() * 20 + 8).toFixed(2),
      category: 'Yield',
      risk: 'High'
    }
  ];
  
  const totalTVL = monadProtocols.reduce((sum, p) => sum + parseFloat(p.tvl), 0).toFixed(0);
  const totalVolume24h = monadProtocols.reduce((sum, p) => sum + parseFloat(p.volume24h), 0).toFixed(0);
  
  return NextResponse.json({
    protocols: monadProtocols,
    totalTVL,
    totalVolume24h
  });
}