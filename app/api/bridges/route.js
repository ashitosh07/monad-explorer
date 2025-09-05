import { NextResponse } from 'next/server';

export async function GET() {
  const bridges = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche'];
  const bridgeData = bridges.map(name => ({
    name,
    volume24h: (Math.random() * 100000000).toFixed(0),
    transactions24h: Math.floor(Math.random() * 10000 + 1000),
    avgTime: Math.floor(Math.random() * 600 + 60),
    fee: (Math.random() * 50 + 5).toFixed(2),
    status: Math.random() > 0.1 ? 'active' : 'maintenance'
  }));
  
  return NextResponse.json(bridgeData);
}