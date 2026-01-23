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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }
    if (!formData.sanadId.trim()) {
      newErrors.sanadId = 'Sanad ID is required';
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Deposit Welfare Fee (₹2,000)</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid-cols-mobile" style={{ marginBottom: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.firstName}</span>}
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.lastName}</span>}
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</span>}
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} maxLength={10} />
            {errors.mobileNumber && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.mobileNumber}</span>}
          </div>
          <div className="input-group">
            <label>Sanad ID</label>
            <input name="sanadId" value={formData.sanadId} onChange={handleChange} />
            {errors.sanadId && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.sanadId}</span>}
          </div>
          <div className="input-group">
            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} />
            {errors.age && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.age}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : 'Pay ₹2,000'}
          </button>
        </form>
      </div>
    </div>
  );
}
