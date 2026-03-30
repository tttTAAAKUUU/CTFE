'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      // Save token (JWT)
      localStorage.setItem('token', data.access_token);
      // Save email in session storage just for the verification screen to use
      sessionStorage.setItem('pending_verification_email', email);
      
      router.push('/auth/verify-email');
    } catch (err: any) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight italic uppercase">Join the Arena</h1>
        <p className="text-sm text-white/40 font-medium">Create an account to start competing</p>
      </header>

      <form onSubmit={handleSignup} className="space-y-4">
        <AuthInput label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <AuthInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <AuthButton text={loading ? 'Initializing...' : 'Create Account'} disabled={loading} />
      </form>

      <footer className="text-center text-sm pt-4 border-t border-white/5">
        <span className="text-white/40">Already a member? </span>
        <Link href="/auth/login" className="text-white font-bold hover:underline underline-offset-4 transition">Log in</Link>
      </footer>
    </div>
  );
}