'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function HelpPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get('embedded') === 'true';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const profile = await res.json();
        setIsAuthenticated(true);
        setUserProfile(profile);
        setFormData(prev => ({
          ...prev,
          mobileNumber: profile.mobileNumber || ''
        }));
      }
    } catch (err) {
      // User not authenticated, that's fine for public access
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }
    if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide a more detailed description (min 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Use user-specific endpoint if authenticated, otherwise use public endpoint
      const endpoint = isAuthenticated ? '/api/user/help-requests' : '/api/help';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          title: '',
          description: '',
          mobileNumber: userProfile?.mobileNumber || '',
        });
        
        if (!isEmbedded) {
          setTimeout(() => {
            if (isAuthenticated) {
              router.push('/dashboard');
            } else {
              router.push('/');
            }
          }, 2000);
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  if (success) {
    return (
      <div className={`${isEmbedded ? '' : 'container max-w-2xl mx-auto py-16 px-4'}`}>
        <Card>
          <CardContent className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your help request has been submitted and will be reviewed by our admin team.
            </p>
            {isAuthenticated && (
              <p className="text-sm text-gray-500">
                You can track the status of your request in your dashboard.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${isEmbedded ? '' : 'container max-w-2xl mx-auto py-16 px-4'}`}>
      {isAuthenticated && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            Welcome back, {userProfile?.firstName}! Your request will be linked to your account.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Request Financial Help</CardTitle>
          <CardDescription className="text-lg">
            Submit your request for emergency financial assistance (up to ₹5 Lakh)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Help Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                placeholder="e.g. Emergency Medical Support"
                onChange={handleChange}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                placeholder="Your contact number"
                onChange={handleChange}
                maxLength={10}
                className={errors.mobileNumber ? 'border-destructive' : ''}
                disabled={isAuthenticated} // Disable if user is logged in
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber}</p>
              )}
              {isAuthenticated && (
                <p className="text-xs text-gray-500">Using your registered mobile number</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                rows={5}
                placeholder="Describe your emergency and the support needed..."
                onChange={handleChange}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Help Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
