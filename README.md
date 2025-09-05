# 🚀 Advanced Monad Explorer

A comprehensive blockchain explorer for Monad with advanced analytics, DeFi tracking, and institutional-grade features.

![Monad Explorer](https://img.shields.io/badge/Monad-Explorer-purple?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)
![React](https://img.shields.io/badge/React-18+-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square)

## ✨ Features

### 🔍 **Core Explorer**
- **Real-time Block Tracking**: Latest blocks with detailed transaction data
- **Advanced Search**: Search blocks, transactions, and addresses with auto-detection
- **Network Statistics**: TPS, gas usage, block times, and network health
- **Smart Refresh**: 10-minute auto-refresh with manual refresh option

### 📊 **Advanced Analytics**
- **Address Intelligence**: Comprehensive address profiling with activity history
- **DeFi Dashboard**: Protocol TVL, APY tracking, and risk assessment
- **NFT Analytics**: Collection tracking, floor prices, and market trends
- **Gas Tracker**: Real-time gas prices with 24-hour historical data
- **MEV Monitor**: MEV bot tracking and profit analysis
- **Whale Alerts**: Large transaction monitoring and patterns

### 🏦 **Address Deep Dive**
- **Complete Portfolio**: Token holdings with USD values
- **Transaction History**: 50+ recent transactions with detailed metadata
- **DeFi Positions**: Lending, borrowing, and staking across protocols
- **NFT Collections**: Owned NFTs with rarity and floor price data
- **Risk Assessment**: Smart contract risk scoring with factors
- **Activity Analytics**: Daily transaction patterns and success rates

### 🛡️ **Security & Monitoring**
- **Validator Tracking**: Stake amounts, uptime, and performance
- **Bridge Analytics**: Cross-chain volume and status monitoring
- **Risk Scoring**: Automated address risk assessment
- **Label System**: Automatic address categorization (Exchange, DeFi, Whale, etc.)

## 🏗️ Architecture

### **Backend (Node.js + Express)**
- **API-First Design**: RESTful endpoints for all data
- **Ethers.js Integration**: Direct connection to Monad testnet
- **Rate Limiting**: Optimized API calls to prevent throttling
- **Mock Data Generation**: Realistic data simulation for development

### **Frontend (Next.js + React + Tailwind)**
- **Modern UI**: Clean, responsive design with dark theme
- **Advanced Charts**: Interactive visualizations with Recharts
- **Tabbed Interface**: Organized data presentation
- **Real-time Updates**: Automatic data refresh every 10 minutes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Alchemy API key for Monad testnet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd monad-explorer
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure API Endpoint**
Update the Monad RPC URL in `backend/server.js`:
```javascript
const provider = new ethers.JsonRpcProvider('https://monad-testnet.g.alchemy.com/v2/YOUR_API_KEY');
```

5. **Start the Backend**
```bash
cd backend
npm run dev
```

6. **Start the Frontend**
```bash
cd frontend
npm run dev
```

7. **Access the Explorer**
Open `http://localhost:3000` in your browser

## 📡 API Endpoints

### Core Data
- `GET /api/stats` - Complete network statistics
- `GET /api/blocks` - Latest blocks with pagination
- `GET /api/network` - Network health and metrics

### Search & Discovery
- `GET /api/search/:query` - Universal search (blocks/tx/addresses)
- `GET /api/block/:number` - Specific block details
- `GET /api/transaction/:hash` - Transaction details
- `GET /api/address/:address` - Comprehensive address analytics

### Advanced Analytics
- `GET /api/defi` - DeFi protocol analytics
- `GET /api/nfts` - NFT collection data
- `GET /api/gas` - Gas price tracking
- `GET /api/mev` - MEV analytics and bot tracking
- `GET /api/validators` - Validator performance data
- `GET /api/richlist` - Top addresses by balance
- `GET /api/bridges` - Cross-chain bridge analytics
- `GET /api/whales` - Large transaction alerts
- `GET /api/tokens` - Token analytics and prices

## 🎯 Usage Examples

### Search Functionality
- **Block Number**: `12345`
- **Transaction Hash**: `0x1234...abcd`
- **Address**: `0xabcd...1234`

### Address Analytics
Search any address to view:
- Complete transaction history
- Token portfolio with USD values
- DeFi positions across protocols
- NFT collections owned
- Risk assessment and labels

## 🛠️ Development

### Project Structure
```
monad-explorer/
├── backend/
│   ├── server.js          # Main API server
│   ├── package.json       # Backend dependencies
│   └── node_modules/
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── MonadExplorer.js  # Main component
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # App layout
│   │   └── page.js        # Home page
│   ├── package.json       # Frontend dependencies
│   └── node_modules/
├── .gitignore
└── README.md
```

### Key Technologies
- **Backend**: Node.js, Express, Ethers.js, CORS
- **Frontend**: Next.js, React, Tailwind CSS, Recharts
- **Blockchain**: Monad Testnet via Alchemy

## 🔧 Configuration

### Environment Variables
Create `.env` files for sensitive configuration:

**Backend (.env)**
```env
PORT=3001
MONAD_RPC_URL=https://monad-testnet.g.alchemy.com/v2/YOUR_API_KEY
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📈 Performance Optimizations

- **API Rate Limiting**: Optimized calls to prevent Alchemy throttling
- **Data Caching**: Efficient data storage and retrieval
- **Batch Requests**: Multiple API calls combined for better performance
- **Lazy Loading**: Components load data on demand
- **Responsive Design**: Optimized for all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad Team** for the innovative blockchain platform
- **Alchemy** for reliable RPC infrastructure
- **Ethers.js** for blockchain interaction
- **Next.js & React** for the frontend framework
- **Tailwind CSS** for styling
- **Recharts** for data visualization

## 📞 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Monad ecosystem**