import { NextResponse, type NextRequest } from 'next/server';
import { resendOtpService } from '@/lib/msg91';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;

    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid mobile number is required.' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'Direct';

    const result = await resendOtpService({ mobile, ip });

    if (!result.success) {
      const statusCode = result.retryAfterSeconds || result.cooldownSeconds ? 429 : 400;
      const headers: Record<string, string> = {};
      if (result.retryAfterSeconds) {
        headers['Retry-After'] = result.retryAfterSeconds.toString();
      }

      return NextResponse.json(
        {
          success: false,
          message: result.message,
          cooldownSeconds: result.cooldownSeconds,
          retryAfterSeconds: result.retryAfterSeconds,
        },
        { status: statusCode, headers }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      cooldownSeconds: result.cooldownSeconds || 30,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error while resending OTP.' },
      { status: 500 }
    );
  }
}
