import { NextResponse } from 'next/server';

export async function GET() {
  const tokens = ['USDC', 'USDT', 'WETH', 'DAI', 'LINK'].map(name => ({
    name,
    symbol: name,
    address: '0x' + Math.random().toString(16).substr(2, 40),
    price: (Math.random() * 1000 + 1).toFixed(2),
    change24h: (Math.random() * 20 - 10).toFixed(2),
    volume24h: (Math.random() * 10000000).toFixed(0),
    holders: Math.floor(Math.random() * 100000 + 1000)
  }));
  return NextResponse.json(tokens);
}