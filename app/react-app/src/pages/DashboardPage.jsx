import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalLeads: 0, hotCount: 0, coldCount: 0, warmCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        const employeeId = localStorage.getItem('employeeId');
        const res = await axios.get('https://zi-affiliates-backend.onrender.com/leads/dashboard', {
          headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
        });
        setStats(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  return (
    <div className="centered-container">
      <h2>Dashboard</h2>
      <div className="tiles">
        <div className="tile">Total Leads<br />{stats.totalLeads}</div>
        <div className="tile">Hot<br />{stats.hotCount}</div>
        <div className="tile">Cold<br />{stats.coldCount}</div>
        <div className="tile">Warm<br />{stats.warmCount}</div>
      </div>
      <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
        <button onClick={() => navigate('/form')}>Form</button>
        <button onClick={() => navigate('/leads')}>Leads</button>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
