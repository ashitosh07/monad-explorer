import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { address } = params;
    const apiKey = process.env.BLOCKVISION_API_KEY || '32I7NHH5XeN6h9WMCgclY0KDgJY';

    // Use real BlockVision API endpoints
    const [tokensRes, nftsRes, activityRes] = await Promise.all([
      fetch(`https://api.blockvision.org/v1/account/${address}/tokens`, {
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
      }),
      fetch(`https://api.blockvision.org/v1/account/${address}/nfts`, {
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
      }),
      fetch(`https://api.blockvision.org/v1/account/${address}/activity`, {
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
      })
    ]);

    const tokens = tokensRes.ok ? (await tokensRes.json()).data || [] : [];
    const nfts = nftsRes.ok ? (await nftsRes.json()).data || [] : [];
    const activity = activityRes.ok ? (await activityRes.json()).data || [] : [];

    return NextResponse.json({
      address,
      tokens,
      nfts,
      activity,
      totalTokens: tokens.length,
      totalNFTs: nfts.length
    });
  } catch (error) {
    console.error('BlockVision API error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}