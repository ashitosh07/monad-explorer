import { NextResponse } from 'next/server';

export async function GET() {
  const mevData = {
    totalExtracted24h: (Math.random() * 1000000).toFixed(2),
    topBots: Array.from({length: 10}, () => ({
      address: '0x' + Math.random().toString(16).substr(2, 40),
      extracted24h: (Math.random() * 100000).toFixed(2),
      transactions: Math.floor(Math.random() * 1000 + 100),
      successRate: (Math.random() * 30 + 70).toFixed(1),
      strategy: ['Arbitrage', 'Sandwich', 'Liquidation', 'Front-running'][Math.floor(Math.random() * 4)]
    })),
    recentMEV: Array.from({length: 20}, () => ({
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      block: Math.floor(Math.random() * 1000000 + 2000000),
      profit: (Math.random() * 10000).toFixed(2),
      type: ['Arbitrage', 'Sandwich', 'Liquidation'][Math.floor(Math.random() * 3)],
      timestamp: Date.now() - Math.floor(Math.random() * 86400000)
    }))
  };
  
  return NextResponse.json(mevData);
}