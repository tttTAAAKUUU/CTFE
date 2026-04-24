'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');

      sessionStorage.setItem('password_reset_email', email);
      router.push('/auth/reset-password');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight italic uppercase">Forgot Password</h1>
        <p className="text-sm text-white/40">
          Enter your email and we'll send you a reset code.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>}
        <AuthButton text={loading ? 'Sending...' : 'Send Reset Code'} disabled={loading || !email} />
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
