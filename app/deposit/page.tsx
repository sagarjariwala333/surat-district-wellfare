'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DepositPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    sanadId: '',
    age: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Payment Successful! ₹2,000 deposited.');
        router.push('/');
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
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
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
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength={10}
                className={errors.mobileNumber ? 'border-destructive' : ''}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sanadId">Sanad ID</Label>
              <Input
                id="sanadId"
                name="sanadId"
                value={formData.sanadId}
                onChange={handleChange}
                className={errors.sanadId ? 'border-destructive' : ''}
              />
              {errors.sanadId && (
                <p className="text-sm text-destructive">{errors.sanadId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'border-destructive' : ''}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age}</p>
              )}
            </div>

            <Button 
              type="submit"  
              size="lg" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay ₹2,000'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
