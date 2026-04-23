'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check, X, Shield, User as UserIcon, Lock, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import TwoFactorModal from '@/components/TwoFactorModal';

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();

  // Profile form
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // 2FA modals
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setUserName(user.userName || '');
    }
  }, [user]);

  // ─── Profile save ─────────────────────────────
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    const emailChanged = user && email !== user.email;
    const userNameChanged = user && userName !== user.userName;

    if (!emailChanged && !userNameChanged) {
      setProfileMsg({ type: 'err', text: 'No changes to save' });
      return;
    }

    if (emailChanged) {
      // Open the 2FA modal; actual save happens inside handleConfirmEmailChange
      setEmailModalOpen(true);
      return;
    }

    // Username-only change → save directly, no code needed
    saveProfile();
  };

  const saveProfile = async (code?: string) => {
    setProfileSaving(true);
    try {
      const payload: any = { email, username: userName };
      if (code) payload.code = code;
      await api.patch('/users/me', payload);
      await refreshUser();
      setProfileMsg({ type: 'ok', text: 'Profile updated' });
      setEmailModalOpen(false);
    } catch (err: any) {
      const text = err?.response?.data?.message || 'Failed to update profile';
      setProfileMsg({ type: 'err', text: Array.isArray(text) ? text.join(', ') : text });
      throw err; // surface to modal
    } finally {
      setProfileSaving(false);
    }
  };

  const handleConfirmEmailChange = async (code: string) => {
    await saveProfile(code);
  };

  // ─── Password change ──────────────────────────
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'err', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: 'err', text: 'New password must be at least 8 characters' });
      return;
    }
    setPasswordModalOpen(true);
  };

  const handleConfirmPasswordChange = async (code: string) => {
    setPwSaving(true);
    try {
      await api.patch('/users/me/password', {
        oldPassword,
        newPassword,
        code,
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwMsg({ type: 'ok', text: 'Password updated' });
      setPasswordModalOpen(false);
    } catch (err: any) {
      const text = err?.response?.data?.message || 'Failed to update password';
      setPwMsg({ type: 'err', text: Array.isArray(text) ? text.join(', ') : text });
      throw err;
    } finally {
      setPwSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-orange-500" size={40} />
      </div>
    );
  }

  const kycColors: Record<string, string> = {
    approved: 'bg-green-500/10 border-green-500/40 text-green-400',
    pending: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400',
    rejected: 'bg-red-500/10 border-red-500/40 text-red-400',
    none: 'bg-white/5 border-white/10 text-white/40',
  };

  return (
    <div className="space-y-10 pb-20 p-6 max-w-4xl">
      <header className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Account</p>
        <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter">Profile</h1>
      </header>

      {/* Verification */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-orange-500" />
          <h2 className="text-xl font-black italic uppercase">Verification</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Email</p>
              <p className="text-sm text-white mt-1 truncate">{user.email}</p>
            </div>
            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
              user.emailVerified
                ? 'bg-green-500/10 border-green-500/40 text-green-400'
                : 'bg-red-500/10 border-red-500/40 text-red-400'
            }`}>
              {user.emailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">KYC</p>
              <p className="text-sm text-white mt-1 capitalize">{user.kycStatus}</p>
            </div>
            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${kycColors[user.kycStatus] || kycColors.none}`}>
              {user.kycStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Account info form */}
      <form onSubmit={handleProfileSubmit} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <UserIcon size={20} className="text-orange-500" />
          <h2 className="text-xl font-black italic uppercase">Account Info</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              minLength={3}
              className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
              Email <span className="text-white/20 normal-case italic ml-1">(requires code)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {profileMsg && (
            <div className={`flex items-center gap-2 text-[11px] font-bold uppercase ${
              profileMsg.type === 'ok' ? 'text-green-400' : 'text-red-400'
            }`}>
              {profileMsg.type === 'ok' ? <Check size={14} /> : <AlertCircle size={14} />}
              {profileMsg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={profileSaving}
            className="ml-auto flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic bg-white text-black hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {profileSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Password form */}
      <form onSubmit={handlePasswordSubmit} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-orange-500" />
          <h2 className="text-xl font-black italic uppercase">
            Change Password <span className="text-white/20 text-xs normal-case italic ml-2">(requires code)</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {pwMsg && (
            <div className={`flex items-center gap-2 text-[11px] font-bold uppercase ${
              pwMsg.type === 'ok' ? 'text-green-400' : 'text-red-400'
            }`}>
              {pwMsg.type === 'ok' ? <Check size={14} /> : <X size={14} />}
              {pwMsg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={pwSaving}
            className="ml-auto flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic bg-white text-black hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {pwSaving ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
            Update Password
          </button>
        </div>
      </form>

      {/* 2FA Modals */}
      <TwoFactorModal
        open={emailModalOpen}
        action="change-email"
        onConfirm={handleConfirmEmailChange}
        onClose={() => setEmailModalOpen(false)}
      />
      <TwoFactorModal
        open={passwordModalOpen}
        action="change-password"
        onConfirm={handleConfirmPasswordChange}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
