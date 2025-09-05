export async function GET(request, { params }) {
  const { query } = params;
  
  let result = { type: 'unknown', data: null };
  
  if (/^\d+$/.test(query)) {
    result = {
      type: 'block',
      data: {
        number: parseInt(query),
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: Date.now() - Math.random() * 86400000,
        transactions: Math.floor(Math.random() * 200) + 50
      }
    };
  } else if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
    result = {
      type: 'transaction',
      data: {
        hash: query,
        blockNumber: Math.floor(Math.random() * 1000000) + 500000,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        value: (Math.random() * 10).toFixed(4),
        status: Math.random() > 0.1 ? 'success' : 'failed'
      }
    };
  } else if (/^0x[a-fA-F0-9]{40}$/.test(query)) {
    result = {
      type: 'address',
      data: {
        address: query,
        balance: (Math.random() * 1000).toFixed(4),
        transactionCount: Math.floor(Math.random() * 10000) + 100,
        isContract: Math.random() > 0.7
      }
    };
  }

  return Response.json(result);
}