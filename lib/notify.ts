/**
 * Utility to notify Upshootai@gmail.com of any user login, registration, or interaction
 */
export async function notifyUserDetails(payload: {
  name?: string;
  email?: string;
  phone?: string;
  userId?: string;
  action?: string;
  details?: Record<string, any>;
}) {
  try {
    const res = await fetch('/api/notify-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.warn('Silent user notification log:', err);
    return null;
  }
}
