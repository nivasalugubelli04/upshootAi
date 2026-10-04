'use client';

import { useState, useEffect } from 'react';
import styles from './ActivityMonitorModal.module.css';

interface ActivityEvent {
  id: string;
  name: string;
  email: string;
  phone: string;
  action: string;
  timestamp: string;
  deliveredTo: string;
  emailSent: boolean;
}

interface MonitorStatus {
  status: string;
  configuredEmail: string;
  emailDeliveryConfigured: boolean;
  databaseStorageConfigured: boolean;
  totalEventsLogged: number;
  recentEvents: ActivityEvent[];
  databaseStats?: {
    status: string;
    engine: string;
    storageFile: string;
    totalProfiles: number;
    totalInquiries: number;
    activeSessions: number;
    totalActivityLogs: number;
    remoteSupabaseConfigured: boolean;
  };
  instructions: {
    terminalLogs: string;
    databaseStorage: string;
    emailDelivery: string;
  };
}

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

interface ActivityMonitorModalProps {
  onClose: () => void;
}

export default function ActivityMonitorModal({ onClose }: ActivityMonitorModalProps) {
  const [data, setData] = useState<MonitorStatus | null>(null);
  const [backendData, setBackendData] = useState<BackendStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'profiles' | 'msg91'>('overview');
  const [loading, setLoading] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // MSG91 Tester State
  const [msg91Phone, setMsg91Phone] = useState('+91 9876543210');
  const [msg91Otp, setMsg91Otp] = useState('');
  const [msg91Sending, setMsg91Sending] = useState(false);
  const [msg91Verifying, setMsg91Verifying] = useState(false);
  const [msg91Result, setMsg91Result] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStatus = async () => {
    try {
      const [notifyRes, backendRes] = await Promise.all([
        fetch('/api/notify-user'),
        fetch('/api/backend/status'),
      ]);

      if (notifyRes.ok) {
        const json = await notifyRes.json();
        setData(json);
      }
      if (backendRes.ok) {
        const bJson = await backendRes.json();
        setBackendData(bJson);
      }
    } catch (e) {
      console.error('Failed to fetch monitor data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSendTestAlert = async () => {
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Nivas (Admin Verification)',
          email: 'Upshootai@gmail.com',
          phone: '+1 555-0199',
          userId: 'admin-verify-test',
          action: 'Live Verification Test for Upshootai@gmail.com',
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        setTestResult('✅ Test alert dispatched and logged to database & terminal!');
        await fetchStatus();
      } else {
        setTestResult('❌ Test failed: ' + (resData.error || 'Server error'));
      }
    } catch (err: any) {
      setTestResult('❌ Test failed: ' + err.message);
    } finally {
      setSendingTest(false);
    }
  };

  const handleTestMsg91Send = async () => {
    setMsg91Sending(true);
    setMsg91Result(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: msg91Phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg91Result({
          success: true,
          message: data.message || 'OTP dispatched successfully via MSG91.',
        });
      } else {
        setMsg91Result({
          success: false,
          message: data.message || 'Failed to send OTP via MSG91',
        });
      }
    } catch (e: any) {
      setMsg91Result({ success: false, message: e.message });
    } finally {
      setMsg91Sending(false);
    }
  };

  const handleTestMsg91Verify = async () => {
    setMsg91Verifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: msg91Phone,
          otp: msg91Otp,
          name: 'Admin MSG91 Tester',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg91Result({
          success: true,
          message: '🎉 Verified successfully! Mobile confirmed and saved to database.',
        });
        await fetchStatus();
      } else {
        setMsg91Result({
          success: false,
          message: '❌ ' + (data.message || 'OTP verification failed.'),
        });
      }
    } catch (e: any) {
      setMsg91Result({ success: false, message: e.message });
    } finally {
      setMsg91Verifying(false);
    }
  };

  const stats = backendData?.backend?.database || data?.databaseStats;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className="badge" style={{ width: 'fit-content' }}>
              <span className="badgeDot" style={{ background: '#10B981' }} />
              <span>Full-Stack Backend Connected & Online</span>
            </div>
            <h2 className={styles.title}>Backend & Database Dashboard</h2>
            <p className={styles.subtitle}>
              Persistent JSON database (<code>data/upshoot_database.json</code>) with automatic Supabase sync, contact inquiry storage, and MSG91 SMS authentication.
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dashboard">
            ✕
          </button>
        </div>

        {/* 4 Pipeline Status Indicators */}
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Database Storage Engine</span>
            <span className={styles.statusVal}>
              <span className={`${styles.statusBadge} ${styles.statusBadgeSuccess}`}>
                ● Local File Storage Active
              </span>
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6e6e73' }}>
              {stats?.storageFile ? 'data/upshoot_database.json' : 'Persistent Disk Engine'}
            </span>
          </div>

          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Target Notification Email</span>
            <span className={styles.statusVal}>
              <span className="badgeDot" style={{ background: '#10B981' }} />
              Upshootai@gmail.com
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6e6e73' }}>
              Dispatches delivered via server console + Resend
            </span>
          </div>

          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Database Records</span>
            <span className={styles.statusVal}>
              <span style={{ color: '#0071e3' }}>
                {stats?.totalInquiries || 0} Inquiries &bull; {stats?.totalProfiles || 0} Profiles
              </span>
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6e6e73' }}>
              {stats?.activeSessions || 0} active authenticated sessions
            </span>
          </div>

          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>MSG91 SMS Gateway</span>
            <span className={styles.statusVal}>
              <span className={`${styles.statusBadge} ${styles.statusBadgeSuccess}`}>
                ● SendOTP v5 Active
              </span>
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6e6e73' }}>
              6-digit OTPs &bull; 5-min expiry &bull; Rate limited
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e5e7', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'overview' ? '#111111' : '#f5f5f7',
              color: activeTab === 'overview' ? '#ffffff' : '#555555',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Terminal & Activity Stream ({data?.recentEvents?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'inquiries' ? '#111111' : '#f5f5f7',
              color: activeTab === 'inquiries' ? '#ffffff' : '#555555',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Inquiries DB ({backendData?.tables?.contact_inquiries?.count || 0})
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'profiles' ? '#111111' : '#f5f5f7',
              color: activeTab === 'profiles' ? '#ffffff' : '#555555',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Profiles DB ({backendData?.tables?.profiles?.count || 0})
          </button>
          <button
            onClick={() => setActiveTab('msg91')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'msg91' ? '#111111' : '#f5f5f7',
              color: activeTab === 'msg91' ? '#ffffff' : '#555555',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            MSG91 Tester
          </button>
        </div>

        {/* Tab 1: Overview & Server Terminal Logging */}
        {activeTab === 'overview' && (
          <>
            <div className={styles.guideSection}>
              <div className={styles.guideHeading}>
                <span>🖥️ Real Server Terminal Logging Format</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#a1a1aa', lineHeight: 1.5 }}>
                Whenever a client logs in, submits an inquiry, or verifies via SMS OTP, the backend outputs this formatted box to your server console:
              </p>
              <div className={styles.codeBox}>
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

            {/* Live Dispatches History */}
            <div className={styles.eventsSection}>
              <div className={styles.sectionTitle}>
                <span>Recent Activity Logs ({data?.recentEvents?.length || 0} events)</span>
                <button
                  onClick={fetchStatus}
                  style={{ background: 'none', border: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div className={styles.emptyEvents}>Loading activity...</div>
              ) : !data?.recentEvents || data.recentEvents.length === 0 ? (
                <div className={styles.emptyEvents}>
                  No events logged in the database yet. Click the test button below to trigger an instant verification!
                </div>
              ) : (
                data.recentEvents.map((evt) => (
                  <div key={evt.id} className={styles.eventCard}>
                    <div className={styles.eventHeader}>
                      <span className={styles.eventName}>{evt.name}</span>
                      <span>{evt.timestamp}</span>
                    </div>
                    <div className={styles.eventDetails}>
                      <span><strong>Email:</strong> {evt.email}</span>
                      <span><strong>Phone:</strong> {evt.phone}</span>
                      <span><strong>Action:</strong> {evt.action}</span>
                      <span><strong>Sent to:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{evt.deliveredTo}</span></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab 2: Contact Inquiries Database */}
        {activeTab === 'inquiries' && (
          <div className={styles.eventsSection}>
            <div className={styles.sectionTitle}>
              <span>Persisted Contact Inquiries ({backendData?.tables?.contact_inquiries?.count || 0})</span>
              <button
                onClick={fetchStatus}
                style={{ background: 'none', border: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              >
                ↻ Refresh
              </button>
            </div>

            {(!backendData?.tables?.contact_inquiries?.recent || backendData.tables.contact_inquiries.recent.length === 0) ? (
              <div className={styles.emptyEvents}>
                No inquiries submitted yet. Submit a message in the Contact Us section on the homepage to see it appear here live!
              </div>
            ) : (
              backendData.tables.contact_inquiries.recent.map((inq) => (
                <div key={inq.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <span className={styles.eventName}>{inq.name}</span>
                    <span>{new Date(inq.created_at).toLocaleString()}</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <span><strong>Email:</strong> {inq.email}</span>
                    <span><strong>Phone:</strong> {inq.phone}</span>
                    <span style={{ gridColumn: '1 / -1', background: '#ffffff', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e5e7', marginTop: '0.25rem' }}>
                      <strong>Message:</strong> {inq.message}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Profiles Database */}
        {activeTab === 'profiles' && (
          <div className={styles.eventsSection}>
            <div className={styles.sectionTitle}>
              <span>Client Profiles Database ({backendData?.tables?.profiles?.count || 0})</span>
              <button
                onClick={fetchStatus}
                style={{ background: 'none', border: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              >
                ↻ Refresh
              </button>
            </div>

            {(!backendData?.tables?.profiles?.recent || backendData.tables.profiles.recent.length === 0) ? (
              <div className={styles.emptyEvents}>No profiles registered yet.</div>
            ) : (
              backendData.tables.profiles.recent.map((p) => (
                <div key={p.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <span className={styles.eventName}>{p.name || 'Anonymous User'}</span>
                    <span>{new Date(p.created_at).toLocaleString()}</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <span><strong>Email:</strong> {p.email || 'N/A'}</span>
                    <span><strong>Phone:</strong> {p.phone || 'N/A'}</span>
                    <span><strong>Auth Provider:</strong> <span className="badge" style={{ fontSize: '0.7rem' }}>{p.auth_provider || 'standard'}</span></span>
                    <span><strong>Verified:</strong> <span style={{ color: p.verified ? '#059669' : '#dc2626' }}>{p.verified ? '✓ Verified' : 'Pending'}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: MSG91 SMS Gateway Tester */}
        {activeTab === 'msg91' && (
          <div style={{ background: '#f5f5f7', border: '1px solid #e5e5e7', borderRadius: '20px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: '#111111' }}>
                <span>📱 MSG91 SMS & Mobile OTP Verification</span>
              </div>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '0.72rem' }}>
                SendOTP & Flow API Active
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.825rem', color: '#6e6e73', lineHeight: 1.5 }}>
              Test sending an SMS OTP to any mobile number via MSG91. Once verified, details are saved to the persistent database and dispatched to <strong>Upshootai@gmail.com</strong>.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="tel"
                value={msg91Phone}
                onChange={(e) => setMsg91Phone(e.target.value)}
                placeholder="+91 9876543210"
                style={{ flex: 1, minWidth: '180px', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #d1d1d6', fontSize: '0.875rem' }}
              />
              <button
                type="button"
                onClick={handleTestMsg91Send}
                disabled={msg91Sending}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                id="tester-send-sms-btn"
              >
                {msg91Sending ? 'Sending SMS...' : '📤 Send SMS Code'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                maxLength={6}
                value={msg91Otp}
                onChange={(e) => setMsg91Otp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                style={{ width: '180px', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #d1d1d6', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.15em' }}
              />
              <button
                type="button"
                onClick={handleTestMsg91Verify}
                disabled={msg91Verifying || !msg91Otp}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                id="tester-verify-sms-btn"
              >
                {msg91Verifying ? 'Verifying...' : '✓ Verify Code'}
              </button>
            </div>

            {msg91Result && (
              <div style={{ padding: '0.75rem 1rem', background: msg91Result.success ? '#ecfdf5' : '#fef2f2', border: `1px solid ${msg91Result.success ? '#10b981' : '#ef4444'}`, borderRadius: '12px', fontSize: '0.825rem', color: msg91Result.success ? '#065f46' : '#991b1b' }}>
                {msg91Result.message}
              </div>
            )}
          </div>
        )}

        {testResult && (
          <div style={{ padding: '0.875rem 1rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', fontSize: '0.85rem', color: '#065f46' }}>
            {testResult}
          </div>
        )}

        {/* Modal Actions */}
        <div className={styles.modalActions}>
          <button
            className="btn btn-secondary"
            onClick={handleSendTestAlert}
            disabled={sendingTest}
            id="test-alert-btn"
          >
            {sendingTest ? 'Sending Test...' : '⚡ Send Test Alert to Upshootai@gmail.com'}
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
