import { NextResponse, type NextRequest } from 'next/server';
import { verifyOtpService } from '@/lib/msg91';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp, userName } = body;

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, message: 'Both mobile number and OTP code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyOtpService({ mobile, otp });

    if (result.success) {
      // Notify Upshootai@gmail.com about verified mobile number
      try {
        const notifyUrl = new URL('/api/notify-user', request.url);
        await fetch(notifyUrl.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userName || 'Verified Mobile Client',
            email: `client.${mobile.slice(-4)}@upshootai.com`,
            phone: `+${result.verifiedMobile || mobile}`,
            userId: `msg91_verified_${result.verifiedMobile || mobile}`,
            action: 'Client Successfully Verified Mobile via MSG91 SMS OTP',
          }),
        });
      } catch (notifyErr) {
        console.warn('Silent note: notify-user after OTP verification:', notifyErr);
      }
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: any) {
    console.error('Error in /api/otp/verify:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while verifying OTP: ' + error.message },
      { status: 500 }
    );
  }
}
