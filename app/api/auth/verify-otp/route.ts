import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { verifyOtpService } from '@/lib/msg91';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp, name } = body;

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, message: 'Both mobile number and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const verification = await verifyOtpService({ mobile, otp });

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          message: verification.message,
          attemptsRemaining: verification.attemptsRemaining,
        },
        { status: 400 }
      );
    }

    const cleanMobile = verification.verifiedMobile!;
    const userId = `usr_msg91_${cleanMobile}`;
    const userName = name?.trim() || 'Verified Partner';
    const userEmail = `client.${cleanMobile.slice(-4)}@upshootai.com`;

    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Persist verified profile and active session in database
    const profile = db.profiles.upsert({
      id: userId,
      name: userName,
      email: userEmail,
      phone: `+${cleanMobile}`,
      verified: true,
      auth_provider: 'msg91_otp',
    });

    db.sessions.create({
      token: sessionToken,
      userId,
      name: userName,
      email: userEmail,
      phone: `+${cleanMobile}`,
    });

    // Notify Upshootai@gmail.com about verified mobile partner session
    try {
      const notifyUrl = new URL('/api/notify-user', request.url);
      await fetch(notifyUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: `+${cleanMobile}`,
          userId,
          action: 'Client Successfully Verified Mobile via MSG91 SMS OTP',
        }),
      });
    } catch {
      // Non-blocking notification
    }

    const response = NextResponse.json({
      success: true,
      message: 'Mobile number verified successfully.',
      user: {
        id: userId,
        phone: `+${cleanMobile}`,
        name: userName,
        email: userEmail,
      },
      sessionToken,
    });

    // Set secure HTTP-only session cookie (30-day persistence)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      `upshoot_auth_session=${sessionToken}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=2592000', // 30 days
      ...(isProduction ? ['Secure'] : []),
    ].join('; ');

    response.headers.append('Set-Cookie', cookieOptions);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error while verifying OTP.' },
      { status: 500 }
    );
  }
}
