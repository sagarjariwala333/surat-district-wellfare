'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Mail, Phone, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DepositPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    sanadId: '',
    age: '',
    password: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }
    if (!formData.sanadId.trim()) {
      newErrors.sanadId = 'Sanad ID is required';
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    // Password validation only for new users
    if (!isExistingUser) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkExistingUser = async (email: string, sanadId: string) => {
    if (!email || !sanadId) return;
    
    try {
      const res = await fetch('/api/user/check-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sanadId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsExistingUser(data.exists);
        if (data.exists && data.user) {
          // Pre-fill form with existing user data
          setFormData(prev => ({
            ...prev,
            firstName: data.user.firstName || prev.firstName,
            lastName: data.user.lastName || prev.lastName,
            mobileNumber: data.user.mobileNumber || prev.mobileNumber,
            age: data.user.age?.toString() || prev.age,
          }));
        }
      }
    } catch (err) {
      console.error('Error checking existing user:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isExistingUser
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Payment Successful! ₹2,000 deposited. Account created successfully!');
        
        // Auto-login the user after successful payment
        if (data.autoLogin) {
          router.push('/dashboard');
        } else {
          router.push('/login?message=Payment successful! Please login to access your dashboard.');
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Check for existing user when email or sanadId changes
    if (name === 'email' || name === 'sanadId') {
      const email = name === 'email' ? value : formData.email;
      const sanadId = name === 'sanadId' ? value : formData.sanadId;
      
      if (email && sanadId) {
        checkExistingUser(email, sanadId);
      }
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Deposit Welfare Fee</CardTitle>
          <CardDescription className="text-lg">
            Annual contribution of ₹2,000 to the Advocate Welfare Fund
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isExistingUser && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                We found an existing account with this email/Sanad ID. Your payment will be added to your existing account.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={`pl-10 ${errors.firstName ? 'border-destructive' : ''}`}
                    disabled={isExistingUser}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={errors.lastName ? 'border-destructive' : ''}
                  disabled={isExistingUser}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`pl-10 ${errors.mobileNumber ? 'border-destructive' : ''}`}
                  disabled={isExistingUser}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sanadId">Sanad ID</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sanadId"
                    name="sanadId"
                    value={formData.sanadId}
                    onChange={handleChange}
                    placeholder="Sanad ID"
                    className={`pl-10 ${errors.sanadId ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.sanadId && (
                  <p className="text-sm text-destructive">{errors.sanadId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="18"
                    max="100"
                    className={`pl-10 ${errors.age ? 'border-destructive' : ''}`}
                    disabled={isExistingUser}
                  />
                </div>
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>
            </div>

            {!isExistingUser && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Create Account Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set a password to access your welfare account dashboard
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPasswords.password ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password (min 6 characters)"
                      className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
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
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
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
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <div className="border-t pt-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-lg">Payment Summary</h4>
                <div className="flex justify-between items-center mt-2">
                  <span>Annual Welfare Fee</span>
                  <span className="font-bold text-xl">₹2,000</span>
                </div>
              </div>

              <Button 
                type="submit"  
                size="lg" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : `Pay ₹2,000 ${isExistingUser ? '& Update Account' : '& Create Account'}`}
              </Button>
            </div>

            {!isExistingUser && (
              <p className="text-xs text-muted-foreground text-center">
                By proceeding, you agree to create an account and can access your dashboard after payment.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
