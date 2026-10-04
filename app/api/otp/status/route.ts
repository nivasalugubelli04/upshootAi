import { NextResponse } from 'next/server';
import { isMsg91Configured } from '@/lib/msg91';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    configured: isMsg91Configured(),
    senderId: process.env.MSG91_SENDER_ID || 'UPSHOT',
    hasTemplate: !!process.env.MSG91_TEMPLATE_ID,
  });
}
