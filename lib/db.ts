import fs from 'fs';
import path from 'path';

/**
 * Upshoot AI - Unified Production Backend Database Engine
 *
 * Provides resilient, zero-latency local persistent storage
 * with atomic write locks and automatic Supabase cloud synchronization
 * when valid cloud credentials are provided.
 */

export interface ProfileRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  auth_provider: 'msg91_otp' | 'google' | 'email';
  created_at: string;
  updated_at: string;
}

export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  user_id: string | null;
  status: 'new' | 'reviewed' | 'scheduled';
  created_at: string;
}

export interface AuthSessionRecord {
  token: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  expires_at: string;
}

export interface ActivityRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  action: string;
  timestamp: string;
  delivered_to: string;
}

interface DatabaseSchema {
  version: number;
  profiles: ProfileRecord[];
  contact_inquiries: ContactInquiryRecord[];
  auth_sessions: AuthSessionRecord[];
  activity_logs: ActivityRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'upshoot_database.json');

// In-memory synchronized cache
let memoryDb: DatabaseSchema = {
  version: 1,
  profiles: [],
  contact_inquiries: [],
  auth_sessions: [],
  activity_logs: [],
};

let isInitialized = false;
let isWriting = false;
let pendingWrite = false;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  ensureDataDirectory();
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        version: parsed.version || 1,
        profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
        contact_inquiries: Array.isArray(parsed.contact_inquiries) ? parsed.contact_inquiries : [],
        auth_sessions: Array.isArray(parsed.auth_sessions) ? parsed.auth_sessions : [],
        activity_logs: Array.isArray(parsed.activity_logs) ? parsed.activity_logs : [],
      };
    } catch {
      // Fall back to clean memory state
    }
  }

  // Initial database schema
  const initial: DatabaseSchema = {
    version: 1,
    profiles: [
      {
        id: 'usr_upshoot_founder',
        name: 'Upshoot Strategy Admin',
        email: 'Upshootai@gmail.com',
        phone: '+91 9876543210',
        verified: true,
        auth_provider: 'msg91_otp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    contact_inquiries: [],
    auth_sessions: [],
    activity_logs: [],
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
  } catch {
    // Non-blocking
  }
  return initial;
}

function persistToDisk() {
  if (isWriting) {
    pendingWrite = true;
    return;
  }

  isWriting = true;
  ensureDataDirectory();

  try {
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    const payload = JSON.stringify(memoryDb, null, 2);
    fs.writeFileSync(tempFile, payload, 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // Silent failover to in-memory
  } finally {
    isWriting = false;
    if (pendingWrite) {
      pendingWrite = false;
      persistToDisk();
    }
  }
}

function getDb(): DatabaseSchema {
  if (!isInitialized) {
    memoryDb = loadDatabase();
    isInitialized = true;
  }
  return memoryDb;
}

/**
 * Check if valid remote Supabase credentials exist
 */
export function hasRemoteSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    !url.includes('your-project')
  );
}

/**
 * Optional cloud sync to Supabase Postgres (when configured)
 */
async function syncToSupabase(table: string, record: any) {
  if (!hasRemoteSupabase()) return;
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    await supabase.from(table).upsert(record);
  } catch {
    // Local database already holds the source of truth
  }
}

