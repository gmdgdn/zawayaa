import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    WP_API_BASE: process.env.WP_API_BASE,
    NEXT_PUBLIC_WP_URL: process.env.NEXT_PUBLIC_WP_URL,
    WP_USERNAME: process.env.WP_USERNAME,
    WP_APP_PASSWORD: process.env.WP_APP_PASSWORD ? 'SET' : 'NOT SET'
  });
}