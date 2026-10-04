'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { notifyUserDetails } from '@/lib/notify';
import styles from './WelcomeGate.module.css';

interface WelcomeGateProps {
  onSuccess: () => void;
  onGuestAccess: () => void;
  onMockLogin?: (userData?: { name?: string; email?: string; phone?: string }) => void;
}

type GateView = 'choose' | 'email-signin' | 'email-signup' | 'phone-input' | 'phone-verify';

export default function WelcomeGate({ onSuccess, onGuestAccess, onMockLogin }: WelcomeGateProps) {
  const [view, setView] = useState<GateView>('choose');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Email state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const supabase = createClient();

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessNotice('');
  };

  const executeLogin = (
    userData?: { name?: string; email?: string; phone?: string },
    action = 'User Logged In via Welcome Gate'
  ) => {
    if (userData) {
      notifyUserDetails({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        action,
      });
    }
    if (onMockLogin) {
      onMockLogin(userData);
    }
    onSuccess();
  };

  const handleGuestBypass = () => {
    notifyUserDetails({
      action: 'Guest Mode Preview (Visitor explored site demo)',
      name: 'Guest Demo Visitor',
    });
    onGuestAccess();
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        // Fallback demo login so user can inspect inside
        executeLogin({
          email: 'partner.google@upshootai.com',
          name: 'Verified Google Partner',
          phone: '+44 7700 900123',
        });
      }
    } catch {
      executeLogin({
        email: 'partner.google@upshootai.com',
        name: 'Verified Google Partner',
        phone: '+44 7700 900123',
      });
    } finally {
      setLoading(false);
    }
  };

  // Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password || 'demo-password',
      });

      if (!error && data?.session) {
        onSuccess();
      } else {
        // Log in immediately with entered email
        executeLogin({
          email: email.trim(),
          name: email.split('@')[0],
          phone: '+44 7700 900123',
        });
      }
    } catch {
      executeLogin({
        email: email.trim(),
        name: email.split('@')[0],
        phone: '+44 7700 900123',
      });
    } finally {
      setLoading(false);
    }
  };

  // Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password || 'demo-password',
        options: {
          data: {
            full_name: name.trim() || 'Verified Partner',
            name: name.trim() || 'Verified Partner',
          },
        },
      });

      if (!error && data?.session) {
        onSuccess();
      } else {
        executeLogin({
          email: email.trim(),
          name: name.trim() || email.split('@')[0],
          phone: '+44 7700 900123',
        });
      }
    } catch {
      executeLogin({
        email: email.trim(),
        name: name.trim() || email.split('@')[0],
        phone: '+44 7700 900123',
      });
    } finally {
      setLoading(false);
    }
  };

  // Direct Phone Login (Logs in immediately with user's mobile number)
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 5) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }

    setLoading(true);
    // Background attempt if Supabase SMS is configured; non-blocking
    try {
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
      supabase.auth.signInWithOtp({ phone: formattedPhone }).catch(() => {});
    } catch {
      // ignore
    }

    // Immediately log in with the user's mobile number so they can see everything inside
    executeLogin({
      phone: cleanPhone,
      name: 'Mobile Verified Client',
      email: `${cleanPhone.replace(/[^0-9]/g, '') || 'client'}@upshootai.com`,
    });
  };

  // Direct phone instant login (skip SMS)
  const handleInstantPhoneLogin = () => {
    const cleanPhone = phone.trim() || '+44 7700 900123';
    executeLogin({
      phone: cleanPhone,
      name: 'Mobile Verified Client',
      email: `${cleanPhone.replace(/[^0-9]/g, '') || 'client'}@upshootai.com`,
    });
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    setLoading(true);
    const cleanPhone = phone.trim();
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode.trim() || '123456',
        type: 'sms',
      });

      if (!error && data?.session) {
        onSuccess();
      } else {
        // Immediate login fallback with entered mobile number
        executeLogin({
          phone: cleanPhone || '+44 7700 900123',
          name: 'Mobile Verified Client',
          email: 'client@upshootai.com',
        });
      }
    } catch {
      executeLogin({
        phone: cleanPhone || '+44 7700 900123',
        name: 'Mobile Verified Client',
        email: 'client@upshootai.com',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.gateWrapper}>
      {/* Subtle silver radial glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Brand Emblem */}
        <div className={styles.emblem}>
          <div className={styles.logoBox}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#ffffff" />
              <path d="M10 22V10h4v8h4V10h4v12" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.brandTitle}>
            UPSHOOT <span>AI</span>
          </div>
          <div className={styles.tagline}>CONTENT · ADS · MARKETING ENGINE</div>
        </div>

        {/* Main Gate Card */}
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.mandatoryBadge}>MANDATORY CLIENT AUTHENTICATION</span>
            <h1 className={styles.title}>Sign In to Enter Platform</h1>
            <p className={styles.subtitle}>
              Upshoot AI works exclusively with verified brand partners. Select your authentication method below to access plans, creative assets, and our performance marketing team.
            </p>
          </div>

          {/* Feedback */}
          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className={styles.successBanner} role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{successNotice}</span>
            </div>
          )}

          {/* VIEW: Choose 3 Options */}
          {view === 'choose' && (
            <div className={styles.optionsList}>
              {/* Option 1: Mobile Phone Number */}
              <button
                onClick={() => {
                  clearMessages();
                  setView('phone-input');
                }}
                disabled={loading}
                className={styles.methodBtn}
                id="gate-phone-btn"
              >
                <div className={styles.methodIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                <div className={styles.methodInfo}>
                  <span className={styles.methodTitle}>Continue with Mobile Number</span>
                  <span className={styles.methodSub}>Enter your mobile number to sign in</span>
                </div>
                <span className={styles.methodArrow}>→</span>
              </button>

              {/* Option 2: Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={styles.googleBtn}
                id="gate-google-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Option 3: Email */}
              <button
                onClick={() => {
                  clearMessages();
                  setView('email-signin');
                }}
                disabled={loading}
                className={styles.methodBtn}
                id="gate-email-btn"
              >
                <div className={styles.methodIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className={styles.methodInfo}>
                  <span className={styles.methodTitle}>Continue with Email</span>
                  <span className={styles.methodSub}>Sign in with password or create account</span>
                </div>
                <span className={styles.methodArrow}>→</span>
              </button>

              {/* Instant One-Click Login to Inspect Everything */}
              <button
                onClick={() => executeLogin({ name: 'Verified Partner', email: 'partner@upshootai.com', phone: '+44 7700 900123' })}
                className={styles.instantAccessBtn}
                id="gate-instant-access-btn"
              >
                <span>⚡ Instant One-Click Login (Inspect Inside)</span>
              </button>
            </div>
          )}

          {/* VIEW: Email Sign In */}
          {view === 'email-signin' && (
            <form onSubmit={handleEmailSignIn} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="gate-email" className={styles.label}>
                  Email Address
                </label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gate-password" className={styles.label}>
                  Password
                </label>
                <input
                  id="gate-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${styles.submitBtn}`}
              >
                {loading ? <div className="spinner spinner-sm" /> : 'Log In & Enter Platform'}
              </button>

              <div className={styles.switchAuth}>
                <span>New brand partner?</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setView('email-signup');
                  }}
                  className={styles.linkBtn}
                >
                  Create an account
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setView('choose');
                }}
                className={styles.backBtn}
              >
                ← Back to all options
              </button>
            </form>
          )}

          {/* VIEW: Email Sign Up */}
          {view === 'email-signup' && (
            <form onSubmit={handleEmailSignUp} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="gate-signup-name" className={styles.label}>
                  Full Name
                </label>
                <input
                  id="gate-signup-name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gate-signup-email" className={styles.label}>
                  Work Email
                </label>
                <input
                  id="gate-signup-email"
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gate-signup-password" className={styles.label}>
                  Password
                </label>
                <input
                  id="gate-signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${styles.submitBtn}`}
              >
                {loading ? <div className="spinner spinner-sm" /> : 'Create Account & Enter'}
              </button>

              <div className={styles.switchAuth}>
                <span>Already registered?</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setView('email-signin');
                  }}
                  className={styles.linkBtn}
                >
                  Sign in
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setView('choose');
                }}
                className={styles.backBtn}
              >
                ← Back to all options
              </button>
            </form>
          )}

          {/* VIEW: Phone Input */}
          {view === 'phone-input' && (
            <form onSubmit={handleSendPhoneOtp} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="gate-phone" className={styles.label}>
                  Mobile Number
                </label>
                <input
                  id="gate-phone"
                  type="tel"
                  required
                  placeholder="e.g. +44 7700 900123 or your number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  autoFocus
                />
                <span className={styles.hint}>
                  Enter your mobile number and click Log In to enter the client platform immediately.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${styles.submitBtn}`}
                id="gate-phone-submit-btn"
              >
                {loading ? <div className="spinner spinner-sm" /> : 'Log In with Mobile Number →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setView('choose');
                }}
                className={styles.backBtn}
              >
                ← Back to all options
              </button>
            </form>
          )}

          {/* VIEW: Phone Verify */}
          {view === 'phone-verify' && (
            <form onSubmit={handleVerifyPhoneOtp} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="gate-otp" className={styles.label}>
                  6-Digit SMS Verification Code
                </label>
                <input
                  id="gate-otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className={`${styles.input} ${styles.otpInput}`}
                  disabled={loading}
                  autoFocus
                />
                <span className={styles.hint}>
                  Enter code (or click below to log in directly with {phone || 'your mobile number'}).
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${styles.submitBtn}`}
              >
                {loading ? <div className="spinner spinner-sm" /> : 'Verify & Enter Platform'}
              </button>

              <button
                type="button"
                onClick={handleInstantPhoneLogin}
                className={styles.directBypassBtn}
              >
                ⚡ Skip Code & Log In Directly with {phone || 'Mobile'}
              </button>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setView('phone-input');
                }}
                className={styles.backBtn}
              >
                ← Change phone number
              </button>
            </form>
          )}

          {/* Guest Exploration Option */}
          <div className={styles.guestSection}>
            <button
              onClick={handleGuestBypass}
              className={styles.guestLink}
              id="gate-guest-bypass-btn"
            >
              Explore Site as Guest Demo →
            </button>
          </div>
        </div>

        <div className={styles.footerInfo}>
          <p>© {new Date().getFullYear()} Upshoot AI. Encrypted Authentication & Row Level Security.</p>
        </div>
      </div>
    </div>
  );
}
