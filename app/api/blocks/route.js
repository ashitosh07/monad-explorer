import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    const latestBlockNumber = await provider.getBlockNumber();
    const blocks = [];
    
    for (let i = 0; i < limit; i++) {
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
    
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}