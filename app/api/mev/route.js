import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalExtracted24h: '0',
    topBots: [],
    recentMEV: []
  });
}