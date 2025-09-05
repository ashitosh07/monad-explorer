import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

function getProvider() {
  if (!process.env.MONAD_RPC_URL) {
    throw new Error('MONAD_RPC_URL environment variable is required');
  }
  return new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
}

export async function GET() {
  try {
    const provider = getProvider();
    const latestBlockNumber = await provider.getBlockNumber();
    const blocks = [];
    
    for (let i = 0; i < 10; i++) {
      const blockNumber = latestBlockNumber - i;
      if (blockNumber < 0) break;
      
      const block = await provider.getBlock(blockNumber, false);
      if (block) {
        blocks.push({
          number: block.number,
          timestamp: block.timestamp,
          txCount: block.transactions.length
        });
      }
    }
    
    const totalTx = blocks.reduce((sum, b) => sum + b.txCount, 0);
    const timeSpan = blocks.length >= 2 ? blocks[0].timestamp - blocks[blocks.length - 1].timestamp : 1;
    const avgBlockTime = blocks.length >= 2 ? timeSpan / (blocks.length - 1) : 0;
    
    return NextResponse.json({
      networkStats: {
        totalBlocks: latestBlockNumber,
        totalTransactions: totalTx,
        avgBlockTime: avgBlockTime,
        networkHashrate: 0
      },
      mempool: {
        pending: Math.floor(Math.random() * 1000),
        queued: Math.floor(Math.random() * 500)
      },
      priceData: {
        price: (Math.random() * 100 + 50).toFixed(2),
        change24h: (Math.random() * 20 - 10).toFixed(2),
        volume24h: (Math.random() * 1000000).toFixed(0),
        marketCap: (Math.random() * 1000000000).toFixed(0)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch network data' }, { status: 500 });
  }
}