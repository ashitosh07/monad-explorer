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
    const { address } = params;
    const provider = getProvider();
    
    const [balance, txCount, code, tokensRes, activityRes] = await Promise.all([
      provider.getBalance(address),
      provider.getTransactionCount(address),
      provider.getCode(address),
      fetch(`https://api.blockvision.org/v1/account/${address}/tokens`, {
        headers: { 'X-API-KEY': process.env.BLOCKVISION_API_KEY || '32I7NHH5XeN6h9WMCgclY0KDgJY', 'Content-Type': 'application/json' }
      }).catch(() => null),
      fetch(`https://api.blockvision.org/v1/account/${address}/txns`, {
        headers: { 'X-API-KEY': process.env.BLOCKVISION_API_KEY || '32I7NHH5XeN6h9WMCgclY0KDgJY', 'Content-Type': 'application/json' }
      }).catch(() => null)
    ]);
    
    const tokens = tokensRes?.ok ? (await tokensRes.json()).data || [] : [];
    const transactions = activityRes?.ok ? (await activityRes.json()).data || [] : [];
    
    // Generate mock activity data since we can't easily fetch transaction history
    const activityData = {
      recentTransactions: Array.from({length: 20}, (_, i) => ({
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000 + 2000000),
        timestamp: Date.now() - Math.floor(Math.random() * 2592000000),
        from: Math.random() > 0.5 ? address : '0x' + Math.random().toString(16).substr(2, 40),
        to: Math.random() > 0.5 ? address : '0x' + Math.random().toString(16).substr(2, 40),
        value: (Math.random() * 10).toFixed(6),
        gasUsed: Math.floor(Math.random() * 100000 + 21000),
        gasPrice: (Math.random() * 50 + 10).toFixed(2),
        status: Math.random() > 0.05 ? 'success' : 'failed',
        type: ['transfer', 'contract_call', 'token_transfer'][Math.floor(Math.random() * 3)]
      })),
      totalVolume: (Math.random() * 10000).toFixed(2),
      avgGasPrice: (Math.random() * 50 + 20).toFixed(2),
      successRate: (Math.random() * 20 + 80).toFixed(1)
    };
    
    const tokenBalances = Math.random() > 0.5 ? ['USDC', 'USDT', 'WETH'].map(symbol => ({
      symbol,
      name: `${symbol} Token`,
      address: '0x' + Math.random().toString(16).substr(2, 40),
      balance: (Math.random() * 10000).toFixed(2),
      balanceUSD: (Math.random() * 50000).toFixed(2),
      price: (Math.random() * 100 + 1).toFixed(2),
      change24h: (Math.random() * 20 - 10).toFixed(2)
    })) : [];
    
    const riskScore = {
      score: Math.floor(Math.random() * 100),
      level: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
      factors: ['Regular transaction patterns', 'Interacts with known protocols'].filter(() => Math.random() > 0.5)
    };
    
    return NextResponse.json({
      address,
      balance: ethers.formatEther(balance),
      balanceUSD: (parseFloat(ethers.formatEther(balance)) * 0.001).toFixed(6), // Testnet price
      transactionCount: txCount,
      isContract: code !== '0x',
      contractType: code !== '0x' ? 'Smart Contract' : 'EOA',
      tokens: tokens.slice(0, 10), // Top 10 tokens
      recentTransactions: transactions.slice(0, 20), // Recent 20 transactions
      totalTokens: tokens.length,
      riskScore: {
        score: Math.min(txCount * 2, 100),
        level: txCount > 100 ? 'High' : txCount > 10 ? 'Medium' : 'Low',
        factors: ['Transaction frequency based assessment']
      },
      labels: txCount > 1000 ? ['High Activity'] : txCount > 100 ? ['Active'] : ['New']
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid address or fetch failed' }, { status: 400 });
  }
}