import { NextResponse } from 'next/server';

export async function GET() {
  const richList = [];
  for (let i = 0; i < 50; i++) {
    richList.push({
      rank: i + 1,
      address: '0x' + Math.random().toString(16).substr(2, 40),
      balance: (Math.random() * 1000000 + 10000).toFixed(2),
      percentage: (Math.random() * 5 + 0.1).toFixed(3)
    });
  }
  return NextResponse.json(richList.sort((a, b) => b.balance - a.balance));
}