'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { setDeviceToken } from '@/lib/device';
import { useAuth } from '@/context/AuthContext';

export default function TwoFactorPage() {
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const t = sessionStorage.getItem('2fa_temp_token');
    const e = sessionStorage.getItem('2fa_email');
    if (!t) {
      router.replace('/auth/login');
    } else {
      setTempToken(t);
      if (e) setEmail(e);
    }
  }, [router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const res = await fetch('http://localhost:3001/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      if (data.deviceToken) setDeviceToken(data.deviceToken);

      sessionStorage.removeItem('2fa_temp_token');
      sessionStorage.removeItem('2fa_email');

      await login(data.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError('');
    setInfo('');
    try {
      const res = await fetch('http://localhost:3001/auth/2fa/resend-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend');
      setInfo('New code sent. Check your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight italic uppercase">Verify Login</h1>
        <p className="text-sm text-white/40">
          We sent a 6-digit code to {email ? <span className="text-white font-mono">{email}</span> : 'your email'}
        </p>
      </header>

      <form onSubmit={handleVerify} className="space-y-6">
        <AuthInput
          label="6-Digit Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />

        {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>}
        {info && <p className="text-green-400 text-xs font-bold uppercase tracking-tighter">{info}</p>}

        <AuthButton text={loading ? 'Verifying...' : 'Verify'} disabled={loading || code.length !== 6} />
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition disabled:opacity-50"
        >
          {resending ? 'Sending...' : 'Resend code'}
        </button>
        <div>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('2fa_temp_token');
              sessionStorage.removeItem('2fa_email');
              router.replace('/auth/login');
            }}
            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/50 transition"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
