import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';

function normalizeUser(user) {
  return {
    name: user?.fullName || user?.full_name || user?.name || user?.username || '',
    role: user?.role || '',
    email: user?.email || '',
  };
}

export default function ProfilePage() {
  const { analytics, favorites } = useApp();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => normalizeUser(JSON.parse(localStorage.getItem('user') || '{}')));
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingProfile(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load profile');
        }

        if (!cancelled) {
          const nextProfile = normalizeUser(data.user);
          setProfile(nextProfile);
          localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            fullName: data.user.full_name,
            role: data.user.role,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          notify('Profile load failed', error.message, 'error');
        }
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [notify]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      notify('Not signed in', 'Please log in again before saving your profile.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profile.name.trim(),
          email: profile.email.trim(),
          role: profile.role.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      const updatedUser = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        fullName: data.user.full_name,
        role: data.user.role,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));
      setProfile(normalizeUser(updatedUser));
      notify('Profile saved', 'Your registered profile was updated in the database.');
    } catch (error) {
      notify('Profile save failed', error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    notify('Logged out', 'You have been successfully logged out.');

    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 500);
  };

  const initial = (profile.name || profile.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-accent-500 text-2xl font-bold text-white">
            {initial}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Account</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage the registered user profile saved in your database.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Full name</span>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={loadingProfile || saving}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Role</span>
            <input
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              disabled={loadingProfile || saving}
              placeholder="Product Manager"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-slate-500">Email</span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={loadingProfile || saving}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <Button onClick={handleSave} disabled={saving || loadingProfile} className="mt-6">
          {saving ? 'Saving...' : 'Save profile'}
        </Button>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Usage summary</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
            <p className="text-xs text-slate-500">Total chats</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{analytics.totalChats}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
            <p className="text-xs text-slate-500">Messages sent</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{analytics.totalMessages}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
            <p className="text-xs text-slate-500">Saved prompts</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{favorites.length}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Account management</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Manage your account settings and security options.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleLogout}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
