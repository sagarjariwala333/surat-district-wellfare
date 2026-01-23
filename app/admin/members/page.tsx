'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DateRangePicker from '@/components/DateRangePicker';

export default function MembersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search,
      startDate,
      endDate,
    });
    try {
      const res = await fetch(`/api/admin/members?${params.toString()}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, startDate, endDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Paid Members</h1>
        <Link href="/admin" className="btn btn-secondary">Dashboard Home</Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} className="grid-cols-mobile" style={{ alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Search Members</label>
            <input
              placeholder="Name, ID, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Date Filter (Single or Range)</label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '3rem' }}>Search</button>
        </form>
      </div>

      <div className="desktop-only">
        <div className="card responsive-table" style={{ padding: 0, marginBottom: '2rem' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--muted)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Sanad ID</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Mobile</th>
                <th style={{ padding: '1rem' }}>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
              ) : data?.users.map((user: any) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{user.firstName} {user.lastName}</td>
                  <td style={{ padding: '1rem' }}>{user.sanadId}</td>
                  <td style={{ padding: '1rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>{user.mobileNumber}</td>
                  <td style={{ padding: '1rem' }}>{new Date(user.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {!loading && data?.users.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-only">
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : data?.users.map((user: any) => (
            <div key={user._id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--muted-foreground)' }}>Sanad ID:</span>
                <span>{user.sanadId}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>Email:</span>
                <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>Mobile:</span>
                <span>{user.mobileNumber}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>Paid on:</span>
                <span>{new Date(user.paymentDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {!loading && data?.users.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>No members found.</div>
          )}
        </div>
      </div>

      {data?.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
            Page {page} of {data.pages}
          </span>
          <button
            disabled={page === data.pages}
            onClick={() => setPage(page + 1)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
