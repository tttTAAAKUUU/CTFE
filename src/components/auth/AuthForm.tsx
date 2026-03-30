'use client';

import { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-sm px-6">
      <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
      <p className="text-white/60 mb-8 text-sm">
        Access your wallet and positions
      </p>

      <form className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full bg-black border border-white/20 rounded-md
              px-4 py-3 text-white
              focus:outline-none focus:border-blue-500
            "
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full bg-black border border-white/20 rounded-md
              px-4 py-3 text-white
              focus:outline-none focus:border-blue-500
            "
          />
        </div>

        <button
          type="submit"
          className="
            w-full bg-blue-500 hover:bg-blue-400
            text-black font-medium
            py-3 rounded-md transition
          "
        >
          Continue
        </button>
      </form>

      <p className="text-xs text-white/40 mt-6">
        By continuing, you agree to the platform terms.
      </p>
    </div>
  );
}
