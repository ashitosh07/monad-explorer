export async function GET() {
  const blocks = Array.from({ length: 10 }, (_, i) => ({
    number: 1000000 - i,
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    timestamp: Date.now() - i * 12000,
    transactions: Math.floor(Math.random() * 200) + 50,
    gasUsed: Math.floor(Math.random() * 30000000) + 10000000,
    gasLimit: 30000000,
    miner: `0x${Math.random().toString(16).substr(2, 40)}`,
    size: Math.floor(Math.random() * 50000) + 20000
  }));

  return Response.json({ blocks });
}