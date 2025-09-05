import { NextResponse } from 'next/server';

export async function GET() {
  const protocols = ['Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve', 'SushiSwap', 'Balancer', '1inch'];
  const defiData = protocols.map(name => ({
    name,
    tvl: (Math.random() * 10000000000 + 1000000000).toFixed(0),
    volume24h: (Math.random() * 1000000000).toFixed(0),
    users24h: Math.floor(Math.random() * 50000 + 1000),
    apy: (Math.random() * 25 + 1).toFixed(2),
    category: ['DEX', 'Lending', 'Yield', 'Derivatives'][Math.floor(Math.random() * 4)],
    risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
  }));
  
  return NextResponse.json({
    protocols: defiData,
    totalTVL: defiData.reduce((sum, p) => sum + parseFloat(p.tvl), 0).toFixed(0),
    totalVolume24h: defiData.reduce((sum, p) => sum + parseFloat(p.volume24h), 0).toFixed(0)
  });
}