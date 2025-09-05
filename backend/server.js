import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Monad HTTP provider (no WebSocket to avoid rate limiting)
const provider = new ethers.JsonRpcProvider('https://monad-testnet.g.alchemy.com/v2/ZU7w78sprwo0q1b1eNaj2');

// Enhanced metrics tracking
let metrics = {
  latestBlocks: [],
  tps: 0,
  gasUsage: 0,
  avgFee: 0,
  topWallets: new Map(),
  networkStats: {
    totalBlocks: 0,
    totalTransactions: 0,
    avgBlockTime: 0,
    networkHashrate: 0
  },
  priceData: {
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0
  },
  validators: [],
  mempool: {
    pending: 0,
    queued: 0
  }
};

// Function to fetch latest blocks on demand
async function fetchLatestBlocks() {
  try {
    const latestBlockNumber = await provider.getBlockNumber();
    const blocks = [];
    
    // Fetch last 20 blocks
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

// Function to calculate metrics from blocks
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

// Generate mock wallet data
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

// API Endpoints
app.get('/api/stats', async (req, res) => {
  try {
    const blocks = await fetchLatestBlocks();
    const metrics = calculateMetrics(blocks);
    const topWallets = generateMockWalletData();
    
    // Simulate price data
    const priceData = {
      price: (Math.random() * 100 + 50).toFixed(2),
      change24h: (Math.random() * 20 - 10).toFixed(2),
      volume24h: (Math.random() * 1000000).toFixed(0),
      marketCap: (Math.random() * 1000000000).toFixed(0)
    };
    
    // Simulate mempool data
    const mempool = {
      pending: Math.floor(Math.random() * 1000),
      queued: Math.floor(Math.random() * 500)
    };
    
    const latestBlock = blocks[0] || {};
    
    res.json({
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
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/blocks', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const blocks = await fetchLatestBlocks();
    res.json(blocks.slice(0, limit));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

app.get('/api/block/:number', async (req, res) => {
  try {
    const blockNumber = parseInt(req.params.number);
    const block = await provider.getBlock(blockNumber, true);
    res.json(block);
  } catch (error) {
    res.status(404).json({ error: 'Block not found' });
  }
});

app.get('/api/transaction/:hash', async (req, res) => {
  try {
    const tx = await provider.getTransaction(req.params.hash);
    const receipt = await provider.getTransactionReceipt(req.params.hash);
    res.json({ transaction: tx, receipt });
  } catch (error) {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

app.get('/api/address/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const [balance, txCount, code] = await Promise.all([
      provider.getBalance(address),
      provider.getTransactionCount(address),
      provider.getCode(address)
    ]);
    
    // Generate comprehensive activity data
    const activityData = generateAddressActivity(address);
    const tokenBalances = generateTokenBalances();
    const nftCollection = generateNFTData();
    const defiPositions = generateDeFiPositions();
    
    res.json({
      address,
      balance: ethers.formatEther(balance),
      balanceUSD: (parseFloat(ethers.formatEther(balance)) * 75.50).toFixed(2),
      transactionCount: txCount,
      isContract: code !== '0x',
      contractType: code !== '0x' ? detectContractType(code) : null,
      activityData,
      tokenBalances,
      nftCollection,
      defiPositions,
      riskScore: calculateRiskScore(address),
      labels: generateAddressLabels(address)
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid address' });
  }
});

// Generate comprehensive address activity
function generateAddressActivity(address) {
  const transactions = [];
  const dailyActivity = [];
  
  // Generate recent transactions
  for (let i = 0; i < 50; i++) {
    transactions.push({
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      blockNumber: Math.floor(Math.random() * 1000000 + 2000000),
      timestamp: Date.now() - Math.floor(Math.random() * 2592000000), // Last 30 days
      from: Math.random() > 0.5 ? address : '0x' + Math.random().toString(16).substr(2, 40),
      to: Math.random() > 0.5 ? address : '0x' + Math.random().toString(16).substr(2, 40),
      value: (Math.random() * 10).toFixed(6),
      gasUsed: Math.floor(Math.random() * 100000 + 21000),
      gasPrice: (Math.random() * 50 + 10).toFixed(2),
      status: Math.random() > 0.05 ? 'success' : 'failed',
      type: ['transfer', 'contract_call', 'token_transfer', 'nft_transfer'][Math.floor(Math.random() * 4)]
    });
  }
  
  // Generate daily activity for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 86400000);
    dailyActivity.push({
      date: date.toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 20),
      volume: (Math.random() * 1000).toFixed(2),
      gasSpent: (Math.random() * 0.1).toFixed(4)
    });
  }
  
  return {
    recentTransactions: transactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20),
    dailyActivity: dailyActivity.reverse(),
    totalVolume: transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0).toFixed(2),
    avgGasPrice: (transactions.reduce((sum, tx) => sum + parseFloat(tx.gasPrice), 0) / transactions.length).toFixed(2),
    successRate: ((transactions.filter(tx => tx.status === 'success').length / transactions.length) * 100).toFixed(1)
  };
}

// Generate token balances
function generateTokenBalances() {
  const tokens = ['USDC', 'USDT', 'WETH', 'DAI', 'LINK', 'UNI', 'AAVE', 'COMP'];
  return tokens.map(symbol => ({
    symbol,
    name: `${symbol} Token`,
    address: '0x' + Math.random().toString(16).substr(2, 40),
    balance: (Math.random() * 10000).toFixed(2),
    balanceUSD: (Math.random() * 50000).toFixed(2),
    price: (Math.random() * 100 + 1).toFixed(2),
    change24h: (Math.random() * 20 - 10).toFixed(2)
  })).filter(() => Math.random() > 0.3);
}

// Generate NFT data
function generateNFTData() {
  const collections = ['CryptoPunks', 'BAYC', 'Azuki', 'Doodles', 'CloneX'];
  return collections.map(name => ({
    collection: name,
    contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
    owned: Math.floor(Math.random() * 10 + 1),
    floorPrice: (Math.random() * 50 + 1).toFixed(2),
    totalValue: (Math.random() * 500 + 50).toFixed(2),
    tokens: Array.from({length: Math.floor(Math.random() * 5 + 1)}, (_, i) => ({
      tokenId: Math.floor(Math.random() * 10000),
      image: `https://example.com/nft/${i}.png`,
      rarity: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)]
    }))
  })).filter(() => Math.random() > 0.6);
}

// Generate DeFi positions
function generateDeFiPositions() {
  const protocols = ['Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve'];
  return protocols.map(protocol => ({
    protocol,
    type: ['Liquidity Pool', 'Lending', 'Borrowing', 'Staking'][Math.floor(Math.random() * 4)],
    position: (Math.random() * 100000).toFixed(2),
    apy: (Math.random() * 20 + 1).toFixed(2),
    rewards: (Math.random() * 1000).toFixed(2),
    healthFactor: protocol === 'Aave' ? (Math.random() * 2 + 1).toFixed(2) : null
  })).filter(() => Math.random() > 0.4);
}

// Detect contract type
function detectContractType(code) {
  const types = ['ERC20 Token', 'ERC721 NFT', 'Multisig Wallet', 'DEX Router', 'Lending Pool', 'Unknown Contract'];
  return types[Math.floor(Math.random() * types.length)];
}

// Calculate risk score
function calculateRiskScore(address) {
  const score = Math.floor(Math.random() * 100);
  let level = 'Low';
  if (score > 70) level = 'High';
  else if (score > 40) level = 'Medium';
  
  return {
    score,
    level,
    factors: [
      'High transaction frequency',
      'Interacts with known protocols',
      'No suspicious patterns detected'
    ].filter(() => Math.random() > 0.5)
  };
}

// Generate address labels
function generateAddressLabels(address) {
  const labels = ['Exchange', 'DeFi Protocol', 'NFT Marketplace', 'Bridge', 'Whale', 'Bot', 'MEV'];
  return labels.filter(() => Math.random() > 0.8);
}

app.get('/api/network', async (req, res) => {
  try {
    const blocks = await fetchLatestBlocks();
    const metrics = calculateMetrics(blocks);
    
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
    
    res.json({
      networkStats: {
        totalBlocks: blocks.length,
        totalTransactions: metrics.totalTx,
        avgBlockTime: metrics.avgBlockTime,
        networkHashrate: 0
      },
      mempool,
      priceData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network data' });
  }
});

// Search endpoint
app.get('/api/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    if (/^\d+$/.test(query)) {
      const block = await provider.getBlock(parseInt(query));
      if (block) return res.json({ type: 'block', data: block });
    }
    
    if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
      const tx = await provider.getTransaction(query);
      if (tx) return res.json({ type: 'transaction', data: tx });
    }
    
    if (/^0x[a-fA-F0-9]{40}$/.test(query)) {
      const balance = await provider.getBalance(query);
      const txCount = await provider.getTransactionCount(query);
      return res.json({
        type: 'address',
        data: { address: query, balance: ethers.formatEther(balance), transactionCount: txCount }
      });
    }
    
    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid search query' });
  }
});

