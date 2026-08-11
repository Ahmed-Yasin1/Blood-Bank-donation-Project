import { useEffect, useMemo, useState } from 'react'
import { createHospital, deleteHospital, getHospitals, updateHospital } from '../api/HospitalApi'
import { DISTRICTS } from '../constants/districts'

const initialForm = {
  name: '',
  district: '',
  address: '',
  phone: '',
  email: '',
  password: '',
  status: 'Active'
}

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingHospital, setEditingHospital] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHospitals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return hospitals

    return hospitals.filter((hospital) => String(hospital.name || '').toLowerCase().includes(query))
  }, [hospitals, searchTerm])

  const loadHospitals = async () => {
    try {
      setLoading(true)
      const response = await getHospitals()
      setHospitals(Array.isArray(response?.data) ? response.data : [])
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load hospitals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHospitals()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditingHospital(null)
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
      if (editingHospital) {
        await updateHospital(editingHospital._id, form)
      } else {
        await createHospital(form)
      }

      await loadHospitals()
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save hospital')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (hospital) => {
    setEditingHospital(hospital)
    setForm({
      name: hospital.name || '',
      district: hospital.district || '',
      address: hospital.address || '',
      phone: hospital.phone || '',
      email: hospital.email || '',
      status: hospital.status || 'Active'
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hospital?')) return

    try {
      await deleteHospital(id)
      await loadHospitals()
    } catch (err) {
      setError(err.message || 'Unable to delete hospital')
    }
  }

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Partner Hospitals</h6>
              <p className="display-6 mb-0">{hospitals.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Active Contracts</h6>
              <p className="display-6 mb-0">{hospitals.filter((item) => item.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Pending</h6>
              <p className="display-6 mb-0">{hospitals.filter((item) => item.status !== 'Active').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 text-danger mb-0">Hospital Directory</h2>
            <button className="btn btn-danger btn-sm" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Add Hospital'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">District</label>
                <select className="form-select" name="district" value={form.district} onChange={handleChange} required>
                  <option value="">Select district</option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Address</label>
                <input className="form-control" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-danger" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingHospital ? 'Update Hospital' : 'Save Hospital'}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Search hospitals by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-muted">Loading hospitals...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>District</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHospitals.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No hospitals found.</td>
                    </tr>
                  ) : (
                    filteredHospitals.map((hospital) => (
                      <tr key={hospital._id}>
                        <td>{hospital.name}</td>
                        <td>{hospital.district || hospital.location}</td>
                        <td>{hospital.phone}</td>
                        <td>
                          <span className={`badge ${hospital.status === 'Active' ? 'bg-success' : hospital.status === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {hospital.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(hospital)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(hospital._id)}>Delete</button>
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
