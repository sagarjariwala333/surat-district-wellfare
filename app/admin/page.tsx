'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  if (loading) return <div className="container" style={{ padding: '4rem 1rem' }}>Loading Dashboard...</div>;
  if (!data) return <div className="container" style={{ padding: '4rem 1rem' }}>Failed to load data.</div>;

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Paid Members</h4>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{data.stats.totalPaid}</p>
            <p style={{ marginBottom: '1.5rem' }}>Total Revenue: ₹{data.stats.totalRevenue.toLocaleString()}</p>
          </div>
          <Link href="/admin/members" className="btn btn-primary">View All Members</Link>
        </div>

        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Help Requests</h4>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{data.stats.totalHelpRequests}</p>
            <p style={{ marginBottom: '1.5rem' }}>Pending reviews for assistance.</p>
          </div>
          <Link href="/admin/help-requests" className="btn btn-primary">View All Requests</Link>
        </div>
      </div>

      <section className="card glass" style={{ padding: '2rem', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" className="btn btn-secondary">Go to Website</Link>
          <Link href="/deposit" className="btn btn-secondary">Test Deposit Form</Link>
          <Link href="/help" className="btn btn-secondary">Test Help Form</Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Logout</button>
        </div>
      </section>
    </div>
  );
}
