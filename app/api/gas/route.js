import { NextResponse } from 'next/server';

export async function GET() {
  const gasHistory = [];
  
  for (let i = 0; i < 24; i++) {
    gasHistory.push({
      hour: i,
      slow: Math.floor(Math.random() * 20 + 10),
      standard: Math.floor(Math.random() * 30 + 20),
      fast: Math.floor(Math.random() * 50 + 40),
      timestamp: Date.now() - (23 - i) * 3600000
    });
  }
  
  return NextResponse.json({
    current: {
      slow: Math.floor(Math.random() * 20 + 10),
      standard: Math.floor(Math.random() * 30 + 20),
      fast: Math.floor(Math.random() * 50 + 40),
      baseFee: '20'
    },
    history: gasHistory,
    recommendations: {
      transfer: 'standard',
      swap: 'fast',
      mint: 'standard'
    }
  });
}