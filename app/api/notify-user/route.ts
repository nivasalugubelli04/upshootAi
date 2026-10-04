import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || 'Upshootai@gmail.com';

export async function GET() {
  const hasResend = !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_'));
  const stats = db.getStats();
  const dbActivities = db.activities.list(20);

  return NextResponse.json({
    status: 'active',
    configuredEmail: NOTIFY_EMAIL,
    emailDeliveryConfigured: hasResend,
    databaseStorageConfigured: true,
    databaseStats: stats,
    totalEventsLogged: stats.totalActivityLogs,
    recentEvents: dbActivities.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      action: a.action,
      timestamp: a.timestamp,
      deliveredTo: a.delivered_to,
      emailSent: hasResend,
    })),
    instructions: {
      terminalLogs: 'All user logins and profile submissions are output directly to the server console with full details.',
      databaseStorage: `Stored persistently in ${stats.storageFile} (Profiles: ${stats.totalProfiles}, Inquiries: ${stats.totalInquiries})`,
      emailDelivery: hasResend
        ? `Delivering live emails to ${NOTIFY_EMAIL} via Resend API.`
        : `To receive live emails directly in ${NOTIFY_EMAIL}'s Gmail inbox, add your free RESEND_API_KEY in .env.local. Console logging is currently active.`,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      userId,
      action = 'User Login',
      details = {},
    } = body;

    const cleanName = (name || 'Anonymous Visitor').toString().trim();
    const cleanEmail = (email || 'Not provided').toString().trim();
    const cleanPhone = (phone || 'Not provided').toString().trim();
    const cleanUserId = (userId || 'N/A').toString();
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const userAgent = request.headers.get('user-agent') || 'Unknown Browser';
    const forwardedFor = request.headers.get('x-forwarded-for') || 'Direct';
    const referer = request.headers.get('referer') || 'Direct URL';

    console.log('====================================================');
    console.log('🔔 [UPSHOOT AI] USER LOGIN & ACTIVITY NOTIFICATION');
    console.log(`Action:     ${action}`);
    console.log(`Name:       ${cleanName}`);
    console.log(`Email:      ${cleanEmail}`);
    console.log(`Phone:      ${cleanPhone}`);
    console.log(`User ID:    ${cleanUserId}`);
    console.log(`Time:       ${timestamp}`);
    console.log(`IP:         ${forwardedFor}`);
    console.log(`Recipient:  ${NOTIFY_EMAIL}`);
    console.log('====================================================');

    // Save to unified persistent database
    if (cleanUserId !== 'N/A' || cleanEmail !== 'Not provided' || cleanPhone !== 'Not provided') {
      try {
        db.profiles.upsert({
          id: cleanUserId !== 'N/A' ? cleanUserId : `usr_${Date.now()}`,
          name: cleanName !== 'Anonymous Visitor' ? cleanName : 'Visitor',
          email: cleanEmail,
          phone: cleanPhone,
          auth_provider: cleanPhone !== 'Not provided' ? 'msg91_otp' : 'google',
          verified: true,
        });
      } catch (dbErr) {
        console.warn('Database profile record note:', dbErr);
      }
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;

    if (resendApiKey && resendApiKey.startsWith('re_')) {
      try {
        const resend = new Resend(resendApiKey);

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090e; color: #f1f5f9; padding: 28px 16px; margin: 0; }
              .container { max-width: 620px; margin: 0 auto; background: linear-gradient(180deg, #111422 0%, #0d0f17 100%); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
              .header-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.35); color: #818cf8; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; }
              h1 { margin: 0 0 8px; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
              p.subtitle { margin: 0 0 24px; color: #94a3b8; font-size: 14px; }
              .card-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 14px; }
              .row:last-child { border-bottom: none; }
              .label { color: #64748b; font-weight: 500; }
              .val { color: #ffffff; font-weight: 600; text-align: right; }
              .val a { color: #38bdf8; text-decoration: none; }
              .meta-box { background: #080a10; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #64748b; line-height: 1.6; }
              .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #475569; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header-badge">⚡ Live User Alert</div>
              <h1>New User Login & Activity</h1>
              <p class="subtitle">A visitor has signed in / submitted details to Upshoot AI.</p>

              <div class="card-box">
                <div class="row">
                  <span class="label">Action / Event:</span>
                  <span class="val" style="color: #a78bfa;">${action}</span>
                </div>
                <div class="row">
                  <span class="label">Full Name:</span>
                  <span class="val">${cleanName}</span>
                </div>
                <div class="row">
                  <span class="label">Email Address:</span>
                  <span class="val">${cleanEmail !== 'Not provided' ? `<a href="mailto:${cleanEmail}">${cleanEmail}</a>` : 'Not provided'}</span>
                </div>
                <div class="row">
                  <span class="label">Phone Number:</span>
                  <span class="val">${cleanPhone !== 'Not provided' ? `<a href="tel:${cleanPhone}">${cleanPhone}</a>` : 'Not provided'}</span>
                </div>
                <div class="row">
                  <span class="label">User ID:</span>
                  <span class="val" style="font-family: monospace; font-size: 12px;">${cleanUserId}</span>
                </div>
                <div class="row">
                  <span class="label">Timestamp:</span>
                  <span class="val">${timestamp}</span>
                </div>
              </div>

              <div class="meta-box">
                <strong>Session Context:</strong><br>
                • Referrer: ${referer}<br>
                • User Agent: ${userAgent.slice(0, 120)}...<br>
                • IP Address: ${forwardedFor}
              </div>

              <div class="footer">
                Automated Security & Notification Pipeline for Upshoot AI<br>
                Delivered to: <strong>${NOTIFY_EMAIL}</strong>
              </div>
            </div>
          </body>
          </html>
        `;

        const result = await resend.emails.send({
          from: 'Upshoot AI Alert <onboarding@resend.dev>',
          to: [NOTIFY_EMAIL],
          subject: `🔔 [User Login Alert] ${cleanName} (${cleanEmail}) — Upshoot AI`,
          text: `Upshoot AI User Activity Notification\n\nAction: ${action}\nName: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}\nUser ID: ${cleanUserId}\nTime: ${timestamp}\nSent to: ${NOTIFY_EMAIL}`,
          html: htmlContent,
        });

        if (result.error) {
          console.error('Resend notify error:', result.error);
        } else {
          emailSent = true;
          console.log(`✅ Notification email successfully dispatched to ${NOTIFY_EMAIL}`);
        }
      } catch (emailErr) {
        console.error('Error sending alert email via Resend:', emailErr);
      }
    }

    db.activities.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      action,
      delivered_to: NOTIFY_EMAIL,
    });

    return NextResponse.json({
      success: true,
      deliveredTo: NOTIFY_EMAIL,
      emailSent,
      timestamp,
      user: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        userId: cleanUserId,
      },
    });
  } catch (error: unknown) {
    console.error('User notification API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing notification' },
      { status: 500 }
    );
  }
}
