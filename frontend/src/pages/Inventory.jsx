import { useEffect, useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { addBlood, deleteInventory, getInventory, updateInventory } from '../api/InventoryApi'
import { getHospitals } from '../api/HospitalApi'

const initialForm = {
  hospital: '',
  bloodType: 'O+',
  quantity: '',
  expiryDate: ''
}

export default function Inventory() {
  const { user } = useAuth()
  const isHospital = user?.role === 'hospital'

  const [inventory, setInventory] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')

  const filteredInventory = useMemo(() => {
    const query = searchTerm.trim().toUpperCase()

    return inventory.filter((item) => {
      const matchesBloodType = !query || item.bloodType?.toUpperCase().includes(query)
      const matchesHospital = !hospitalFilter || String(item.hospital?._id || item.hospital || '').toLowerCase() === hospitalFilter.toLowerCase()

      return matchesBloodType && matchesHospital
    })
  }, [inventory, searchTerm, hospitalFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const inventoryResponse = await getInventory()
      const hospitalsResponse = await getHospitals()

      const inventoryData = Array.isArray(inventoryResponse?.data)
        ? inventoryResponse.data
        : inventoryResponse?.data?.blood || []

      const hospitalData = Array.isArray(hospitalsResponse?.data)
        ? hospitalsResponse.data
        : []

      setInventory(inventoryData)
      setHospitals(hospitalData)
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  useEffect(() => {
    if (isHospital) {
      setForm((prev) => ({ ...prev, hospital: user.id }))
    }
  }, [isHospital, user?.id])

  const resetForm = () => {
    setForm(initialForm)
    if (isHospital) {
      setForm((prev) => ({ ...prev, hospital: user.id }))
    }
    setEditingItem(null)
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

    if (!form.hospital || !form.quantity || !form.expiryDate) {
      setError('Please complete all fields')
      setSaving(false)
      return
    }

    try {
      const payload = {
        hospital: isHospital ? user.id : form.hospital,
        bloodType: form.bloodType.toUpperCase(),
        quantity: Number(form.quantity),
        expiryDate: form.expiryDate
      }

      if (editingItem) {
        await updateInventory(editingItem._id, payload)
      } else {
        await addBlood(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save inventory item')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      hospital: item.hospital?._id || item.hospital || '',
      bloodType: item.bloodType || 'O+',
      quantity: item.quantity || '',
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inventory item?')) return

    try {
      await deleteInventory(id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Unable to delete inventory item')
    }
  }

  const totalUnits = inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const lowStockCount = inventory.filter((item) => Number(item.quantity || 0) < 20).length
  const expiringSoonCount = inventory.filter((item) => {
    if (!item.expiryDate) return false
    const days = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    return days <= 30
  }).length

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Total Units</h6>
              <p className="display-6 mb-0">{totalUnits}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Low Stock</h6>
              <p className="display-6 mb-0">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Expiring Soon</h6>
              <p className="display-6 mb-0">{expiringSoonCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 text-danger mb-0">Blood Inventory</h2>
            <button className="btn btn-danger btn-sm" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Add Stock'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="row g-3 mb-3">
              {isHospital ? (
                <div className="col-md-4">
                  <label className="form-label">Hospital</label>
                  <input
                    className="form-control"
                    value={hospitals.find((hospital) => hospital._id === user.id)?.name || 'Your Hospital'}
                    disabled
                  />
                </div>
              ) : (
                <div className="col-md-4">
                  <label className="form-label">Hospital</label>
                  <select className="form-select" name="hospital" value={form.hospital} onChange={handleChange} required>
                    <option value="">Select hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="col-md-2">
                <label className="form-label">Blood Type</label>
                <select className="form-select" name="bloodType" value={form.bloodType} onChange={handleChange}>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Quantity</label>
                <input className="form-control" type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Expiry Date</label>
                <input className="form-control" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-danger" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingItem ? 'Update Stock' : 'Save Stock'}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="Search by blood type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {!isHospital && (
              <div className="col-md-3">
                <select className="form-select" value={hospitalFilter} onChange={(e) => setHospitalFilter(e.target.value)}>
                  <option value="">All hospitals</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-muted">Loading inventory...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Units</th>
                    <th>Hospital</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">No inventory found.</td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const expiry = item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'
                      const isLow = Number(item.quantity || 0) < 20
                      const isExpiring = item.expiryDate && (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) <= 30

                      return (
                        <tr key={item._id}>
                          <td>{item.bloodType}</td>
                          <td>{item.quantity}</td>
                          <td>{item.hospital?.name || item.hospital?.username || item.hospital?.email || item.hospital || '—'}</td>
                          <td>{expiry}</td>
                          <td>
                            <span className={`badge ${isLow ? 'bg-warning text-dark' : isExpiring ? 'bg-info text-dark' : 'bg-success'}`}>
                              {isLow ? 'Low' : isExpiring ? 'Expiring' : 'Healthy'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(item)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                          </td>
                        </tr>
                      )
                    })
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
