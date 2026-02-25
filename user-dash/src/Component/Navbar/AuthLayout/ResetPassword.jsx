import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token') || params.get('resetToken');
    const e = params.get('email');
    if (t) setToken(t);
    if (e) setEmail(decodeURIComponent(e));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token || !email) {
      setError('Invalid reset link. Token or email missing.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`;

      const payload = { email, token, password };
      const { data } = await axios.post(url, payload);
      setMessage('your password updated successfully');
      // Clear form fields
      setPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Show success message only
  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50/50 p-6">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-700">Success!</h2>
          <p className="text-lg text-gray-700 mb-6">{message}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-500/20"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50/50 p-6">
      <div className="bg-white w-full max-w-lg p-12 rounded-[2.5rem] shadow-2xl border border-yellow-100">
        <h2 className="text-4xl font-black text-red-700 mb-8 uppercase tracking-tighter text-center">Reset Password</h2>
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email (hidden but kept for clarity) */}
          <input type="hidden" value={email} />

          <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">New Password</label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-yellow-50/50 border border-yellow-100 px-5 py-4 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold pr-12"
              placeholder="Create New Password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">Confirm Password</label>
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-yellow-50/50 border border-yellow-100 px-5 py-4 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold pr-12"
              placeholder="Confirm New Password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition shadow-xl shadow-red-500/30 disabled:opacity-50 transform active:scale-95">
              {loading ? 'Setting...' : 'Set New Password'}
            </button>
            <button type="button" onClick={() => navigate('/login')} className="w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-bold uppercase tracking-widest hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
