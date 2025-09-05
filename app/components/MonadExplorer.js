'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Tooltip, Legend } from 'recharts';

export default function MonadExplorer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [validators, setValidators] = useState([]);
  const [richList, setRichList] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [defiData, setDefiData] = useState({ protocols: [], totalTVL: 0, totalVolume24h: 0 });
  const [nftData, setNftData] = useState([]);
  const [gasData, setGasData] = useState({ current: {}, history: [], recommendations: {} });
  const [mevData, setMevData] = useState({ totalExtracted24h: 0, topBots: [], recentMEV: [] });
  const [bridgeData, setBridgeData] = useState([]);
  const [whaleAlerts, setWhaleAlerts] = useState([]);
  const [addressDetails, setAddressDetails] = useState(null);
  const [data, setData] = useState({
    latestBlocks: [],
    tps: 0,
    gasUsage: 0,
    avgFee: 0,
    topWallets: [],
    tpsHistory: [],
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
    mempool: {
      pending: 0,
      queued: 0
    },
    gasHistory: [],
    blockTimeHistory: []
  });

  // Function to fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, validatorsRes, richListRes, tokensRes, defiRes, nftRes, gasRes, mevRes, bridgeRes, whaleRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/validators'),
        fetch('/api/richlist'),
        fetch('/api/tokens'),
        fetch('/api/defi'),
        fetch('/api/nfts'),
        fetch('/api/gas'),
        fetch('/api/mev'),
        fetch('/api/bridges'),
        fetch('/api/whales')
      ]);
      
      const [apiData, validatorsData, richListData, tokensData, defiDataRes, nftDataRes, gasDataRes, mevDataRes, bridgeDataRes, whaleDataRes] = await Promise.all([
        statsRes.json(),
        validatorsRes.json(),
        richListRes.json(),
        tokensRes.json(),
        defiRes.json(),
        nftRes.json(),
        gasRes.json(),
        mevRes.json(),
        bridgeRes.json(),
        whaleRes.json()
      ]);
      
      const now = Date.now();
      setData(prev => ({
        ...apiData,
        tpsHistory: [...prev.tpsHistory.slice(-29), { time: now, tps: apiData.tps }],
        gasHistory: [...prev.gasHistory.slice(-29), { time: now, gas: apiData.gasUsage }],
        blockTimeHistory: [...prev.blockTimeHistory.slice(-29), { time: now, blockTime: apiData.networkStats?.avgBlockTime || 0 }]
      }));
      
      setValidators(validatorsData);
      setRichList(richListData);
      setTokens(tokensData);
      setDefiData(defiDataRes);
      setNftData(nftDataRes);
      setGasData(gasDataRes);
      setMevData(mevDataRes);
      setBridgeData(bridgeDataRes);
      setWhaleAlerts(whaleDataRes);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
      const result = await response.json();
      setSearchResult(result);
      
      // If it's an address, fetch detailed information
      if (result.type === 'address') {
        try {
          const addressResponse = await fetch(`/api/address/${searchQuery}`);
          const addressData = await addressResponse.json();
          setAddressDetails(addressData);
          setActiveTab('address');
        } catch (error) {
          console.error('Address details fetch failed:', error);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult({ error: 'Search failed' });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatNumber = (num) => Number(num).toLocaleString();
  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;
  const formatPercent = (percent) => `${Number(percent) >= 0 ? '+' : ''}${Number(percent).toFixed(2)}%`;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-purple-400">Monad Explorer</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search block, tx, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className="flex space-x-2">
            <TabButton id="overview" label="Overview" active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="network" label="Network" active={activeTab === 'network'} onClick={setActiveTab} />
            <TabButton id="analytics" label="Analytics" active={activeTab === 'analytics'} onClick={setActiveTab} />
            <TabButton id="defi" label="DeFi" active={activeTab === 'defi'} onClick={setActiveTab} />
            <TabButton id="nfts" label="NFTs" active={activeTab === 'nfts'} onClick={setActiveTab} />
            <TabButton id="mev" label="MEV" active={activeTab === 'mev'} onClick={setActiveTab} />
            <TabButton id="validators" label="Validators" active={activeTab === 'validators'} onClick={setActiveTab} />
            <TabButton id="richlist" label="Rich List" active={activeTab === 'richlist'} onClick={setActiveTab} />
            <TabButton id="bridges" label="Bridges" active={activeTab === 'bridges'} onClick={setActiveTab} />
            <TabButton id="whales" label="Whales" active={activeTab === 'whales'} onClick={setActiveTab} />
            <TabButton id="tokens" label="Tokens" active={activeTab === 'tokens'} onClick={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResult && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Search Results</h3>
          {searchResult.error ? (
            <p className="text-red-400">{searchResult.error}</p>
          ) : (
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-400 mb-2">Type: {searchResult.type}</p>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(searchResult.data, null, 2)}
              </pre>
            </div>
          )}
          <button
            onClick={() => setSearchResult(null)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {/* Price & Market Data */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-400">MONAD Price</h3>
              <p className="text-3xl font-bold">{formatPrice(data.priceData.price)}</p>
              <p className={`text-sm ${Number(data.priceData.change24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(data.priceData.change24h)} 24h
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">TPS</h3>
              <p className="text-3xl font-bold">{data.tps}</p>
              <p className="text-sm text-gray-400">Transactions/sec</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Gas Usage</h3>
              <p className="text-3xl font-bold">{formatNumber(data.gasUsage)}</p>
              <p className="text-sm text-gray-400">Current block</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Avg Fee</h3>
              <p className="text-3xl font-bold">{Number(data.avgFee).toFixed(6)} ETH</p>
              <p className="text-sm text-gray-400">Per transaction</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-400">TPS Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.tpsHistory}>
                  <XAxis dataKey="time" hide />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <Area type="monotone" dataKey="tps" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Active Wallets</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.topWallets.slice(0, 8)}>
                  <XAxis dataKey="address" tickFormatter={formatAddress} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Transactions' : name]} />
                  <Bar dataKey="count" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Blocks */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Latest Blocks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Block</th>
                    <th className="text-left p-2">Hash</th>
                    <th className="text-left p-2">Txs</th>
                    <th className="text-left p-2">Gas Used</th>
                    <th className="text-left p-2">Miner</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.latestBlocks.map((block) => (
                    <tr key={block.number} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-mono text-blue-400">{block.number}</td>
                      <td className="p-2 font-mono text-gray-300">{formatAddress(block.hash)}</td>
                      <td className="p-2">{block.txCount}</td>
                      <td className="p-2">{formatNumber(block.gasUsed)}</td>
                      <td className="p-2 font-mono text-gray-400">{formatAddress(block.miner || 'Unknown')}</td>
                      <td className="p-2">{new Date(block.timestamp * 1000).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'network' && (
        <>
          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Total Blocks</h3>
              <p className="text-3xl font-bold">{formatNumber(data.networkStats.totalBlocks)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Total Transactions</h3>
              <p className="text-3xl font-bold">{formatNumber(data.networkStats.totalTransactions)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Avg Block Time</h3>
              <p className="text-3xl font-bold">{data.networkStats.avgBlockTime.toFixed(1)}s</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Market Cap</h3>
              <p className="text-3xl font-bold">${formatNumber(data.priceData.marketCap)}</p>
            </div>
          </div>

          {/* Mempool & Network Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Mempool Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Pending Transactions:</span>
                  <span className="font-bold text-orange-400">{formatNumber(data.mempool.pending)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Queued Transactions:</span>
                  <span className="font-bold text-yellow-400">{formatNumber(data.mempool.queued)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Block Time Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.blockTimeHistory}>
                  <XAxis dataKey="time" hide />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <Line type="monotone" dataKey="blockTime" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}


      {activeTab === 'validators' && (
        <>
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-400">Validators</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Address</th>
                    <th className="text-left p-2">Stake (MONAD)</th>
                    <th className="text-left p-2">Uptime %</th>
                    <th className="text-left p-2">Blocks</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {validators.map((validator, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-mono text-blue-400">{formatAddress(validator.address)}</td>
                      <td className="p-2">{formatNumber(validator.stake)}</td>
                      <td className="p-2">{validator.uptime}%</td>
                      <td className="p-2">{formatNumber(validator.blocks)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          validator.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {validator.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Rich List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Rank</th>
                    <th className="text-left p-2">Address</th>
                    <th className="text-left p-2">Balance (MONAD)</th>
                    <th className="text-left p-2">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {richList.slice(0, 20).map((account) => (
                    <tr key={account.rank} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold">{account.rank}</td>
                      <td className="p-2 font-mono text-blue-400">{formatAddress(account.address)}</td>
                      <td className="p-2">{formatNumber(account.balance)}</td>
                      <td className="p-2">{account.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'tokens' && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Top Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{token.name}</h4>
                    <p className="text-gray-400 text-sm">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${token.price}</p>
                    <p className={`text-sm ${
                      Number(token.change24h) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercent(token.change24h)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume 24h:</span>
                    <span>${formatNumber(token.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Holders:</span>
                    <span>{formatNumber(token.holders)}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {formatAddress(token.address)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'address' && addressDetails && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Balance</h3>
              <p className="text-2xl font-bold">{parseFloat(addressDetails.balance).toFixed(4)} MONAD</p>
              <p className="text-sm text-gray-400">${addressDetails.balanceUSD}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Transactions</h3>
              <p className="text-2xl font-bold">{formatNumber(addressDetails.transactionCount)}</p>
              <p className="text-sm text-gray-400">Total sent/received</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Risk Score</h3>
              <p className="text-2xl font-bold">{addressDetails.riskScore && addressDetails.riskScore.score}/100</p>
              <p className={`text-sm ${
                addressDetails.riskScore && addressDetails.riskScore.level === 'Low' ? 'text-green-400' :
                addressDetails.riskScore && addressDetails.riskScore.level === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{addressDetails.riskScore && addressDetails.riskScore.level} Risk</p>
            </div>
          </div>

          {addressDetails.tokenBalances && addressDetails.tokenBalances.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Token Holdings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addressDetails.tokenBalances.map((token, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{token.symbol}</h4>
                        <p className="text-sm text-gray-400">{token.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatNumber(token.balance)}</p>
                        <p className="text-sm text-green-400">${formatNumber(token.balanceUSD)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Hash</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Value</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {addressDetails.activityData && addressDetails.activityData.recentTransactions && addressDetails.activityData.recentTransactions.slice(0, 10).map((tx, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-mono text-blue-400">{formatAddress(tx.hash)}</td>
                      <td className="p-2 capitalize">{tx.type.replace('_', ' ')}</td>
                      <td className="p-2">{tx.value} MONAD</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.status === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-2">{new Date(tx.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'defi' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Total TVL</h3>
              <p className="text-3xl font-bold">${formatNumber(defiData.totalTVL)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">24h Volume</h3>
              <p className="text-3xl font-bold">${formatNumber(defiData.totalVolume24h)}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">DeFi Protocols</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defiData.protocols.map((protocol, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded">
                  <h4 className="font-bold text-lg mb-2">{protocol.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>TVL:</span>
                      <span>${formatNumber(protocol.tvl)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APY:</span>
                      <span className="text-green-400">{protocol.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{protocol.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'gas' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Slow</h3>
              <p className="text-2xl font-bold">{gasData.current.slow} gwei</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Standard</h3>
              <p className="text-2xl font-bold">{gasData.current.standard} gwei</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-red-400">Fast</h3>
              <p className="text-2xl font-bold">{gasData.current.fast} gwei</p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Gas Price History (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gasData.history}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="slow" stroke="#10b981" name="Slow" />
                <Line type="monotone" dataKey="standard" stroke="#f59e0b" name="Standard" />
                <Line type="monotone" dataKey="fast" stroke="#ef4444" name="Fast" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'mev' && (
        <>
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-2 text-red-400">MEV Extracted (24h)</h3>
            <p className="text-3xl font-bold">${formatNumber(mevData.totalExtracted24h)}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top MEV Bots</h3>
              <div className="space-y-3">
                {mevData.topBots.slice(0, 5).map((bot, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <p className="font-mono text-sm">{formatAddress(bot.address)}</p>
                      <p className="text-xs text-gray-400">{bot.strategy}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${formatNumber(bot.extracted24h)}</p>
                      <p className="text-xs text-green-400">{bot.successRate}% success</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Recent MEV Transactions</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {mevData.recentMEV.slice(0, 10).map((tx, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-xs">{formatAddress(tx.txHash)}</p>
                        <p className="text-xs text-gray-400">{tx.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">${formatNumber(tx.profit)}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'nfts' && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Top NFT Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftData.map((collection, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-3">{collection.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Floor Price:</span>
                    <span className="font-bold">{collection.floorPrice} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Volume:</span>
                    <span>{collection.volume24h} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Sales:</span>
                    <span>{collection.sales24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Owners:</span>
                    <span>{formatNumber(collection.owners)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Change:</span>
                    <span className={Number(collection.change24h) >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatPercent(collection.change24h)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

   

      {activeTab === 'analytics' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Gas Usage Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.gasHistory}>
                  <XAxis dataKey="time" hide />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <Area type="monotone" dataKey="gas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Top Wallets by Volume</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {data.topWallets.slice(0, 10).map((wallet, index) => (
                  <div key={wallet.address} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <p className="font-mono text-sm">{formatAddress(wallet.address)}</p>
                      <p className="text-xs text-gray-400">{wallet.count} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{Number(wallet.volume).toFixed(4)} ETH</p>
                      <p className="text-xs text-gray-400">Volume</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'richlist' && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Rich List</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Rank</th>
                  <th className="text-left p-2">Address</th>
                  <th className="text-left p-2">Balance (MONAD)</th>
                  <th className="text-left p-2">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {richList.slice(0, 20).map((account) => (
                  <tr key={account.rank} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-2 font-bold">{account.rank}</td>
                    <td className="p-2 font-mono text-blue-400">{formatAddress(account.address)}</td>
                    <td className="p-2">{formatNumber(account.balance)}</td>
                    <td className="p-2">{account.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bridges' && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Cross-Chain Bridges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bridgeData.map((bridge, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg">{bridge.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    bridge.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {bridge.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>24h Volume:</span>
                    <span>${formatNumber(bridge.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Transactions:</span>
                    <span>{formatNumber(bridge.transactions24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Time:</span>
                    <span>{Math.floor(bridge.avgTime / 60)}m {bridge.avgTime % 60}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>${bridge.fee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'whales' && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-red-400">Whale Alerts</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {whaleAlerts.slice(0, 20).map((alert, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">{alert.type}</span>
                      <span className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="font-mono text-xs text-gray-300 mb-1">
                      From: {formatAddress(alert.from)}
                    </p>
                    <p className="font-mono text-xs text-gray-300">
                      To: {formatAddress(alert.to)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatNumber(alert.amount)} {alert.token}</p>
                    <p className="text-sm text-green-400">${formatNumber(alert.amountUSD)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Top Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{token.name}</h4>
                    <p className="text-gray-400 text-sm">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${token.price}</p>
                    <p className={`text-sm ${
                      Number(token.change24h) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercent(token.change24h)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume 24h:</span>
                    <span>${formatNumber(token.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Holders:</span>
                    <span>{formatNumber(token.holders)}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {formatAddress(token.address)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}