import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const stats = db.getStats();
  const recentInquiries = db.inquiries.list(10);
  const recentProfiles = db.profiles.list(10);

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    backend: {
      framework: 'Next.js 16.3.8 Full-Stack Engine',
      database: stats,
      features: {
        persistentLocalStorage: true,
        atomicFileLocking: true,
        supabaseCloudAdapter: stats.remoteSupabaseConfigured,
        msg91SmsGateway: process.env.MSG91_AUTH_KEY !== 'YOUR_NEW_MSG91_AUTHKEY' && !!process.env.MSG91_AUTH_KEY,
        emailNotifications: !!process.env.RESEND_API_KEY,
      },
    },
    tables: {
      profiles: {
        count: stats.totalProfiles,
        recent: recentProfiles,
      },
      contact_inquiries: {
        count: stats.totalInquiries,
        recent: recentInquiries,
      },
    },
  });
}
