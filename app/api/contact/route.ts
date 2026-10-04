import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const inquiries = db.inquiries.list(100);
  return NextResponse.json({
    success: true,
    total: inquiries.length,
    inquiries,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, userId } = body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const phoneDigits = (phone || '').replace(/[\s\-\(\)\+]/g, '');
    if (!phone || typeof phone !== 'string' || phoneDigits.length < 7 || phoneDigits.length > 16) {
      return NextResponse.json(
        { success: false, error: 'A valid phone number (7-16 digits) is required.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Project details must be at least 10 characters.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();
    const contactEmail = process.env.CONTACT_EMAIL || 'Upshootai@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    // Save to persistent database
    const savedInquiry = db.inquiries.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      user_id: userId || null,
    });

    // Send email via Resend if API key is provided
    if (resendApiKey && resendApiKey.startsWith('re_')) {
      const resend = new Resend(resendApiKey);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f11; color: #f5f5f7; padding: 24px; margin: 0; }
            .card { background: #1a1a20; border: 1px solid #33333e; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 32px; }
            .badge { display: inline-block; background: rgba(255, 122, 26, 0.15); color: #ff7a1a; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
            h2 { margin: 0 0 20px; color: #ffffff; font-size: 20px; }
            .field { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #2a2a34; }
            .field:last-child { border-bottom: none; }
            .label { font-size: 12px; text-transform: uppercase; color: #a1a1aa; font-weight: 600; margin-bottom: 4px; }
            .value { font-size: 15px; color: #ffffff; line-height: 1.5; }
            .message-box { background: #22222a; padding: 16px; border-radius: 8px; margin-top: 8px; white-space: pre-wrap; }
            .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #71717a; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">UPSHOOT AI INQUIRY</div>
            <h2>New Project Inquiry Received</h2>
            <div class="field">
              <div class="label">Full Name</div>
              <div class="value">${cleanName}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${cleanEmail}" style="color: #ff7a1a;">${cleanEmail}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value"><a href="tel:${cleanPhone}" style="color: #ff7a1a;">${cleanPhone}</a></div>
            </div>
            <div class="field">
              <div class="label">Project Details</div>
              <div class="message-box">${cleanMessage}</div>
            </div>
            ${userId ? `<div class="field"><div class="label">Authenticated User ID</div><div class="value" style="font-family: monospace; font-size: 13px;">${userId}</div></div>` : ''}
          </div>
          <div class="footer">Upshoot AI Automated Contact Gateway</div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: 'Upshoot AI <onboarding@resend.dev>',
        to: [contactEmail],
        replyTo: cleanEmail,
        subject: `New Inquiry from ${cleanName} — Upshoot AI`,
        text: `New Upshoot AI Inquiry\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}\n\nProject Details:\n${cleanMessage}`,
        html: htmlContent,
      });

      if (result.error) {
        console.error('Resend error:', result.error);
        return NextResponse.json(
          { success: false, error: 'Email delivery provider returned an error: ' + result.error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Thank you! Your message has been sent directly to our team. We will be in touch within 24 hours.',
      });
    }

    // Fallback in case RESEND_API_KEY is not yet configured
    console.log('--- UPSHOOT AI CONTACT SUBMISSION ---');
    console.log(`Name:    ${cleanName}`);
    console.log(`Email:   ${cleanEmail}`);
    console.log(`Phone:   ${cleanPhone}`);
    console.log(`Message: ${cleanMessage}`);
    console.log(`Target:  ${contactEmail}`);
    console.log('------------------------------------');

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will review your project details within 24 hours.',
    });
  } catch (err: unknown) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
