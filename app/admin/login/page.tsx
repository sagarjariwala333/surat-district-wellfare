'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.push('/admin');
        // router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="glass-card animate-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '3rem 2.5rem',
        zIndex: 1,
        borderRadius: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>Admin Portal</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>Surat District Court Advocate Welfare Fund</p>
        </div>

        {error && (
          <div className="animate-in" style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            padding: '0.875rem 1rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Username</label>
            <div className="input-wrapper">
              <span className="icon-left">
                <User size={18} color="#000" />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                autoComplete="username"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Password</label>
            <div className="input-wrapper">
              <span className="icon-left">
                <Lock size={18} color="#000" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                }}
              />
              <button
                type="button"
                className="icon-right"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <a href="#" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', height: '3.25rem', background: 'var(--primary)', color: '#fff' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="animate-spin" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.415, 31.415" strokeLinecap="round" style={{ opacity: 0.25 }} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }} />
                </svg>
                Authenticating...
              </span>
            ) : 'Secure Login'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            &copy; {new Date().getFullYear()} Surat District Court Welfare. <br /> All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

