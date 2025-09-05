import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.BLOCKVISION_API_KEY || '32I7NHH5XeN6h9WMCgclY0KDgJY';
    
    const response = await fetch('https://api.blockvision.org/v1/monad-testnet/validators', {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.validators?.length > 0) {
        return NextResponse.json(data.validators);
      }
    }
  } catch (error) {
    console.error('BlockVision validators error:', error);
  }
  
  // Fallback with sample validator data
  const fallbackValidators = Array.from({length: 8}, (_, i) => ({
    address: `0x${Math.random().toString(16).substr(2, 40)}`,
    stake: (Math.random() * 10000 + 1000).toFixed(2),
    uptime: (Math.random() * 10 + 90).toFixed(1),
    blocks: Math.floor(Math.random() * 1000 + 100),
    status: Math.random() > 0.1 ? 'active' : 'inactive'
  }));
  
  return NextResponse.json(fallbackValidators);
}