import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const statusOptions = ['hot', 'cold', 'warm'];

export default function FormPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', status: 'hot', notes: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{10,15}$/.test(phone);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      toast.error('Invalid email address');
      return;
    }
    if (!validatePhone(form.phone)) {
      toast.error('Invalid phone number');
      return;
    }
    setLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      const employeeId = localStorage.getItem('employeeId');
      await axios.post('https://zi-affiliates-backend.onrender.com/leads', form, {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
      });
      toast.success('Lead created!');
      setForm({ name: '', phone: '', email: '', date: '', status: 'hot', notes: '' });
    } catch (err) {
      toast.error('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-container">
      <h2>Create Lead</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="date" type="date" placeholder="Date" value={form.date} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange}>
          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      </form>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
