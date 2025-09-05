export async function GET() {
  const networkData = {
    blockHeight: 1000000,
    tps: Math.floor(Math.random() * 5000) + 2000,
    avgBlockTime: 2.1,
    networkHashrate: "125.5 TH/s",
    difficulty: "25.2T",
    totalSupply: "1000000000",
    circulatingSupply: "750000000",
    validators: 150,
    activeValidators: 147,
    stakingRatio: 0.68,
    avgGasPrice: Math.floor(Math.random() * 50) + 20
  };

  return Response.json(networkData);
}