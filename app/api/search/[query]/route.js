import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);

export async function GET(request, { params }) {
  try {
    const { query } = params;
    
    // Check if it's a block number
    if (/^\d+$/.test(query)) {
      const block = await provider.getBlock(parseInt(query));
      if (block) {
        return NextResponse.json({ 
          type: 'block', 
          data: {
            number: block.number,
            hash: block.hash,
            timestamp: block.timestamp,
            txCount: block.transactions.length,
            gasUsed: block.gasUsed.toString(),
            gasLimit: block.gasLimit.toString(),
            miner: block.miner || 'Unknown'
          }
        });
      }
    }
    
    // Check if it's a transaction hash
    if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
      const tx = await provider.getTransaction(query);
      if (tx) {
        const receipt = await provider.getTransactionReceipt(query);
        return NextResponse.json({ 
          type: 'transaction', 
          data: {
            hash: tx.hash,
            blockNumber: tx.blockNumber,
            from: tx.from,
            to: tx.to,
            value: ethers.formatEther(tx.value || 0),
            gasLimit: tx.gasLimit.toString(),
            gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : '0',
            status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending'
          }
        });
      }
    }
    
    // Check if it's an address
    if (/^0x[a-fA-F0-9]{40}$/.test(query)) {
      const [balance, txCount, code] = await Promise.all([
        provider.getBalance(query),
        provider.getTransactionCount(query),
        provider.getCode(query)
      ]);
      
      return NextResponse.json({ 
        type: 'address', 
        data: {
          address: query,
          balance: ethers.formatEther(balance),
          transactionCount: txCount,
          isContract: code !== '0x'
        }
      });
    }
    
    return NextResponse.json({ type: 'unknown', data: null }, { status: 404 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed', details: error.message }, { status: 500 });
  }
}