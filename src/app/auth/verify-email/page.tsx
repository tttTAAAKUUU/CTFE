'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('pending_verification_email');
    if (!storedEmail) {
      router.push('/auth/signup'); // Redirect back if no email found
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight italic uppercase">Verify Identity</h1>
        <p className="text-sm text-white/40">Enter the code sent to <span className="text-white font-mono">{email}</span></p>
      </header>

      <form onSubmit={handleVerify} className="space-y-6">
        <AuthInput
          label="6-Digit Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        
        {error && <p className="text-red-500 text-center text-[10px] font-black uppercase tracking-widest">{error}</p>}
        
        <AuthButton text={loading ? 'Authorizing...' : 'Verify & Enter Dashboard'} disabled={loading} />

        <button 
          type="button"
          className="w-full text-[10px] text-white/30 hover:text-white transition uppercase font-black tracking-[0.2em]"
        >
          Resend Code
        </button>
      </form>
    </div>
  );
}