import React, { useState, useEffect } from 'react';
import apiClient from '../api/ApiClient';
import useAuth from '../hooks/useAuth';
import '../index.css'; // Uses your global styles

function Reports() {
  const { user } = useAuth()
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadReports = async (fromDate = '', toDate = '', params = {}) => {
    try {
      setLoading(true)
      const response = await apiClient.get('/reports', {
        params: {
          startDate: fromDate || undefined,
          endDate: toDate || undefined,
          ...params,
        },
      })
      setReportData(response?.data?.data || response?.data || null)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch system reports.')
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const params = {}
    if (user?.role === 'hospital') {
      params.hospitalId = user.id
    }
    loadReports(startDate, endDate, params)
  }, [user])

  const handleFilter = (e) => {
    e.preventDefault();
    const params = {}
    if (user?.role === 'hospital') {
      params.hospitalId = user.id
    }
    loadReports(startDate, endDate, params);
  };

  if (loading) {
    return <div className="loading-state">Loading system reports...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div className="reports-container" style={{ padding: '24px', backgroundColor: 'var(--bg-cream, #fdfbf7)', minHeight: '100vh', color: 'var(--text-dark, #2c1e1e)' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--burgundy, #6b1d2f)', fontSize: '28px', fontWeight: 'bold' }}>System Reports & Analytics</h1>
        <p style={{ color: '#666' }}>Overview of blood donation metrics, inventory levels, and donor activities.</p>
      </header>

      <form onSubmit={handleFilter} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Start date</label>
          <input className="form-control" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>End date</label>
          <input className="form-control" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div style={{ alignSelf: 'end' }}>
          <button className="btn btn-danger" type="submit">Filter</button>
        </div>
      </form>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid var(--burgundy, #6b1d2f)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#888', margin: '0 0 8px 0' }}>Total Donors</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{reportData?.totalDonors ?? 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid var(--burgundy, #6b1d2f)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#888', margin: '0 0 8px 0' }}>Total Blood Units Available</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{reportData?.totalUnits ?? 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid var(--burgundy, #6b1d2f)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#888', margin: '0 0 8px 0' }}>Pending Requests</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{reportData?.pendingRequests ?? 0}</p>
        </div>
      </div>

      {/* Detailed Section / Table */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '20px', color: 'var(--burgundy, #6b1d2f)', marginBottom: '16px' }}>Blood Group Distribution</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', color: '#555' }}>
              <th style={{ padding: '12px' }}>Blood Group</th>
              <th style={{ padding: '12px' }}>Available Units</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData?.bloodGroupStats?.length > 0 ? (
              reportData.bloodGroupStats.map((group, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f2f2f2' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{group.bloodGroup}</td>
                  <td style={{ padding: '12px' }}>{group.units} Bags</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      backgroundColor: group.units < 5 ? '#ffebee' : '#e8f5e9',
                      color: group.units < 5 ? '#c62828' : '#2e7d32'
                    }}>
                      {group.units < 5 ? 'Low Stock' : 'Adequate'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '16px', textAlign: 'center', color: '#888' }}>No inventory stats available.</td>
              </tr>
            )}
          </tbody>
        </table>
        
          {/* Recent requests */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--burgundy, #6b1d2f)' }}>Recent Emergency Requests</h3>
            {reportData?.recentRequests?.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {reportData.recentRequests.map((req) => (
                  <li key={req._id} style={{ padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                    <strong>{req.bloodType}</strong> • {req.unitsRequired} units • <span style={{ color: '#666' }}>{req.status}</span>
                    <div style={{ fontSize: '13px', color: '#888' }}>{req.hospital?.name || req.hospital?.username || req.hospital?.email || 'Unknown hospital'} — {new Date(req.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#888' }}>No recent requests.</p>
            )}
          </div>
      </div>
    </div>
  );
}

export default Reports;