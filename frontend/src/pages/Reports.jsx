import React, { useState, useEffect } from 'react';
import '../index.css'; // Uses your global styles

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch analytics/reports data from your backend API
    fetch('http://localhost:3000/api/reports') // Adjust endpoint if your backend route differs
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch system reports.');
        }
        return res.json();
      })
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid var(--burgundy, #6b1d2f)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#888', margin: '0 0 8px 0' }}>Total Donors</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{reportData?.totalDonors || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid var(--burgundy, #6b1d2f)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#888', margin: '0 0 8px 0' }}>Total Blood Units Available</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{reportData?.totalUnits || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid var(--burgundy, #6b1d2f)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#888', margin: '0 0 8px 0' }}>Pending Requests</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{reportData?.pendingRequests || 0}</p>
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
      </div>
    </div>
  );
}

export default Reports;