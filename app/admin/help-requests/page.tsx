'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HelpRequestsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search,
      status,
    });
    try {
      const res = await fetch(`/api/admin/help-requests?${params.toString()}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Financial Help Requests</h1>
        <Link href="/admin" className="btn btn-secondary">Dashboard Home</Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Search Requests</label>
            <input
              placeholder="Title, Description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Filter by Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>Loading requests...</div>
        ) : data?.requests.map((req: any) => (
          <div key={req._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
              <h3 style={{ color: 'var(--secondary)' }}>{req.title}</h3>
              <span className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', textTransform: 'uppercase' }}>{req.status}</span>
            </div>
            <p style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{req.description}</p>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', display: 'flex', justifyContent: 'space-between' }}>
              <div><strong>Mobile:</strong> {req.mobileNumber}</div>
              <div><strong>Submitted:</strong> {new Date(req.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {!loading && data?.requests.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>No help requests found.</div>
        )}
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
