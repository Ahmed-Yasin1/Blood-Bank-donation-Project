import { useEffect, useState } from 'react'
import { DISTRICTS } from '../constants/districts'
import {
  createDonor,
  deleteDonor,
  searchDonors,
  updateDonor,
  getDonationHistory,
  addDonationRecord,
  updateDonationRecord,
  deleteDonationRecord,
} from '../api/DonorApi'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  age: '',
  bloodGroup: 'O+',
  address: '',
  city: '',
  district: '',
  lastDonationDate: '',
  medicalNotes: ''
}

const initialDonationForm = {
  date: '',
  location: '',
  status: 'Completed'
}

const donationStatuses = ['Completed', 'Scheduled', 'Cancelled', 'Pending']

export default function Donors() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [donationSaving, setDonationSaving] = useState(false)
  const [error, setError] = useState('')
  const [donationError, setDonationError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [editingDonor, setEditingDonor] = useState(null)
  const [editingDonation, setEditingDonation] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [donationForm, setDonationForm] = useState(initialDonationForm)
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [donationHistory, setDonationHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const loadDonors = async () => {
    try {
      setLoading(true)
      const response = await searchDonors()
      const donorList = response?.data?.donors || []
      setDonors(donorList)
      setError('')
      return donorList
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to load donors')
      return []
    } finally {
      setLoading(false)
    }
  }

  const loadDonationHistory = async (donorId) => {
    if (!donorId) return
    try {
      setHistoryLoading(true)
      const response = await getDonationHistory(donorId)
      setDonationHistory(response?.data?.donationHistory || [])
      setDonationError('')
    } catch (err) {
      setDonationError(err.response?.data?.error || err.message || 'Unable to load donation history')
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadDonors()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditingDonor(null)
    setShowForm(false)
  }

  const resetDonationForm = () => {
    setDonationForm(initialDonationForm)
    setEditingDonation(null)
    setShowDonationForm(false)
    setDonationError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDonationChange = (e) => {
    const { name, value } = e.target
    setDonationForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        lastDonationDate: form.lastDonationDate || undefined
      }

      if (editingDonor) {
        await updateDonor(editingDonor._id, payload)
      } else {
        await createDonor(payload)
      }

      const updatedDonors = await loadDonors()
      if (selectedDonor) {
        const current = updatedDonors.find((item) => item._id === selectedDonor._id)
        if (current) setSelectedDonor(current)
      }

      resetForm()
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to save donor')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (donor) => {
    setEditingDonor(donor)
    setForm({
      fullName: donor.fullName || '',
      email: donor.email || '',
      phone: donor.phone || '',
      age: donor.age || '',
      bloodGroup: donor.bloodGroup || 'O+',
      address: donor.address || '',
      city: donor.city || '',
      district: donor.district || '',
      lastDonationDate: donor.lastDonationDate ? new Date(donor.lastDonationDate).toISOString().split('T')[0] : '',
      medicalNotes: donor.medicalNotes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donor?')) return

    try {
      await deleteDonor(id)
      await loadDonors()
      if (selectedDonor?._id === id) {
        setSelectedDonor(null)
        setDonationHistory([])
        setShowDonationForm(false)
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to delete donor')
    }
  }

  const handleSelectDonor = async (donor) => {
    setSelectedDonor(donor)
    setShowDonationForm(false)
    setEditingDonation(null)
    setDonationForm(initialDonationForm)
    await loadDonationHistory(donor._id)
  }

  const handleDonationSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDonor) return

    setDonationSaving(true)
    setDonationError('')

    try {
      const payload = {
        ...donationForm,
        date: donationForm.date || new Date().toISOString().split('T')[0]
      }

      if (editingDonation) {
        await updateDonationRecord(selectedDonor._id, editingDonation._id, payload)
      } else {
        await addDonationRecord(selectedDonor._id, payload)
      }

      const updatedDonors = await loadDonors()
      const current = updatedDonors.find((item) => item._id === selectedDonor._id)
      if (current) setSelectedDonor(current)
      await loadDonationHistory(selectedDonor._id)
      resetDonationForm()
    } catch (err) {
      setDonationError(err.response?.data?.error || err.message || 'Unable to save donation record')
    } finally {
      setDonationSaving(false)
    }
  }

  const handleDonationEdit = (record) => {
    setEditingDonation(record)
    setDonationForm({
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      location: record.location || '',
      status: record.status || 'Completed'
    })
    setShowDonationForm(true)
  }

  const handleDonationDelete = async (record) => {
    if (!selectedDonor || !window.confirm('Delete this donation record?')) return

    try {
      await deleteDonationRecord(selectedDonor._id, record._id)
      const updatedDonors = await loadDonors()
      const current = updatedDonors.find((item) => item._id === selectedDonor._id)
      if (current) setSelectedDonor(current)
      await loadDonationHistory(selectedDonor._id)
    } catch (err) {
      setDonationError(err.response?.data?.error || err.message || 'Unable to delete donation record')
    }
  }

  const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString()
  }

  const eligibleCount = donors.filter((donor) => donor.eligibilityStatus !== false).length
  const pendingCount = donors.filter((donor) => donor.eligibilityStatus === false).length

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Registered Donors</h6>
              <p className="display-6 mb-0">{donors.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Eligible Today</h6>
              <p className="display-6 mb-0">{eligibleCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Pending Review</h6>
              <p className="display-6 mb-0">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 text-danger mb-0">Donor Management</h2>
            <button className="btn btn-danger btn-sm" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Add Donor'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Age</label>
                <input className="form-control" type="number" name="age" value={form.age} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Blood Group</label>
                <select className="form-select" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input className="form-control" name="city" value={form.city} onChange={handleChange} required />
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
                <label className="form-label">Address</label>
                <input className="form-control" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Donation Date</label>
                <input className="form-control" type="date" name="lastDonationDate" value={form.lastDonationDate} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Medical Notes</label>
                <textarea className="form-control" name="medicalNotes" rows="2" value={form.medicalNotes} onChange={handleChange} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-danger" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingDonor ? 'Update Donor' : 'Save Donor'}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {loading ? (
            <div className="text-muted">Loading donors...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood Group</th>
                    <th>Status</th>
                    <th>City</th>
                    <th>District</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No donors found.</td>
                    </tr>
                  ) : (
                    donors.map((donor) => (
                      <tr key={donor._id}>
                        <td>{donor.fullName}</td>
                        <td>{donor.bloodGroup}</td>
                        <td>{donor.district || '—'}</td>
                        <td>
                          <span className={`badge ${donor.eligibilityStatus === false ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {donor.eligibilityStatus === false ? 'Pending' : 'Eligible'}
                          </span>
                        </td>
                        <td>{donor.city}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleSelectDonor(donor)}>
                            Manage Donations
                          </button>
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(donor)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(donor._id)}>
                            Delete
                          </button>
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

      {selectedDonor && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h2 className="h5 text-danger mb-1">Donation History</h2>
                <p className="mb-1">Donor: <strong>{selectedDonor.fullName}</strong></p>
                <p className="mb-1">
                  Status: <span className={`badge ${selectedDonor.eligibilityStatus === false ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {selectedDonor.eligibilityStatus === false ? 'Pending' : 'Eligible'}
                  </span>
                </p>
                {selectedDonor.lastDonationDate && (
                  <p className="mb-0 text-muted">Last donation: {formatDate(selectedDonor.lastDonationDate)}</p>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => setShowDonationForm((prev) => !prev)}>
                  {showDonationForm ? 'Hide Donation Form' : editingDonation ? 'Edit Donation' : 'Add Donation'}
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => {
                  setSelectedDonor(null)
                  setDonationHistory([])
                  setShowDonationForm(false)
                  setEditingDonation(null)
                  setDonationError('')
                }}>
                  Close
                </button>
              </div>
            </div>

            {donationError && <div className="alert alert-danger py-2">{donationError}</div>}

            {showDonationForm && (
              <form onSubmit={handleDonationSubmit} className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Donation Date</label>
                  <input className="form-control" type="date" name="date" value={donationForm.date} onChange={handleDonationChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Location</label>
                  <input className="form-control" name="location" value={donationForm.location} onChange={handleDonationChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={donationForm.status} onChange={handleDonationChange}>
                    {donationStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 d-flex gap-2">
                  <button className="btn btn-danger" type="submit" disabled={donationSaving}>
                    {donationSaving ? 'Saving...' : editingDonation ? 'Update Donation' : 'Save Donation'}
                  </button>
                  <button className="btn btn-outline-secondary" type="button" onClick={resetDonationForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {historyLoading ? (
              <p className="text-muted">Loading donation history...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">No donation records yet.</td>
                      </tr>
                    ) : (
                      donationHistory.map((record) => (
                        <tr key={record._id || record.date}>
                          <td>{formatDate(record.date)}</td>
                          <td>{record.location || '—'}</td>
                          <td>{record.status}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleDonationEdit(record)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDonationDelete(record)}>
                              Delete
                            </button>
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
      )}
    </div>
  )
}
