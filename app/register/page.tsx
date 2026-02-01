'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, CreditCard, Calendar, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    sanadId: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/login?message=Registration successful. Please login.');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 hero-gradient bg-cover bg-center relative overflow-hidden"
         style={{
           backgroundImage: 'linear-gradient(rgba(26, 42, 108, 0.9), rgba(26, 42, 108, 0.85)), url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")'
         }}>
      <div className="container max-w-md mx-4 md:mx-auto">
        <Card className="bg-white/5 backdrop-blur-xl border-white/15 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-xl bg-white/5 border border-white/10 mx-auto">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-white/70">
              Join the Surat District Court Advocate Welfare Fund
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/80">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="First name"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-white/80">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sanadId" className="text-white/80">Sanad ID</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sanadId"
                      name="sanadId"
                      type="text"
                      value={formData.sanadId}
                      onChange={handleChange}
                      required
                      placeholder="Sanad ID"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white/80">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      placeholder="Age"
                      min="18"
                      max="100"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-white hover:text-white/80 underline">
                  Sign in
                </Link>
              </p>
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
    </div>
  );
}