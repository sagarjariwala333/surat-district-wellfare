'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    } catch (err) {
      router.push('/login');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <CardTitle className="text-3xl font-bold text-white">Change Password</CardTitle>
          <CardDescription className="text-white/70">
            Update your account password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {success && (
            <Alert className="bg-green-500/20 border-green-500/30 animate-in fade-in-0">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                Password changed successfully!
              </AlertDescription>
            </Alert>
          )}

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
              <Label htmlFor="currentPassword" className="text-white/80">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                  tabIndex={-1}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-white/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white/80">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
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
                  onClick={() => togglePasswordVisibility('new')}
                  tabIndex={-1}
                >
                  {showPasswords.new ? (
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
                  Changing password...
                </div>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/dashboard" className="text-white/70 hover:text-white text-sm flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

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