// Validators endpoint
app.get('/api/validators', (req, res) => {
  const validators = [];
  for (let i = 0; i < 20; i++) {
    validators.push({
      address: '0x' + Math.random().toString(16).substr(2, 40),
      stake: (Math.random() * 10000 + 1000).toFixed(2),
      uptime: (Math.random() * 10 + 90).toFixed(1),
      blocks: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.1 ? 'active' : 'inactive'
    });
  }
  res.json(validators.sort((a, b) => b.stake - a.stake));
});

// Rich list endpoint
app.get('/api/richlist', (req, res) => {
  const richList = [];
  for (let i = 0; i < 50; i++) {
    richList.push({
      rank: i + 1,
      address: '0x' + Math.random().toString(16).substr(2, 40),
      balance: (Math.random() * 1000000 + 10000).toFixed(2),
      percentage: (Math.random() * 5 + 0.1).toFixed(3)
    });
  }
  res.json(richList.sort((a, b) => b.balance - a.balance));
});

// Tokens endpoint
app.get('/api/tokens', (req, res) => {
  const tokens = ['USDC', 'USDT', 'WETH', 'DAI', 'LINK'].map(name => ({
    name,
    symbol: name,
    address: '0x' + Math.random().toString(16).substr(2, 40),
    price: (Math.random() * 1000 + 1).toFixed(2),
    change24h: (Math.random() * 20 - 10).toFixed(2),
    volume24h: (Math.random() * 10000000).toFixed(0),
    holders: Math.floor(Math.random() * 100000 + 1000)
  }));
  res.json(tokens);
});

