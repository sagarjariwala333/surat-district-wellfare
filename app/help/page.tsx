'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mobileNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Help Request Submitted Successfully!');
        router.push('/');
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Request Financial Help</h2>
        <p style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
          Submit your request for emergency financial assistance (up to ₹5 Lakh).
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Help Title</label>
            <input name="title" placeholder="e.g. Emergency Medical Support" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input name="mobileNumber" placeholder="Your contact number" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea name="description" rows={5} placeholder="Describe your emergency and the support needed..." required onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Help Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
