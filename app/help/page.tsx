'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Request Financial Help</h2>
        <p style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
          Submit your request for emergency financial assistance (up to ₹5 Lakh).
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>Help Title</label>
            <input name="title" value={formData.title} placeholder="e.g. Emergency Medical Support" onChange={handleChange} />
            {errors.title && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.title}</span>}
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input name="mobileNumber" value={formData.mobileNumber} placeholder="Your contact number" onChange={handleChange} maxLength={10} />
            {errors.mobileNumber && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.mobileNumber}</span>}
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} rows={5} placeholder="Describe your emergency and the support needed..." onChange={handleChange} />
            {errors.description && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Help Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
