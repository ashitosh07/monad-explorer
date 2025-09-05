import { NextResponse } from 'next/server';

export async function GET() {
  const validators = [];
  for (let i = 0; i < 20; i++) {
    validators.push({
      address: '0x' + Math.random().toString(16).substr(2, 40),
      stake: (Math.random() * 10000 + 1000).toFixed(2),
      uptime: (Math.random() * 10 + 90).toFixed(1),
      blocks: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.1 ? 'active' : 'inactive'
    });
  }
  return NextResponse.json(validators.sort((a, b) => b.stake - a.stake));
}