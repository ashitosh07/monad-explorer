import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

function getProvider() {
  if (!process.env.MONAD_RPC_URL) {
    throw new Error('MONAD_RPC_URL environment variable is required');
  }
  return new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
}

export async function GET(request, { params }) {
  try {
    const blockNumber = parseInt(params.number);
    const provider = getProvider();
    const block = await provider.getBlock(blockNumber, true);
    
    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      nonce: block.nonce,
      difficulty: block.difficulty?.toString() || '0',
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString(),
      miner: block.miner || 'Unknown',
      extraData: block.extraData,
      transactions: block.transactions.map(tx => ({
        hash: typeof tx === 'string' ? tx : tx.hash,
        from: typeof tx === 'object' ? tx.from : null,
        to: typeof tx === 'object' ? tx.to : null,
        value: typeof tx === 'object' ? ethers.formatEther(tx.value || 0) : null
      })),
      transactionCount: block.transactions.length,
      size: block.transactions.length * 100 // Approximate
    });
  } catch (error) {
    return NextResponse.json({ error: 'Block not found' }, { status: 404 });
  }
}