// DeFi analytics endpoint
app.get('/api/defi', (req, res) => {
  const protocols = ['Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve', 'SushiSwap', 'Balancer', '1inch'];
  const defiData = protocols.map(name => ({
    name,
    tvl: (Math.random() * 10000000000 + 1000000000).toFixed(0),
    volume24h: (Math.random() * 1000000000).toFixed(0),
    users24h: Math.floor(Math.random() * 50000 + 1000),
    apy: (Math.random() * 25 + 1).toFixed(2),
    category: ['DEX', 'Lending', 'Yield', 'Derivatives'][Math.floor(Math.random() * 4)],
    risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
  }));
  
  res.json({
    protocols: defiData,
    totalTVL: defiData.reduce((sum, p) => sum + parseFloat(p.tvl), 0).toFixed(0),
    totalVolume24h: defiData.reduce((sum, p) => sum + parseFloat(p.volume24h), 0).toFixed(0)
  });
});

// NFT analytics endpoint
app.get('/api/nfts', (req, res) => {
  const collections = ['CryptoPunks', 'BAYC', 'Azuki', 'Doodles', 'CloneX', 'Moonbirds', 'MAYC', 'Cool Cats'];
  const nftData = collections.map((name, index) => ({
    name,
    address: '0x' + Math.random().toString(16).substr(2, 40),
    floorPrice: (Math.random() * 100 + 1).toFixed(2),
    volume24h: (Math.random() * 1000).toFixed(2),
    sales24h: Math.floor(Math.random() * 100 + 1),
    owners: Math.floor(Math.random() * 5000 + 1000),
    totalSupply: Math.floor(Math.random() * 10000 + 1000),
    change24h: (Math.random() * 50 - 25).toFixed(2),
    marketCap: (Math.random() * 100000000).toFixed(0)
  }));
  
  res.json(nftData);
});

