'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function KycForm() {
  // Local state for form inputs
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    addressLine1: '',
    city: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Update form state dynamically
   * name attribute matches object keys
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send KYC info to backend
      await api.post('/users/kyc', form);

      // Refresh page to re-check kycStatus
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'KYC failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black rounded-2xl p-8 w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-semibold">Verify your identity</h1>

        <input
          name="firstName"
          placeholder="First name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="lastName"
          placeholder="Last name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="dateOfBirth"
          type="date"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="addressLine1"
          placeholder="Address"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
}
