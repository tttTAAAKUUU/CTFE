'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function KycPage() {
  const { refreshUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.patch('/users/me/kyc/start', {
        firstName,
        lastName,
        dateOfBirth,
        addressLine1,
        city,
        country,
      });

      // 🔁 Sync user state
      await refreshUser();

      // 🚀 Redirect to Stripe
      window.location.href = res.data.verificationUrl;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'KYC failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black w-full max-w-md p-8 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Identity verification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="Address"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? 'Submitting...' : 'Continue to verification'}
          </button>
        </form>
      </div>
    </div>
  );
}
