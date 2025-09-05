import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL || 'https://monad-testnet.g.alchemy.com/v2/ZU7w78sprwo0q1b1eNaj2');

async function fetchLatestBlocks() {
  try {
    const latestBlockNumber = await provider.getBlockNumber();
    const blocks = [];
    
    for (let i = 0; i < 20; i++) {
      const blockNumber = latestBlockNumber - i;
      if (blockNumber < 0) break;
      
      const block = await provider.getBlock(blockNumber, false);
      if (block) {
        blocks.push({
          number: block.number,
          hash: block.hash,
          timestamp: block.timestamp,
          txCount: block.transactions.length,
          gasUsed: block.gasUsed.toString(),
          gasLimit: block.gasLimit.toString(),
          baseFeePerGas: block.baseFeePerGas?.toString() || '0',
          difficulty: block.difficulty?.toString() || '0',
          miner: block.miner || 'Unknown'
        });
      }
    }
    
    return blocks;
  } catch (error) {
    console.error('Error fetching blocks:', error.message);
    return [];
  }
}

function calculateMetrics(blocks) {
  if (blocks.length === 0) return { tps: 0, avgBlockTime: 0, totalTx: 0 };
  
  const totalTx = blocks.reduce((sum, b) => sum + b.txCount, 0);
  const timeSpan = blocks[0].timestamp - blocks[blocks.length - 1].timestamp;
  const tps = timeSpan > 0 ? (totalTx / timeSpan).toFixed(2) : 0;
  
  let avgBlockTime = 0;
  if (blocks.length >= 2) {
    const timeDiffs = [];
    for (let i = 0; i < blocks.length - 1; i++) {
      timeDiffs.push(blocks[i].timestamp - blocks[i + 1].timestamp);
    }
    avgBlockTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
  }
  
  return { tps, avgBlockTime, totalTx };
}

function generateMockWalletData() {
  const wallets = [];
  for (let i = 0; i < 10; i++) {
    const address = '0x' + Math.random().toString(16).substr(2, 40);
    const count = Math.floor(Math.random() * 100) + 10;
    const volume = (Math.random() * 1000).toFixed(4);
    const lastSeen = Date.now() - Math.floor(Math.random() * 86400000);
    
    wallets.push({ address, count, volume, lastSeen });
  }
  
  return wallets.sort((a, b) => b.count - a.count);
}

export async function GET() {
  try {
    const blocks = await fetchLatestBlocks();
    const metrics = calculateMetrics(blocks);
    const topWallets = generateMockWalletData();
    
    const priceData = {
      price: (Math.random() * 100 + 50).toFixed(2),
      change24h: (Math.random() * 20 - 10).toFixed(2),
      volume24h: (Math.random() * 1000000).toFixed(0),
      marketCap: (Math.random() * 1000000000).toFixed(0)
    };
    
    const mempool = {
      pending: Math.floor(Math.random() * 1000),
      queued: Math.floor(Math.random() * 500)
    };
    
    const latestBlock = blocks[0] || {};
    
    return NextResponse.json({
      latestBlocks: blocks,
      tps: metrics.tps,
      gasUsage: latestBlock.gasUsed || '0',
      avgFee: latestBlock.baseFeePerGas ? ethers.formatEther(BigInt(latestBlock.gasUsed || 0) * BigInt(latestBlock.baseFeePerGas)) : '0',
      topWallets,
      networkStats: {
        totalBlocks: blocks.length,
        totalTransactions: metrics.totalTx,
        avgBlockTime: metrics.avgBlockTime,
        networkHashrate: 0
      },
      priceData,
      mempool
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}