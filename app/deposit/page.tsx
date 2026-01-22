'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    sanadId: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Deposit Welfare Fee (₹2,000)</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>First Name</label>
              <input name="firstName" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input name="lastName" required onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input name="mobileNumber" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Sanad ID</label>
            <input name="sanadId" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input type="number" name="age" required onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : 'Pay ₹2,000'}
          </button>
        </form>
      </div>
    </div>
  );
}
