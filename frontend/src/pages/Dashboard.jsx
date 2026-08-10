import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api/ReportApi'
import './Dashboard.css'

const statCards = [
  { key: 'totalDonors', label: 'Total Donors', note: 'Registered donors in system', accent: 'primary' },
  { key: 'totalRequests', label: 'Emergency Requests', note: 'Emergency requests logged', accent: 'danger' },
  { key: 'totalBloodUnitsAvailable', label: 'Available Units', note: 'Blood units currently in stock', accent: 'success' },
  { key: 'totalHospitals', label: 'Hospitals', note: 'Hospitals registered in the system', accent: 'info' },
  { key: 'totalUsers', label: 'Total Users', note: 'Users across all roles', accent: 'warning' },
  { key: 'lowStockCount', label: 'Low Stock Items', note: 'Inventory items below restock threshold', accent: 'secondary' },
]

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then((response) => {
        if (response.data?.success) {
          setDashboardData(response.data.data)
        } else {
          throw new Error('Unable to fetch dashboard data')
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Unable to load dashboard data')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard-loading">Loading dashboard metrics...</div>
  if (error) return <div className="dashboard-error">Error: {error}</div>

  const bloodTypeData = Object.entries(dashboardData?.bloodTypeCounts || {}).map(([type, value]) => ({ type, value }))
  const roleData = Object.entries(dashboardData?.userRoles || {}).map(([name, value]) => ({ name, value }))
  const maxBlood = Math.max(...bloodTypeData.map((item) => item.value), 1)

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <span className="dashboard-badge">Live system overview</span>
          <h1 className="dashboard-title">Blood Bank Hub</h1>
          <p className="dashboard-description">Track donors, inventories, hospitals and emergencies in one beautiful dashboard.</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {statCards.map((card) => (
          <article key={card.key} className={`dashboard-card dashboard-card-${card.accent}`}>
            <div className="card-label">{card.label}</div>
            <div className="card-value">{dashboardData?.[card.key] ?? 0}</div>
            <p className="card-note">{card.note}</p>
          </article>
        ))}
      </div>

      <div className="dashboard-panels">
        <section className="panel panel-wide">
          <div className="panel-header">
            <div>
              <h2>Blood inventory by type</h2>
              <p>Visual stock breakdown by blood group.</p>
            </div>
          </div>
          <div className="chart-list">
            {bloodTypeData.length > 0 ? (
              bloodTypeData.map((item, index) => (
                <div key={item.type} className="chart-row">
                  <div className="chart-row-label">{item.type}</div>
                  <div className="chart-row-bar">
                    <div
                      className="chart-row-fill"
                      style={{
                        width: `${Math.round((item.value / maxBlood) * 100)}%`,
                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#14b8a6'][index % 6],
                      }}
                    />
                  </div>
                  <div className="chart-row-value">{item.value}</div>
                </div>
              ))
            ) : (
              <p className="chart-empty">No inventory data found.</p>
            )}
          </div>
        </section>

        <section className="panel panel-wide panel-alt">
          <div className="panel-header">
            <div>
              <h2>User role distribution</h2>
              <p>Admins, hospitals and donors across the platform.</p>
            </div>
          </div>
          <div className="role-grid">
            {roleData.length > 0 ? (
              roleData.map((role, index) => (
                <div key={role.name} className="role-card" style={{ borderColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][index % 4] }}>
                  <span className="role-name">{role.name}</span>
                  <strong>{role.value}</strong>
                </div>
              ))
            ) : (
              <p className="chart-empty">No role data available.</p>
            )}
          </div>
        </section>
      </div>

      <section className="panel panel-activity">
        <div className="panel-header">
          <div>
            <h2>Recent activity</h2>
            <p>Latest events from your blood bank system.</p>
          </div>
        </div>
        <div className="activity-stream">
          {dashboardData?.recentActivities?.length > 0 ? (
            dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="activity-row">
                <span className="activity-dot" />
                <p>{activity}</p>
              </div>
            ))
          ) : (
            <p className="activity-empty">No recent activity available.</p>
          )}
        </div>
      </section>
    </div>
  )
}
