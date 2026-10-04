'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import styles from './Contact.module.css';

interface ContactProps {
  user?: User | null;
  userProfile?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  onSignIn?: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact({ user, userProfile, onSignIn }: ContactProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Prefill when userProfile or user becomes available
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || userProfile.name || '',
        email: prev.email || userProfile.email || '',
        phone: prev.phone || userProfile.phone || '',
      }));
    } else if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        name: prev.name || (user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''),
        phone: prev.phone || (user.phone ?? ''),
      }));
    }
  }, [user, userProfile]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneDigits = formData.phone.replace(/[\s\-\(\)\+]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 7 || phoneDigits.length > 16) {
      newErrors.phone = 'Please enter a valid phone number (7-16 digits)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Project details are required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a bit more detail (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          userId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setStatusMessage(
          data.message ||
            'Your brief has been submitted successfully to Upshootai@gmail.com. We will respond within 24 hours.'
        );
        // Reset message but keep contact info
        setFormData((prev) => ({ ...prev, message: '' }));
      } else {
        setSubmitStatus('error');
        setStatusMessage(
          data.error || 'Failed to submit inquiry. Please try again or email Upshootai@gmail.com directly.'
        );
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage('Network error. Please try again or email Upshootai@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.badgeWrapper}>
            <div className="badge">
              <span className="badgeDot" />
              <span>Start a Conversation</span>
            </div>
          </div>
          <h2 className={styles.title}>
            Direct agency contact.
          </h2>
          <p className={styles.subtitle}>
            Submit your project brief below. All inquiries are delivered directly to our Senior Strategy Team at <strong>Upshootai@gmail.com</strong> with a guaranteed 24-hour response SLA.
          </p>
        </div>

        <div className={styles.wrapper}>
          {/* Left Column: What happens next */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>What happens next?</h3>
              <ul className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <div className={styles.stepNum}>1</div>
                  <div>
                    <h4 className={styles.stepHeading}>Discovery & Creative Audit</h4>
                    <p className={styles.stepDesc}>We review your brand assets, existing ad spend, and current ROAS bottlenecks.</p>
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNum}>2</div>
                  <div>
                    <h4 className={styles.stepHeading}>Tailored Growth Proposal</h4>
                    <p className={styles.stepDesc}>We match your goals with Instant, Business, or Exclusive packages.</p>
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNum}>3</div>
                  <div>
                    <h4 className={styles.stepHeading}>48-Hour Rapid Kickoff</h4>
                    <p className={styles.stepDesc}>Creative strategy mapped, assets drafted, and ad campaigns prepped for launch.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <div className={styles.detailLabel}>Direct Team Email</div>
                  <div className={styles.detailValue}>
                    <a href="mailto:Upshootai@gmail.com">
                      Upshootai@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className={styles.detailLabel}>Response Time</div>
                  <div className={styles.detailValue}>Under 24 hours guaranteed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Inquiry Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Initiate Project Brief</h3>
              <p className={styles.formSubtitle}>
                Fill in your details below. Direct strategy assignment upon receipt.
              </p>

              {submitStatus === 'success' && (
                <div className={`${styles.banner} ${styles.bannerSuccess}`} role="alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{statusMessage}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={`${styles.banner} ${styles.bannerError}`} role="alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-name" className={styles.label}>
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Alex Rivers"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-email" className={styles.label}>
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="e.g. alex@brand.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact-phone" className={styles.label}>
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. +44 7700 900123"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-message" className={styles.label}>
                    Project Scope / Growth Requirements *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us about your brand, current challenges, ad channels, target audience, or the package you're interested in..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                  id="contact-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner spinner-sm" />
                      <span>Sending to Strategy Team...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Project Brief</span>
                      <span className="btnArrow">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
