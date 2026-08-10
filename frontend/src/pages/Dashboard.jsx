import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setDashboardData(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard metrics...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Blood Bank Admin Dashboard</h1>

      {/* Top Summary Cards Grid */}
      <div className="dashboard-grid">
        
        {/* Total Donors Card */}
        <div className="dashboard-card card-donors">
          <h3 className="card-title">Total Donors</h3>
          <p className="card-value">{dashboardData?.totalDonors ?? 0}</p>
        </div>

        {/* Emergency Requests Card */}
        <div className="dashboard-card card-requests">
          <h3 className="card-title">Emergency Requests</h3>
          <p className="card-value">{dashboardData?.totalRequests ?? 0}</p>
        </div>

        {/* Available Blood Units Card */}
        <div className="dashboard-card card-inventory">
          <h3 className="card-title">Available Blood Units</h3>
          <p className="card-value">{dashboardData?.totalBloodUnitsAvailable ?? 0}</p>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="activity-card">
        <h3 className="activity-header">Recent Activities</h3>
        {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
          <ul className="activity-list">
            {dashboardData.recentActivities.map((activity, index) => (
              <li key={index} className="activity-item">
                {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-activity">No recent activities recorded yet.</p>
        )}
      </div>
    </div>
  );
}