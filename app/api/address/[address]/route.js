export async function GET(request, { params }) {
  const { address } = params;
  
  const addressData = {
    address,
    balance: (Math.random() * 1000).toFixed(4),
    transactionCount: Math.floor(Math.random() * 10000) + 100,
    firstSeen: Date.now() - Math.random() * 31536000000,
    lastSeen: Date.now() - Math.random() * 86400000,
    isContract: Math.random() > 0.7,
    label: Math.random() > 0.8 ? ['Exchange', 'DeFi', 'Whale'][Math.floor(Math.random() * 3)] : null,
    riskScore: Math.floor(Math.random() * 100),
    tokens: Array.from({ length: 5 }, () => ({
      symbol: ['MONAD', 'USDC', 'WETH', 'DAI'][Math.floor(Math.random() * 4)],
      balance: (Math.random() * 10000).toFixed(2),
      value: (Math.random() * 50000).toFixed(2)
    })),
    transactions: Array.from({ length: 20 }, () => ({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: Date.now() - Math.random() * 86400000,
      value: (Math.random() * 10).toFixed(4),
      status: Math.random() > 0.1 ? 'success' : 'failed'
    }))
  };

  return Response.json(addressData);
}