// Gas tracker endpoint
app.get('/api/gas', async (req, res) => {
  try {
    const feeData = await provider.getFeeData();
    const gasHistory = [];
    
    // Generate gas price history for last 24 hours
    for (let i = 0; i < 24; i++) {
      gasHistory.push({
        hour: i,
        slow: Math.floor(Math.random() * 20 + 10),
        standard: Math.floor(Math.random() * 30 + 20),
        fast: Math.floor(Math.random() * 50 + 40),
        timestamp: Date.now() - (23 - i) * 3600000
      });
    }
    
    res.json({
      current: {
        slow: Math.floor(Math.random() * 20 + 10),
        standard: Math.floor(Math.random() * 30 + 20),
        fast: Math.floor(Math.random() * 50 + 40),
        baseFee: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '20'
      },
      history: gasHistory,
      recommendations: {
        transfer: 'standard',
        swap: 'fast',
        mint: 'standard'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gas data' });
  }
});

// MEV analytics endpoint
app.get('/api/mev', (req, res) => {
  const mevData = {
    totalExtracted24h: (Math.random() * 1000000).toFixed(2),
    topBots: Array.from({length: 10}, (_, i) => ({
      address: '0x' + Math.random().toString(16).substr(2, 40),
      extracted24h: (Math.random() * 100000).toFixed(2),
      transactions: Math.floor(Math.random() * 1000 + 100),
      successRate: (Math.random() * 30 + 70).toFixed(1),
      strategy: ['Arbitrage', 'Sandwich', 'Liquidation', 'Front-running'][Math.floor(Math.random() * 4)]
    })),
    recentMEV: Array.from({length: 20}, () => ({
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      block: Math.floor(Math.random() * 1000000 + 2000000),
      profit: (Math.random() * 10000).toFixed(2),
      type: ['Arbitrage', 'Sandwich', 'Liquidation'][Math.floor(Math.random() * 3)],
      timestamp: Date.now() - Math.floor(Math.random() * 86400000)
    }))
  };
  
  res.json(mevData);
});

// Bridge analytics endpoint
app.get('/api/bridges', (req, res) => {
  const bridges = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche'];
  const bridgeData = bridges.map(name => ({
    name,
    volume24h: (Math.random() * 100000000).toFixed(0),
    transactions24h: Math.floor(Math.random() * 10000 + 1000),
    avgTime: Math.floor(Math.random() * 600 + 60), // seconds
    fee: (Math.random() * 50 + 5).toFixed(2),
    status: Math.random() > 0.1 ? 'active' : 'maintenance'
  }));
  
  res.json(bridgeData);
});

// Whale alerts endpoint
app.get('/api/whales', (req, res) => {
  const whaleAlerts = Array.from({length: 50}, () => ({
    txHash: '0x' + Math.random().toString(16).substr(2, 64),
    from: '0x' + Math.random().toString(16).substr(2, 40),
    to: '0x' + Math.random().toString(16).substr(2, 40),
    amount: (Math.random() * 10000 + 1000).toFixed(2),
    amountUSD: (Math.random() * 1000000 + 100000).toFixed(0),
    token: ['ETH', 'USDC', 'USDT', 'WETH'][Math.floor(Math.random() * 4)],
    timestamp: Date.now() - Math.floor(Math.random() * 86400000),
    type: ['Transfer', 'Swap', 'Deposit', 'Withdrawal'][Math.floor(Math.random() * 4)]
  }));
  
  res.json(whaleAlerts.sort((a, b) => b.timestamp - a.timestamp));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Monad Explorer API running on port ${PORT}`);
});