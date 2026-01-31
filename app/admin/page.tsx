'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HelpCircle, LogOut, Home, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container max-w-screen-xl mx-auto py-16 px-4">
        <div className="text-center">Loading Dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container max-w-screen-xl mx-auto py-16 px-4">
        <div className="text-center text-destructive">Failed to load data.</div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.stats.totalPaid}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Total Revenue: ₹{data.stats.totalRevenue.toLocaleString()}
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/members">View All Members</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data.stats.totalHelpRequests}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Pending reviews for assistance
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/help-requests">View All Requests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Navigate to different sections or test functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto flex-col py-4">
              <Link href="/">
                <Home className="h-6 w-6 mb-2" />
                Go to Website
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-4">
              <Link href="/deposit">
                <CreditCard className="h-6 w-6 mb-2" />
                Test Deposit Form
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-4">
              <Link href="/help">
                <HelpCircle className="h-6 w-6 mb-2" />
                Test Help Form
              </Link>
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="destructive" 
              className="h-auto flex-col py-4"
            >
              <LogOut className="h-6 w-6 mb-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
