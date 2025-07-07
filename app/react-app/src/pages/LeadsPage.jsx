import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const statusOptions = ['all', 'hot', 'cold', 'warm'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLeads = async (filterStatus) => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      const employeeId = localStorage.getItem('employeeId');
      let url;
      if (!filterStatus || filterStatus === 'all') {
        url = `https://zi-affiliates-backend.onrender.com/leads/by-employee/${employeeId}`;
      } else {
        url = `https://zi-affiliates-backend.onrender.com/leads?status=${filterStatus}`;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
      });
      setLeads(res.data);
    } catch (err) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(status); }, [status]);

  return (
    <div className="centered-container">
      <h2>Leads</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {statusOptions.map(opt => (
          <button key={opt} onClick={() => setStatus(opt)} style={{ fontWeight: status === opt ? 'bold' : 'normal' }}>{opt}</button>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
      <div style={{ marginTop: 16 }}>
        {loading ? <div>Loading...</div> : leads.length === 0 ? <div>No leads found.</div> : (
          <ul style={{ padding: 0 }}>
            {leads.map(lead => (
              <li key={lead.id || lead._id} style={{ background: '#f2f2f2', margin: '8px 0', padding: 12, borderRadius: 8 }}>
                <strong>{lead.name}</strong><br />
                {lead.email} | {lead.phone}<br />
                Status: {lead.status}<br />
                Date: {lead.date}<br />
                Notes: {lead.notes}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
