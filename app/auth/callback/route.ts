import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session?.user) {
        const user = data.session.user;

        // Check if user has an existing profile record
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Auto-provision initial profile record from OAuth metadata
          const fullName =
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            user.user_metadata?.user_name ??
            '';

          await supabase.from('profiles').insert({
            id: user.id,
            name: fullName,
            email: user.email ?? '',
            phone: user.phone ?? '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // Notify Upshootai@gmail.com of Google OAuth login
        try {
          const notifyUrl = `${origin}/api/notify-user`;
          await fetch(notifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
              email: user.email || '',
              phone: user.phone || '',
              userId: user.id,
              action: 'Google OAuth Sign-In',
            }),
          });
        } catch {
          // Non-blocking notification dispatch
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    } catch (err) {
      console.error('Error exchanging OAuth code for session:', err);
    }
  }

  // Fallback redirect if error or no code
  return NextResponse.redirect(`${origin}/?auth_error=oauth_failed`);
}
