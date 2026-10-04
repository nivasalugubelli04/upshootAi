import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('upshoot_auth_session')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const session = db.sessions.findByToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const profile = db.profiles.findById(session.user_id) || {
      id: session.user_id,
      name: session.name,
      email: session.email,
      phone: session.phone,
      verified: true,
      auth_provider: 'msg91_otp',
      created_at: session.created_at,
      updated_at: session.created_at,
    };

    return NextResponse.json({
      authenticated: true,
      user: profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
