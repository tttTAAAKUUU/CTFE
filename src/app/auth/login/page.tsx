'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save token and redirect
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard'); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleLogin} className="space-y-5">
        <AuthInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>}
        <AuthButton text="Sign In" />
      </form>
    </div>
  );
}