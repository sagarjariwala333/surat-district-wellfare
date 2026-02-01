'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validToken, setValidToken] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }
    
    // Verify token validity
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const res = await fetch('/api/user/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setValidToken(true);
      } else {
        setError('Invalid or expired reset token');
      }
    } catch (err) {
      setError('Failed to verify reset token');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login?message=Password reset successful. Please login with your new password.');
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || (!validToken && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient bg-cover bg-center relative overflow-hidden"
           style={{
             backgroundImage: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")'
           }}>
        <Card className="w-full max-w-md mx-4 bg-white/5 backdrop-blur-xl border-white/15 shadow-2xl">
          <CardContent className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-red-100/20 mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-white/70 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient bg-cover bg-center relative overflow-hidden"
           style={{
             backgroundImage: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")'
           }}>
        <Card className="w-full max-w-md mx-4 bg-white/5 backdrop-blur-xl border-white/15 shadow-2xl">
          <CardContent className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-green-100/20 mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-white/70 mb-4">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient bg-cover bg-center relative overflow-hidden"
         style={{
           backgroundImage: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")'
         }}>
      <Card className="w-full max-w-md mx-4 bg-white/5 backdrop-blur-xl border-white/15 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-xl bg-white/5 border border-white/10 mx-auto">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-white/70">
            Enter your new password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/30 animate-in fade-in-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPasswords.password ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('password')}
                  tabIndex={-1}
                >
                  {showPasswords.password ? (
                    <EyeOff className="h-4 w-4 text-white/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                  tabIndex={-1}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-white/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Resetting password...
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} Surat District Court Welfare. <br />
              All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}