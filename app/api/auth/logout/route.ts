import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get('upshoot_auth_session')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (token) {
      db.sessions.deleteByToken(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });

    response.cookies.delete('upshoot_auth_session');
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
