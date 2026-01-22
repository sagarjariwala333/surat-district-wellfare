'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Paid Members</h1>
        <Link href="/admin" className="btn btn-secondary">Dashboard Home</Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Search Members</label>
            <input 
              placeholder="Name, ID, Email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>From Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>To Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
