'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('password_reset_email');
    if (stored) setEmail(stored);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');

      sessionStorage.removeItem('password_reset_email');
      setInfo('Password reset. Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight italic uppercase">Reset Password</h1>
        <p className="text-sm text-white/40">
          Enter the 6-digit code we sent to {email ? <span className="text-white font-mono">{email}</span> : 'your email'} and choose a new password.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="6-Digit Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
        <AuthInput
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>}
        {info && <p className="text-green-400 text-xs font-bold uppercase tracking-tighter">{info}</p>}

        <AuthButton
          text={loading ? 'Resetting...' : 'Reset Password'}
          disabled={loading || code.length !== 6 || !newPassword || !confirmPassword}
        />
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
