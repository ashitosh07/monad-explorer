import { NextResponse } from 'next/server';

export async function GET() {
  // Monad testnet NFT collections
  const monadNFTs = [
    {
      name: 'Monad Genesis',
      address: '0x1000000000000000000000000000000000000001',
      floorPrice: '0.01',
      volume24h: (Math.random() * 10).toFixed(3),
      sales24h: Math.floor(Math.random() * 20 + 1),
      owners: Math.floor(Math.random() * 500 + 100),
      totalSupply: 1000,
      change24h: ((Math.random() - 0.5) * 30).toFixed(2),
      marketCap: (10).toFixed(0)
    },
    {
      name: 'Monad Validators',
      address: '0x1000000000000000000000000000000000000002',
      floorPrice: '0.005',
      volume24h: (Math.random() * 5).toFixed(3),
      sales24h: Math.floor(Math.random() * 15 + 1),
      owners: Math.floor(Math.random() * 300 + 50),
      totalSupply: 500,
      change24h: ((Math.random() - 0.5) * 25).toFixed(2),
      marketCap: (2.5).toFixed(0)
    },
    {
      name: 'Monad Testnet Heroes',
      address: '0x1000000000000000000000000000000000000003',
      floorPrice: '0.002',
      volume24h: (Math.random() * 3).toFixed(3),
      sales24h: Math.floor(Math.random() * 10 + 1),
      owners: Math.floor(Math.random() * 200 + 30),
      totalSupply: 2000,
      change24h: ((Math.random() - 0.5) * 20).toFixed(2),
      marketCap: (4).toFixed(0)
    },
    {
      name: 'Monad Builders',
      address: '0x1000000000000000000000000000000000000004',
      floorPrice: '0.008',
      volume24h: (Math.random() * 8).toFixed(3),
      sales24h: Math.floor(Math.random() * 12 + 1),
      owners: Math.floor(Math.random() * 150 + 25),
      totalSupply: 300,
      change24h: ((Math.random() - 0.5) * 35).toFixed(2),
      marketCap: (2.4).toFixed(0)
    }
  ];
  
  return NextResponse.json(monadNFTs);
}