'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  LogOut,
  Settings,
  IndianRupee,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  sanadId: string;
  age: number;
  isPaid: boolean;
  paidAmount: number;
  paymentDate?: string;
  payments: Array<{
    _id: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Help request form state
  const [helpFormData, setHelpFormData] = useState({
    title: '',
    description: '',
    mobileNumber: '',
  });
  const [helpFormErrors, setHelpFormErrors] = useState<Record<string, string>>({});
  const [helpFormLoading, setHelpFormLoading] = useState(false);
  const [helpFormSuccess, setHelpFormSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchHelpRequests();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        // Pre-fill mobile number in help form
        setHelpFormData(prev => ({
          ...prev,
          mobileNumber: data.mobileNumber || ''
        }));
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load user data');
      }
    } catch (err) {
      setError('An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpRequests = async () => {
    try {
      const res = await fetch('/api/user/help-requests');
      if (res.ok) {
        const data = await res.json();
        setHelpRequests(data);
      }
    } catch (err) {
      console.error('Failed to load help requests');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // Help form functions
  const validateHelpForm = () => {
    const newErrors: Record<string, string> = {};

    if (helpFormData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(helpFormData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }
    if (helpFormData.description.trim().length < 20) {
      newErrors.description = 'Please provide a more detailed description (min 20 characters)';
    }

    setHelpFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHelpFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateHelpForm()) return;

    setHelpFormLoading(true);

    try {
      const res = await fetch('/api/user/help-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helpFormData),
      });

      if (res.ok) {
        setHelpFormSuccess(true);
        setHelpFormData({
          title: '',
          description: '',
          mobileNumber: userData?.mobileNumber || '',
        });
        // Refresh help requests list
        fetchHelpRequests();
        // Auto-switch to help requests tab after 2 seconds
        setTimeout(() => {
          setHelpFormSuccess(false);
          document.querySelector('[value="help-requests"]')?.click();
        }, 2000);
      } else {
        const error = await res.json();
        alert(error.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to submit request');
    } finally {
      setHelpFormLoading(false);
    }
  };

  const handleHelpFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHelpFormData({ ...helpFormData, [name]: value });
    // Clear error when user starts typing
    if (helpFormErrors[name]) {
      setHelpFormErrors({ ...helpFormErrors, [name]: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error || 'Failed to load dashboard'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-primary">
                SuratWelfare
              </Link>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  Welcome, {userData.firstName} {userData.lastName}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/change-password">
                  <Settings className="h-4 w-4 mr-2" />
                  Change Password
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="help-requests">Help Requests</TabsTrigger>
            <TabsTrigger value="new-request">New Request</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name:</span>
                    <span>{userData.firstName} {userData.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mobile:</span>
                    <span>{userData.mobileNumber}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Sanad ID:</span>
                    <span>{userData.sanadId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Age:</span>
                    <span>{userData.age} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Payment Status:</span>
                    {userData.isPaid ? (
                      <Badge variant="default" className="bg-green-500">Paid ₹{userData.paidAmount}</Badge>
                    ) : (
                      <Badge variant="destructive">Not Paid</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Fee Payment</CardTitle>
                  <CardDescription>
                    {userData.isPaid
                      ? `You have paid ₹${userData.paidAmount} on ${new Date(userData.paymentDate!).toLocaleDateString()}`
                      : 'Pay your annual welfare fee of ₹2,000'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!userData.isPaid && (
                    <Button asChild className="w-full">
                      <Link href="/deposit">Pay ₹2,000 Now</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Assistance</CardTitle>
                  <CardDescription>
                    Request emergency financial help up to ₹5 Lakh
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#new-request" onClick={() => document.querySelector('[value="new-request"]')?.click()}>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Request Help
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Your welfare fund payment records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.payments && userData.payments.length > 0 ? (
                  <div className="space-y-4">
                    {userData.payments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <IndianRupee className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">₹{payment.amount}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-500">
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IndianRupee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment history found</p>
                    <Button asChild className="mt-4">
                      <Link href="/deposit">Make Your First Payment</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Help Requests</CardTitle>
                <CardDescription>
                  Track the status of your financial assistance requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {helpRequests.length > 0 ? (
                  <div className="space-y-4">
                    {helpRequests.map((request) => (
                      <div key={request._id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{request.title}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No help requests found</p>
                    <Button asChild className="mt-4">
                      <Link href="#new-request" onClick={() => document.querySelector('[value="new-request"]')?.click()}>
                        Submit Your First Request
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-request">
            <Card>
              <CardHeader>
                <CardTitle>Request Financial Assistance</CardTitle>
                <CardDescription>
                  Submit a request for emergency financial help (up to ₹5 Lakh)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {helpFormSuccess ? (
                  <div className="text-center py-8">
                    <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Request Submitted Successfully!</h3>
                    <p className="text-gray-600 mb-4">
                      Your help request has been submitted and will be reviewed by our admin team.
                    </p>
                    <p className="text-sm text-gray-500">
                      Redirecting to your help requests...
                    </p>
                  </div>
                ) : (
                  <>
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800">
                        Welcome, {userData?.firstName}! Your request will be linked to your account.
                      </AlertDescription>
                    </Alert>

                    <form onSubmit={handleHelpFormSubmit} noValidate className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="help-title">Help Title</Label>
                        <Input
                          id="help-title"
                          name="title"
                          value={helpFormData.title}
                          placeholder="e.g. Emergency Medical Support"
                          onChange={handleHelpFormChange}
                          className={helpFormErrors.title ? 'border-destructive' : ''}
                        />
                        {helpFormErrors.title && (
                          <p className="text-sm text-destructive">{helpFormErrors.title}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="help-mobile">Mobile Number</Label>
                        <Input
                          id="help-mobile"
                          name="mobileNumber"
                          value={helpFormData.mobileNumber}
                          placeholder="Your contact number"
                          onChange={handleHelpFormChange}
                          maxLength={10}
                          className={helpFormErrors.mobileNumber ? 'border-destructive' : ''}
                          disabled={true} // Always disabled for logged-in users
                        />
                        {helpFormErrors.mobileNumber && (
                          <p className="text-sm text-destructive">{helpFormErrors.mobileNumber}</p>
                        )}
                        <p className="text-xs text-gray-500">Using your registered mobile number</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="help-description">Description</Label>
                        <Textarea
                          id="help-description"
                          name="description"
                          value={helpFormData.description}
                          rows={5}
                          placeholder="Describe your emergency and the support needed..."
                          onChange={handleHelpFormChange}
                          className={helpFormErrors.description ? 'border-destructive' : ''}
                        />
                        {helpFormErrors.description && (
                          <p className="text-sm text-destructive">{helpFormErrors.description}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={helpFormLoading}
                      >
                        {helpFormLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                          </div>
                        ) : (
                          'Submit Help Request'
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}