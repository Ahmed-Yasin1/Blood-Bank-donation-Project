import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { getDashboardStats } from '../api/ReportApi'
import { getHospital, updateHospital } from '../api/HospitalApi'
import './Dashboard.css'

const statCards = [
  { key: 'totalDonors', label: 'Matched Donors', note: 'Donors matched to your hospital', accent: 'primary' },
  { key: 'totalRequests', label: 'Your Emergency Requests', note: 'Emergency blood requests from your hospital', accent: 'danger' },
  { key: 'totalBloodUnitsAvailable', label: 'Available Units', note: 'Blood units in your inventory', accent: 'success' },
  { key: 'lowStockCount', label: 'Low Stock Items', note: 'Inventory below the restock threshold', accent: 'secondary' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [district, setDistrict] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const userId = user?.id || user?._id
        const response = await getDashboardStats({ hospitalId: user?.role === 'hospital' ? userId : undefined })
        if (response.data?.success) {
          setDashboardData(response.data.data)
        } else {
          throw new Error('Unable to fetch dashboard data')
        }

        if (user?.role === 'hospital' && userId) {
          try {
            const hospitalResponse = await getHospital(userId)
            const data = hospitalResponse?.data || hospitalResponse
            setProfile(data)
            setDistrict(data?.district || '')
          } catch (profileError) {
            setProfile(null)
            setDistrict('')
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Unable to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  const handleSaveDistrict = async (e) => {
    e.preventDefault()
    if (user?.role !== 'hospital') return

    const userId = user?.id || user?._id
    if (!userId) return

    try {
      setSaving(true)
      await updateHospital(userId, { district })
      const hospitalResponse = await getHospital(userId)
      setProfile(hospitalResponse?.data || hospitalResponse)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to update district')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="dashboard-loading">Loading dashboard metrics...</div>
  if (error) return <div className="dashboard-error">Error: {error}</div>

  const bloodTypeData = Object.entries(dashboardData?.bloodTypeCounts || {}).map(([type, value]) => ({ type, value }))
  const maxBlood = Math.max(...bloodTypeData.map((item) => item.value), 1)

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <span className="dashboard-badge">{user?.role === 'hospital' ? 'Hospital dashboard' : 'Live system overview'}</span>
          <h1 className="dashboard-title">{user?.role === 'hospital' ? `Welcome, ${profile?.name || user?.name || user?.email}` : 'Blood Bank Hub'}</h1>
          <p className="dashboard-description">
            {user?.role === 'hospital'
              ? 'Your hospital emergency requests, inventory and donor matches.'
              : 'Track donors, inventories, hospitals and emergencies in one beautiful dashboard.'}
          </p>
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
              <p>{user?.role === 'hospital' ? 'Your hospital inventory' : 'Visual stock breakdown by blood group.'}</p>
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
              <h2>{user?.role === 'hospital' ? 'Your recent emergency requests' : 'User role distribution'}</h2>
              <p>{user?.role === 'hospital' ? 'Requests that belong to your hospital.' : 'Admins, hospitals and donors across the platform.'}</p>
            </div>
          </div>
          {user?.role === 'hospital' ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Units</th>
                    <th>Urgency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.hospitalEmergencies?.length > 0 ? (
                    dashboardData.hospitalEmergencies.map((req) => (
                      <tr key={req._id}>
                        <td>{req.bloodType}</td>
                        <td>{req.unitsRequired}</td>
                        <td>{req.urgency}</td>
                        <td>{req.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">No emergency requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="role-grid">
              {Object.entries(dashboardData?.userRoles || {}).map(([name, value], index) => (
                <div key={name} className="role-card" style={{ borderColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][index % 4] }}>
                  <span className="role-name">{name}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="panel panel-activity">
        <div className="panel-header">
          <div>
            <h2>Recent activity</h2>
            <p>{user?.role === 'hospital' ? 'Latest activity from your hospital.' : 'Latest events from your blood bank system.'}</p>
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
