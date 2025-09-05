import { NextResponse } from 'next/server';

import { ethers } from 'ethers';

function getProvider() {
  if (!process.env.MONAD_RPC_URL) {
    throw new Error('MONAD_RPC_URL environment variable is required');
  }
  return new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
}

export async function GET() {
  try {
    const provider = getProvider();
    const feeData = await provider.getFeeData();
    
    // Get current gas prices from latest blocks
    const latestBlockNumber = await provider.getBlockNumber();
    const gasHistory = [];
    
    // Fetch last 24 blocks for gas history
    for (let i = 0; i < 24; i++) {
      const blockNumber = latestBlockNumber - i;
      if (blockNumber < 0) break;
      
      const block = await provider.getBlock(blockNumber);
      if (block && block.baseFeePerGas) {
        gasHistory.push({
          hour: 23 - i,
          slow: Math.floor(parseFloat(ethers.formatUnits(block.baseFeePerGas, 'gwei')) * 0.9),
          standard: Math.floor(parseFloat(ethers.formatUnits(block.baseFeePerGas, 'gwei'))),
          fast: Math.floor(parseFloat(ethers.formatUnits(block.baseFeePerGas, 'gwei')) * 1.2),
          timestamp: block.timestamp * 1000
        });
      }
    }
    
    const currentBaseFee = feeData.gasPrice ? parseFloat(ethers.formatUnits(feeData.gasPrice, 'gwei')) : 20;
    
    return NextResponse.json({
      current: {
        slow: Math.floor(currentBaseFee * 0.9),
        standard: Math.floor(currentBaseFee),
        fast: Math.floor(currentBaseFee * 1.2),
        baseFee: currentBaseFee.toFixed(2)
      },
      history: gasHistory.reverse(),
      recommendations: {
        transfer: 'standard',
        swap: 'fast',
        mint: 'standard'
      }
    });
  } catch (error) {
    console.error('Gas data fetch error:', error);
    return NextResponse.json({
      current: { slow: 0, standard: 0, fast: 0, baseFee: '0' },
      history: [],
      recommendations: { transfer: 'standard', swap: 'fast', mint: 'standard' }
    });
  }
}