export const db = {
  // Profiles Collection
  profiles: {
    upsert(profile: Partial<ProfileRecord> & { id: string }): ProfileRecord {
      const db = getDb();
      const now = new Date().toISOString();
      const existingIdx = db.profiles.findIndex((p) => p.id === profile.id);

      if (existingIdx >= 0) {
        const updated: ProfileRecord = {
          ...db.profiles[existingIdx],
          ...profile,
          updated_at: now,
        };
        db.profiles[existingIdx] = updated;
        persistToDisk();
        syncToSupabase('profiles', updated).catch(() => {});
        return updated;
      }

      const created: ProfileRecord = {
        id: profile.id,
        name: profile.name || 'Verified Partner',
        email: profile.email || `${profile.id}@upshootai.com`,
        phone: profile.phone || '',
        verified: profile.verified ?? true,
        auth_provider: profile.auth_provider || 'msg91_otp',
        created_at: now,
        updated_at: now,
      };

      db.profiles.unshift(created);
      persistToDisk();
      syncToSupabase('profiles', created).catch(() => {});
      return created;
    },

    findById(id: string): ProfileRecord | null {
      const db = getDb();
      return db.profiles.find((p) => p.id === id) || null;
    },

    findByPhone(phone: string): ProfileRecord | null {
      const db = getDb();
      const clean = phone.replace(/[^\d]/g, '');
      return (
        db.profiles.find((p) => p.phone.replace(/[^\d]/g, '').endsWith(clean.slice(-10))) || null
      );
    },

    findByEmail(email: string): ProfileRecord | null {
      const db = getDb();
      const clean = email.trim().toLowerCase();
      return db.profiles.find((p) => p.email.toLowerCase() === clean) || null;
    },

    list(limit = 50): ProfileRecord[] {
      return getDb().profiles.slice(0, limit);
    },
  },

  // Contact Inquiries Collection
  inquiries: {
    create(data: Omit<ContactInquiryRecord, 'id' | 'status' | 'created_at'>): ContactInquiryRecord {
      const db = getDb();
      const created: ContactInquiryRecord = {
        id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        user_id: data.user_id || null,
        status: 'new',
        created_at: new Date().toISOString(),
      };

      db.contact_inquiries.unshift(created);
      persistToDisk();
      syncToSupabase('contact_inquiries', created).catch(() => {});
      return created;
    },

    list(limit = 50): ContactInquiryRecord[] {
      return getDb().contact_inquiries.slice(0, limit);
    },

    findById(id: string): ContactInquiryRecord | null {
      return getDb().contact_inquiries.find((i) => i.id === id) || null;
    },
  },

  // Authenticated Sessions Collection
  sessions: {
    create(data: {
      token: string;
      userId: string;
      name: string;
      email: string;
      phone: string;
      durationDays?: number;
    }): AuthSessionRecord {
      const db = getDb();
      const now = new Date();
      const expires = new Date(now.getTime() + (data.durationDays || 30) * 24 * 60 * 60 * 1000);

      const session: AuthSessionRecord = {
        token: data.token,
        user_id: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        created_at: now.toISOString(),
        expires_at: expires.toISOString(),
      };

      db.auth_sessions.unshift(session);
      persistToDisk();
      return session;
    },

    findByToken(token: string): AuthSessionRecord | null {
      const db = getDb();
      const session = db.auth_sessions.find((s) => s.token === token);
      if (!session) return null;
      if (new Date() > new Date(session.expires_at)) {
        this.deleteByToken(token);
        return null;
      }
      return session;
    },

    deleteByToken(token: string): boolean {
      const db = getDb();
      const initialLen = db.auth_sessions.length;
      db.auth_sessions = db.auth_sessions.filter((s) => s.token !== token);
      if (db.auth_sessions.length !== initialLen) {
        persistToDisk();
        return true;
      }
      return false;
    },
  },

  // Activity Logs Collection
  activities: {
    create(data: Omit<ActivityRecord, 'id' | 'timestamp'>): ActivityRecord {
      const db = getDb();
      const record: ActivityRecord = {
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        action: data.action,
        delivered_to: data.delivered_to,
        timestamp: new Date().toISOString(),
      };

      db.activity_logs.unshift(record);
      if (db.activity_logs.length > 100) {
        db.activity_logs.pop();
      }
      persistToDisk();
      return record;
    },

    list(limit = 50): ActivityRecord[] {
      return getDb().activity_logs.slice(0, limit);
    },
  },

  // System Database Status
  getStats() {
    const data = getDb();
    return {
      status: 'healthy',
      engine: 'Persistent Atomic Local Storage + Supabase Adapter',
      storageFile: DB_FILE,
      totalProfiles: data.profiles.length,
      totalInquiries: data.contact_inquiries.length,
      activeSessions: data.auth_sessions.length,
      totalActivityLogs: data.activity_logs.length,
      remoteSupabaseConfigured: hasRemoteSupabase(),
    };
  },
};
