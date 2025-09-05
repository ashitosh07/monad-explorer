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
    const { hash } = params;
    const provider = getProvider();
    
    const [tx, receipt] = await Promise.all([
      provider.getTransaction(hash),
      provider.getTransactionReceipt(hash)
    ]);
    
    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      transaction: {
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        transactionIndex: tx.index,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value || 0),
        gasLimit: tx.gasLimit.toString(),
        gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : '0',
        data: tx.data,
        nonce: tx.nonce,
        type: tx.type
      },
      receipt: receipt ? {
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice ? ethers.formatUnits(receipt.effectiveGasPrice, 'gwei') : '0',
        logs: receipt.logs.length,
        contractAddress: receipt.contractAddress
      } : null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }
}