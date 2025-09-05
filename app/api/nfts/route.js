import { NextResponse } from 'next/server';

export async function GET() {
  const collections = ['CryptoPunks', 'BAYC', 'Azuki', 'Doodles', 'CloneX', 'Moonbirds', 'MAYC', 'Cool Cats'];
  const nftData = collections.map((name) => ({
    name,
    address: '0x' + Math.random().toString(16).substr(2, 40),
    floorPrice: (Math.random() * 100 + 1).toFixed(2),
    volume24h: (Math.random() * 1000).toFixed(2),
    sales24h: Math.floor(Math.random() * 100 + 1),
    owners: Math.floor(Math.random() * 5000 + 1000),
    totalSupply: Math.floor(Math.random() * 10000 + 1000),
    change24h: (Math.random() * 50 - 25).toFixed(2),
    marketCap: (Math.random() * 100000000).toFixed(0)
  }));
  
  return NextResponse.json(nftData);
}