'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { getDeviceToken } from '@/lib/device';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const deviceToken = getDeviceToken();

      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          deviceToken: deviceToken || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.requires2FA) {
        sessionStorage.setItem('2fa_temp_token', data.tempToken);
        sessionStorage.setItem('2fa_email', email);
        router.push('/auth/2fa');
        return;
      }

      await login(data.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleLogin} className="space-y-5">
        <AuthInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition"
          >
            Forgot password?
          </Link>
        </div>
        {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>}
        <AuthButton text={loading ? 'Signing in...' : 'Sign In'} disabled={loading} />
      </form>
    </div>
  );
}
