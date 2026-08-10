import { useEffect, useState } from 'react'
import { createEmergency, deleteEmergency, getEmergencies, updateEmergencyStatus } from '../api/EmergencyApi'
import { getHospitals } from '../api/HospitalApi'
import { DISTRICTS } from '../constants/districts'

const initialForm = {
  hospital: '',
  bloodType: 'O+',
  unitsRequired: '',
  urgency: 'Medium',
  location: '',
  contactPerson: '',
  phone: ''
}

export default function EmergencyRequests() {
  const [requests, setRequests] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)

  const loadData = async () => {
    try {
      setLoading(true)
      const [emergencyResponse, hospitalResponse] = await Promise.all([getEmergencies(), getHospitals()])
      setRequests(Array.isArray(emergencyResponse?.data?.data) ? emergencyResponse.data.data : [])
      setHospitals(Array.isArray(hospitalResponse?.data) ? hospitalResponse.data : [])
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load emergency requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setShowForm(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await createEmergency({
        ...form,
        unitsRequired: Number(form.unitsRequired)
      })
      await loadData()
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to create emergency request')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateEmergencyStatus(id, status)
      await loadData()
    } catch (err) {
      setError(err.message || 'Unable to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this emergency request?')) return

    try {
      await deleteEmergency(id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Unable to delete emergency request')
    }
  }

  const openCount = requests.filter((item) => item.status === 'Pending' || item.status === 'Searching').length
  const urgentCount = requests.filter((item) => item.urgency === 'High' || item.urgency === 'Critical').length
  const fulfilledCount = requests.filter((item) => item.status === 'Completed').length

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Open Requests</h6>
              <p className="display-6 mb-0">{openCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Urgent</h6>
              <p className="display-6 mb-0">{urgentCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Fulfilled</h6>
              <p className="display-6 mb-0">{fulfilledCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 text-danger mb-0">Emergency Requests</h2>
            <button className="btn btn-danger btn-sm" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Add Request'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Hospital</label>
                <select className="form-select" name="hospital" value={form.hospital} onChange={handleChange} required>
                  <option value="">Select hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Blood Type</label>
                <select className="form-select" name="bloodType" value={form.bloodType} onChange={handleChange}>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Units</label>
                <input className="form-control" type="number" name="unitsRequired" value={form.unitsRequired} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Urgency</label>
                <select className="form-select" name="urgency" value={form.urgency} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">District</label>
                <select className="form-select" name="location" value={form.location} onChange={handleChange} required>
                  <option value="">Select district</option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Contact Person</label>
                <input className="form-control" name="contactPerson" value={form.contactPerson} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-danger" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Request'}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {loading ? (
            <div className="text-muted">Loading emergency requests...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Hospital</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">No emergency requests found.</td>
                    </tr>
                  ) : (
                    requests.map((item) => (
                      <tr key={item._id}>
                        <td>{item.hospital?.name || item.hospital || '—'}</td>
                        <td>{item.bloodType}</td>
                        <td>{item.unitsRequired}</td>
                        <td>
                          <span className={`badge ${item.urgency === 'Critical' ? 'bg-danger' : item.urgency === 'High' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                            {item.urgency}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${item.status === 'Completed' ? 'bg-success' : item.status === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <select className="form-select form-select-sm" value={item.status} onChange={(e) => handleStatusChange(item._id, e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Searching">Searching</option>
                              <option value="Matched">Matched</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
