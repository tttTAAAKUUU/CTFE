'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Mail, Check } from 'lucide-react';
import { api } from '@/lib/api';

type Action = 'change-password' | 'change-email';

interface TwoFactorModalProps {
  open: boolean;
  action: Action;
  onConfirm: (code: string) => Promise<void>;
  onClose: () => void;
}

export default function TwoFactorModal({
  open,
  action,
  onConfirm,
  onClose,
}: TwoFactorModalProps) {
  const [code, setCode] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [hasSent, setHasSent] = useState(false);

  const actionLabel = action === 'change-password' ? 'change your password' : 'change your email';

  useEffect(() => {
    if (open && !hasSent) {
      sendCode();
    }
    if (!open) {
      setCode('');
      setError('');
      setInfo('');
      setHasSent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function sendCode() {
    setRequesting(true);
    setError('');
    setInfo('');
    try {
      await api.post('/auth/2fa/request-action-code', { action });
      setInfo('Code sent to your email');
      setHasSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send code');
    } finally {
      setRequesting(false);
    }
  }

  async function handleConfirm() {
    if (code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onConfirm(code);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Invalid code');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/30 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30">
            <Mail size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Verification</p>
            <h2 className="text-xl font-black italic uppercase text-white">
              Confirm {action === 'change-password' ? 'Password Change' : 'Email Change'}
            </h2>
          </div>
        </div>

        <p className="text-sm text-white/40">
          For security, we sent a 6-digit code to your email. Enter it below to {actionLabel}.
        </p>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
            6-Digit Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-2xl font-mono tracking-[0.5em] text-center text-white outline-none focus:border-orange-500 transition-colors"
            placeholder="000000"
            autoFocus
          />
        </div>

        {info && (
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-green-400">
            <Check size={14} /> {info}
          </div>
        )}
        {error && (
          <div className="text-[11px] font-bold uppercase text-red-400">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={sendCode}
            disabled={requesting}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase italic text-white/60 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            {requesting ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Resend Code'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || code.length !== 6}
            className="flex-1 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase italic hover:bg-orange-500 hover:text-white transition active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
