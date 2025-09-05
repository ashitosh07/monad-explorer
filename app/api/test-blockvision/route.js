import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = '32I7NHH5XeN6h9WMCgclY0KDgJY';
  
  const testEndpoints = [
    'https://api.blockvision.org/v1/account/mon-holders',
    'https://api.blockvision.org/v1/account/0x1234567890123456789012345678901234567890/tokens'
  ];
  
  const results = {};
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      results[endpoint] = {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        data: response.ok ? await response.json() : await response.text()
      };
    } catch (error) {
      results[endpoint] = {
        error: error.message
      };
    }
  }
  
  return NextResponse.json(results);
}