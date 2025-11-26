import { get } from '@vercel/edge-config';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const liveTime = await get<string>('liveTime');
    const indefiniteMaintenance = await get<boolean>('indefiniteMaintenance');

    return NextResponse.json({
      liveTime: liveTime || null,
      indefiniteMaintenance: indefiniteMaintenance || false,
    });
  } catch (error) {
    console.error('Error fetching Edge Config:', error);
    return NextResponse.json(
      { 
        liveTime: null, 
        indefiniteMaintenance: false,
        error: 'Failed to fetch maintenance status' 
      },
      { status: 500 }
    );
  }
}

