'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { notifyUserDetails } from '@/lib/notify';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  user: User;
  onComplete: () => void;
  onClose: () => void;
}

export default function ProfileModal({ user, onComplete, onClose }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error: profileErr } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('id', user.id)
          .single();

        if (data && !profileErr) {
          setName(data.name || '');
          setEmail(data.email || user.email || '');
          setPhone(data.phone || user.phone || '');
        } else {
          // Pre-populate with auth metadata
          setName(
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            ''
          );
          setEmail(user.email ?? '');
          setPhone(user.phone ?? '');
        }
      } catch (err) {
        console.warn('Could not fetch existing profile:', err);
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [user, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    const phoneDigits = phone.replace(/[\s\-\(\)\+]/g, '');
    if (!phone.trim() || phoneDigits.length < 7 || phoneDigits.length > 16) {
      setError('Please provide a valid phone number (including country code).');
      return;
    }

    setLoading(true);

    try {
      const { error: upsertErr } = await supabase.from('profiles').upsert({
        id: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        updated_at: new Date().toISOString(),
      });

      if (upsertErr) {
        setError(upsertErr.message);
      } else {
        notifyUserDetails({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          userId: user.id,
          action: 'User Completed Profile Information',
        });
        onComplete();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Close profile setup modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className={styles.title}>Complete Your Profile</h2>
          <p className={styles.subtitle}>
            Please confirm your contact details so our team can coordinate your campaigns and send status updates.
          </p>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {fetching ? (
          <div className={styles.loadingContainer}>
            <div className="spinner spinner-md" />
            <p className={styles.loadingText}>Loading profile details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="profile-name" className={styles.label}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="profile-email" className={styles.label}>
                Email Address <span className={styles.required}>*</span>
              </label>
              <input
                id="profile-email"
                type="email"
                required
                placeholder="e.g. alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="profile-phone" className={styles.label}>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                id="profile-phone"
                type="tel"
                required
                placeholder="e.g. +44 7700 900123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                disabled={loading}
              />
              <span className={styles.hint}>
                Used by your dedicated account strategist to reach you for urgent ad approvals.
              </span>
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${styles.saveBtn}`}
              >
                {loading ? (
                  <>
                    <div className="spinner spinner-sm" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  'Save & Continue'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
