export async function GET(request, { params }) {
  const { number } = params;
  
  const blockData = {
    number: parseInt(number),
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    parentHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    timestamp: Date.now() - Math.random() * 86400000,
    miner: `0x${Math.random().toString(16).substr(2, 40)}`,
    gasUsed: Math.floor(Math.random() * 30000000) + 10000000,
    gasLimit: 30000000,
    baseFeePerGas: Math.floor(Math.random() * 50) + 20,
    size: Math.floor(Math.random() * 50000) + 20000,
    transactionCount: Math.floor(Math.random() * 200) + 50,
    transactions: Array.from({ length: 10 }, () => ({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 10).toFixed(4),
      gasPrice: Math.floor(Math.random() * 100) + 20,
      status: Math.random() > 0.1 ? 'success' : 'failed'
    }))
  };

  return Response.json(blockData);
}