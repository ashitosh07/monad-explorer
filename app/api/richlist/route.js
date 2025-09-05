import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.BLOCKVISION_API_KEY || '32I7NHH5XeN6h9WMCgclY0KDgJY';
    
    const response = await fetch('https://api.blockvision.org/v1/account/mon-holders', {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('BlockVision response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('BlockVision data:', data);
      
      const richList = data.data?.map((holder, index) => ({
        rank: index + 1,
        address: holder.address,
        balance: holder.balance,
        percentage: holder.percentage
      })) || [];
      
      if (richList.length > 0) {
        return NextResponse.json(richList);
      }
    }
  } catch (error) {
    console.error('BlockVision error:', error);
  }
  
  // Fallback with sample data
  const fallbackData = Array.from({length: 10}, (_, i) => ({
    rank: i + 1,
    address: `0x${Math.random().toString(16).substr(2, 40)}`,
    balance: (Math.random() * 1000000 + 10000).toFixed(2),
    percentage: (Math.random() * 5 + 0.1).toFixed(3)
  }));
  
  return NextResponse.json(fallbackData);
}