'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

interface BackendStatus {
  status: string;
  timestamp: string;
  backend: {
    framework: string;
    database: {
      status: string;
      engine: string;
      storageFile: string;
      totalProfiles: number;
      totalInquiries: number;
      activeSessions: number;
      totalActivityLogs: number;
      remoteSupabaseConfigured: boolean;
    };
    features: {
      persistentLocalStorage: boolean;
      atomicFileLocking: boolean;
      supabaseCloudAdapter: boolean;
      msg91SmsGateway: boolean;
      emailNotifications: boolean;
    };
  };
  tables: {
    profiles: {
      count: number;
      recent: Array<{
        id: string;
        name: string;
        email: string;
        phone: string;
        auth_provider?: string;
        verified?: boolean;
        created_at: string;
      }>;
    };
    contact_inquiries: {
      count: number;
      recent: Array<{
        id: string;
        name: string;
        email: string;
        phone: string;
        message: string;
        created_at: string;
      }>;
    };
  };
}

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  const [backendData, setBackendData] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'profiles' | 'msg91' | 'terminal'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // MSG91 Tester
  const [testPhone, setTestPhone] = useState('+91 9876543210');
  const [testOtp, setTestOtp] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [smsVerifying, setSmsVerifying] = useState(false);
  const [smsResult, setSmsResult] = useState<{ success: boolean; message: string } | null>(null);

  // Check existing session on mount
  useEffect(() => {
    const saved = localStorage.getItem('upshoot_admin_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === 'upshoot2026' || pin.trim() === 'Upshootai@gmail.com' || pin.trim() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('upshoot_admin_auth', 'true');
      setPinError('');
      fetchDashboardData();
    } else {
      setPinError('Invalid Admin Passcode. Please enter the authorized passcode.');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('upshoot_admin_auth');
    setPin('');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backend/status');
      if (res.ok) {
        const json = await res.json();
        setBackendData(json);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestSms = async () => {
    setSmsSending(true);
    setSmsResult(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: testPhone }),
      });
      const data = await res.json();
      setSmsResult({
        success: res.ok && data.success,
        message: data.message || (data.success ? 'OTP sent successfully!' : 'Failed to send OTP.'),
      });
    } catch (e: any) {
      setSmsResult({ success: false, message: e.message });
    } finally {
      setSmsSending(false);
    }
  };

  const handleVerifyTestSms = async () => {
    setSmsVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: testPhone,
          otp: testOtp,
          name: 'Admin Tester Mobile',
        }),
      });
      const data = await res.json();
      setSmsResult({
        success: res.ok && data.success,
        message: res.ok && data.success
          ? '🎉 Mobile verified and stored in database profiles!'
          : (data.message || 'OTP verification failed.'),
      });
      if (res.ok && data.success) {
        await fetchDashboardData();
      }
    } catch (e: any) {
      setSmsResult({ success: false, message: e.message });
    } finally {
      setSmsVerifying(false);
    }
  };

  const dbStats = backendData?.backend?.database;

  // Filtered inquiries
  const inquiries = backendData?.tables?.contact_inquiries?.recent || [];
  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered profiles
  const profiles = backendData?.tables?.profiles?.recent || [];
  const filteredProfiles = profiles.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandArea}>
            <Link href="/" aria-label="Go to Website">
              <img
                src="/images/upshoot-logo.jpg"
                alt="Upshoot AI Logo"
                className={styles.logoImg}
              />
            </Link>
            <div className={styles.adminBadge}>
              <span className="badgeDot" style={{ background: '#10B981', width: '6px', height: '6px' }} />
              <span>Admin Portal</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
              ← Return to Live Website
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', color: '#dc2626' }}
              >
                Lock Portal
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.content}>
        {!isAuthenticated ? (
          /* Security Gate */
          <div className={styles.gateCard}>
            <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#f5f5f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                🔒
              </div>
            </div>

            <div>
              <h1 className={styles.gateTitle}>Upshoot AI Admin Control</h1>
              <p className={styles.gateSubtitle}>
                Protected administrator portal. Please enter your administrator passcode to access backend records, inquiries, and API settings.
              </p>
            </div>

            <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter Admin Passcode"
                className={styles.pinInput}
                autoFocus
              />
              {pinError && (
                <div style={{ color: '#dc2626', fontSize: '0.825rem', fontWeight: 500 }}>
                  {pinError}
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Unlock Admin Dashboard
              </button>
            </form>

            <div style={{ fontSize: '0.75rem', color: '#86868b' }}>
              Default Admin Access Key: <code>upshoot2026</code>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <>
            {/* Top Metrics Row */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Storage Engine</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="badgeDot" style={{ background: '#10B981' }} />
                  Persistent Local File
                </span>
                <span className={styles.metricMeta}>
                  <code>data/upshoot_database.json</code>
                </span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Contact Inquiries</span>
                <span className={styles.metricVal}>{dbStats?.totalInquiries ?? 0}</span>
                <span className={styles.metricMeta}>
                  Delivered to <strong>Upshootai@gmail.com</strong>
                </span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Client Profiles</span>
                <span className={styles.metricVal}>{dbStats?.totalProfiles ?? 0}</span>
                <span className={styles.metricMeta}>
                  {dbStats?.activeSessions ?? 0} Active Authenticated Sessions
                </span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>MSG91 SMS Gateway</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111111' }}>
                  SendOTP v5
                </span>
                <span className={styles.metricMeta}>
                  6-digit secure verification active
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={styles.tabsContainer}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
              >
                System Overview & Health
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`${styles.tabBtn} ${activeTab === 'inquiries' ? styles.tabBtnActive : ''}`}
              >
                Inquiries Database ({dbStats?.totalInquiries ?? 0})
              </button>
              <button
                onClick={() => setActiveTab('profiles')}
                className={`${styles.tabBtn} ${activeTab === 'profiles' ? styles.tabBtnActive : ''}`}
              >
                Client Profiles ({dbStats?.totalProfiles ?? 0})
              </button>
              <button
                onClick={() => setActiveTab('msg91')}
                className={`${styles.tabBtn} ${activeTab === 'msg91' ? styles.tabBtnActive : ''}`}
              >
                MSG91 SMS Tester
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`${styles.tabBtn} ${activeTab === 'terminal' ? styles.tabBtnActive : ''}`}
              >
                Terminal Output Preview
              </button>
            </div>

            {/* Tab 1: System Overview */}
            {activeTab === 'overview' && (
              <div className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Backend Architecture Status</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6e6e73' }}>
                      Detailed inspection of current storage, cloud connectors, and delivery pipelines.
                    </p>
                  </div>
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {loading ? 'Refreshing...' : '↻ Refresh Status'}
                  </button>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600, width: '280px' }}>Backend Runtime</td>
                        <td>{backendData?.backend?.framework || 'Next.js 16.3.8 Full-Stack Engine'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Database Engine</td>
                        <td>{dbStats?.engine || 'Persistent Atomic Local Storage + Supabase Adapter'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Database File Location</td>
                        <td><code>{dbStats?.storageFile || 'data/upshoot_database.json'}</code></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Target Notification Email</td>
                        <td><span style={{ color: '#059669', fontWeight: 600 }}>Upshootai@gmail.com</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Supabase Postgres Cloud Sync</td>
                        <td>
                          {dbStats?.remoteSupabaseConfigured ? (
                            <span style={{ color: '#059669', fontWeight: 600 }}>● Connected & Active</span>
                          ) : (
                            <span style={{ color: '#6e6e73' }}>Local-First (Cloud credentials optional in .env.local)</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Total Activity Logs</td>
                        <td>{dbStats?.totalActivityLogs || 0} events recorded</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Inquiries Database */}
            {activeTab === 'inquiries' && (
              <div className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Contact Inquiries Database</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6e6e73' }}>
                      Stored from the website contact brief form directly into <code>data/upshoot_database.json</code>.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or details..."
                    style={{ padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid #d1d1d6', fontSize: '0.85rem', minWidth: '260px' }}
                  />
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Client Name</th>
                        <th>Contact Email</th>
                        <th>Phone</th>
                        <th>Project Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#86868b' }}>
                            No inquiries found matching your query.
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td style={{ whiteSpace: 'nowrap', color: '#6e6e73', fontSize: '0.8rem' }}>
                              {new Date(inq.created_at).toLocaleString()}
                            </td>
                            <td style={{ fontWeight: 600 }}>{inq.name}</td>
                            <td>
                              <a href={`mailto:${inq.email}`} style={{ color: '#0071e3', textDecoration: 'none' }}>
                                {inq.email}
                              </a>
                            </td>
                            <td>{inq.phone}</td>
                            <td style={{ maxWidth: '380px', lineHeight: 1.5 }}>{inq.message}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Profiles Database */}
            {activeTab === 'profiles' && (
              <div className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Registered Client Profiles</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6e6e73' }}>
                      Users authenticated via Google OAuth or MSG91 Mobile OTP.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search profiles..."
                    style={{ padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid #d1d1d6', fontSize: '0.85rem', minWidth: '260px' }}
                  />
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Joined</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Auth Provider</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#86868b' }}>
                            No profiles found.
                          </td>
                        </tr>
                      ) : (
                        filteredProfiles.map((p) => (
                          <tr key={p.id}>
                            <td style={{ whiteSpace: 'nowrap', color: '#6e6e73', fontSize: '0.8rem' }}>
                              {new Date(p.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ fontWeight: 600 }}>{p.name || 'Anonymous User'}</td>
                            <td>{p.email || 'N/A'}</td>
                            <td>{p.phone || 'N/A'}</td>
                            <td>
                              <span className="badge" style={{ fontSize: '0.72rem' }}>
                                {p.auth_provider || 'email'}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: p.verified ? '#059669' : '#dc2626', fontWeight: 600 }}>
                                {p.verified ? '✓ Verified' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: MSG91 SMS Tester */}
            {activeTab === 'msg91' && (
              <div className={styles.cardSection}>
                <div>
                  <h2 className={styles.sectionTitle}>MSG91 SMS Gateway Testing Sandbox</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6e6e73', marginTop: '0.25rem' }}>
                    Send an OTP to any mobile number to test the MSG91 SendOTP API pipeline.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                      type="tel"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d1d6', fontSize: '0.9rem' }}
                    />
                    <button
                      onClick={handleSendTestSms}
                      disabled={smsSending}
                      className="btn btn-secondary"
                      style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.25rem' }}
                    >
                      {smsSending ? 'Sending SMS...' : '📤 Send OTP'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={testOtp}
                      onChange={(e) => setTestOtp(e.target.value)}
                      placeholder="6-digit code"
                      style={{ width: '160px', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d1d6', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.15em', textAlign: 'center' }}
                    />
                    <button
                      onClick={handleVerifyTestSms}
                      disabled={smsVerifying || !testOtp}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.75rem 1.25rem' }}
                    >
                      {smsVerifying ? 'Verifying...' : '✓ Verify Code'}
                    </button>
                  </div>

                  {smsResult && (
                    <div
                      style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        background: smsResult.success ? '#ecfdf5' : '#fef2f2',
                        border: `1px solid ${smsResult.success ? '#10b981' : '#ef4444'}`,
                        color: smsResult.success ? '#065f46' : '#991b1b',
                      }}
                    >
                      {smsResult.message}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: Terminal Output Preview */}
            {activeTab === 'terminal' && (
              <div className={styles.cardSection}>
                <div>
                  <h2 className={styles.sectionTitle}>Server Terminal Dispatch Logging Format</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6e6e73', marginTop: '0.25rem' }}>
                    Real-time terminal output emitted whenever a client signs in or submits a project inquiry.
                  </p>
                </div>

                <div className={styles.terminalBox}>
{`====================================================
🔔 [UPSHOOT AI] USER LOGIN & ACTIVITY NOTIFICATION
Action:     Client Successfully Verified Mobile via MSG91 SMS OTP
Name:       Verified Mobile Client
Email:      client.3210@upshootai.com
Phone:      +91 98765 43210
User ID:    msg91_verified_919876543210
Time:       ${new Date().toUTCString()}
Recipient:  Upshootai@gmail.com
====================================================`}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
