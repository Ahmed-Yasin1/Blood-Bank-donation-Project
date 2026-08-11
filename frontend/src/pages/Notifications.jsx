import { useEffect, useState } from 'react'
import { getNotifications, getAllNotifications, getHospitalSentNotifications, markNotificationRead, markAllNotificationsRead, markAllHospitalNotificationsRead, deleteNotification } from '../api/NotificationApi'
import { respondToEmergency } from '../api/EmergencyApi'
import useAuth from '../hooks/useAuth'

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const isAdmin = user?.role === 'admin'
      const isHospital = user?.role === 'hospital'
      let res
      if (isAdmin) {
        res = await getAllNotifications()
      } else if (isHospital) {
        res = await getHospitalSentNotifications()
      } else {
        const id = user.donorId || user.id
        res = await getNotifications(id)
      }
      setNotifications(res.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [user])

  if (!user) return <div className="text-muted">Please sign in to view your notifications.</div>

  return (
    <div className="container-fluid">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 text-danger mb-0">Recent Notifications</h2>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { const isAdmin = user?.role === 'admin'; const isHospital = user?.role === 'hospital'; if (isHospital) { markAllHospitalNotificationsRead().then(load) } else { const id = isAdmin ? 'all' : (user.donorId || user.id); markAllNotificationsRead(id).then(load) } }}>Mark all read</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => setNotifications([])}>Clear</button>
            </div>
          </div>

          {loading ? (
            <div className="text-muted">Loading notifications...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="list-group">
              {notifications.length === 0 ? (
                <div className="text-muted">No notifications.</div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{n.title}</strong>
                      <div className="small text-muted">{n.message}</div>
                      <div className="small text-muted">{n.relatedEmergency ? `Emergency: ${n.relatedEmergency.bloodType}` : ''}</div>
                      {(n.sender?.name || n.relatedEmergency?.hospital?.name || n.relatedEmergency?.hospital?.username || n.relatedEmergency?.hospital?.email) && (
                        <div className="small text-muted">Hospital: {n.sender?.name || n.relatedEmergency?.hospital?.name || n.relatedEmergency?.hospital?.username || n.relatedEmergency?.hospital?.email}</div>
                      )}

                      {(user?.role === 'admin' || user?.role === 'hospital') && (
                        <div className="small mt-1">
                          <span className={`badge ${n.isRead ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {n.isRead ? 'Read' : 'Unread'}
                          </span>
                          <span className="ms-2 text-muted">Recipient: {n.recipient?.fullName || 'Hospital'}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                      <div className="mt-2">
                        {!n.isRead && <button className="btn btn-sm btn-outline-success me-2" onClick={() => markNotificationRead(n._id).then(load)}>Mark read</button>}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNotification(n._id).then(load)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
