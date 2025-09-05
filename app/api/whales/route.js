import { NextResponse } from 'next/server';

export async function GET() {
  const whaleAlerts = Array.from({length: 50}, () => ({
    txHash: '0x' + Math.random().toString(16).substr(2, 64),
    from: '0x' + Math.random().toString(16).substr(2, 40),
    to: '0x' + Math.random().toString(16).substr(2, 40),
    amount: (Math.random() * 10000 + 1000).toFixed(2),
    amountUSD: (Math.random() * 1000000 + 100000).toFixed(0),
    token: ['ETH', 'USDC', 'USDT', 'WETH'][Math.floor(Math.random() * 4)],
    timestamp: Date.now() - Math.floor(Math.random() * 86400000),
    type: ['Transfer', 'Swap', 'Deposit', 'Withdrawal'][Math.floor(Math.random() * 4)]
  }));
  
  return NextResponse.json(whaleAlerts.sort((a, b) => b.timestamp - a.timestamp));
}