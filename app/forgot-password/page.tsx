'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient bg-cover bg-center relative overflow-hidden"
         style={{
           backgroundImage: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")'
         }}>
      <Card className="w-full max-w-md mx-4 bg-white/5 backdrop-blur-xl border-white/15 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-xl bg-white/5 border border-white/10 mx-auto">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Forgot Password</CardTitle>
          <CardDescription className="text-white/70">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-xl bg-green-500/20 border border-green-500/30 mx-auto">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Check Your Email</h3>
                <p className="text-white/70 text-sm">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-white/60 text-xs">
                  If you don't see the email, check your spam folder.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>
          ) : (
            <>
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
                  <Label htmlFor="email" className="text-white/80">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
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
                      Sending reset link...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/login" className="text-white/70 hover:text-white text-sm flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}

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