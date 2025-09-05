export async function GET(request, { params }) {
  const { hash } = params;
  
  const transactionData = {
    hash,
    blockNumber: Math.floor(Math.random() * 1000000) + 500000,
    blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    transactionIndex: Math.floor(Math.random() * 200),
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
    value: (Math.random() * 10).toFixed(4),
    gasPrice: Math.floor(Math.random() * 100) + 20,
    gasLimit: 21000,
    gasUsed: Math.floor(Math.random() * 21000) + 15000,
    nonce: Math.floor(Math.random() * 1000),
    timestamp: Date.now() - Math.random() * 86400000,
    status: Math.random() > 0.1 ? 'success' : 'failed',
    confirmations: Math.floor(Math.random() * 100) + 10,
    logs: []
  };

  return Response.json(transactionData);
}