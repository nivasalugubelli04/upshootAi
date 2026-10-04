import { NextResponse, type NextRequest } from 'next/server';
import { resendOtpService } from '@/lib/msg91';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json(
        { success: false, message: 'Mobile number is required' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'Direct';

    const result = await resendOtpService({ mobile, ip });
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: any) {
    console.error('Error in /api/otp/retry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retry OTP: ' + error.message },
      { status: 500 }
    );
  }
}
