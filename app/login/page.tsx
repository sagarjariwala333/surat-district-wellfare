'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
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
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center hero-gradient bg-cover bg-center relative overflow-hidden"
         style={{
           backgroundImage: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")'
         }}>
      <Card className="w-full max-w-md mx-4 bg-white/5 backdrop-blur-xl border-white/15 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-xl bg-white/5 border border-white/10 mx-auto">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">User Login</CardTitle>
          <CardDescription className="text-white/70">
            Access your welfare account
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
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-white/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link href="/forgot-password" className="text-xs text-white/60 hover:text-white/80">
                Forgot password?
              </Link>
              <Link href="/register" className="text-xs text-white/60 hover:text-white/80">
                Create account
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
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