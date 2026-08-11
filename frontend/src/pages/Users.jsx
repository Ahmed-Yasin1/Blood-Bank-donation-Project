import { useEffect, useMemo, useState } from 'react'
import apiClient from '../api/ApiClient'

const emptyForm = {
  username: '',
  email: '',
  role: 'donor',
  password: '',
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return users

    return users.filter((user) => String(user.username || user.fullName || '').toLowerCase().includes(query))
  }, [users, searchTerm])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/auth/users')
      setUsers(Array.isArray(response?.data?.users) ? response.data.users : [])
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please log in with an admin account to manage users.')
      } else {
        setError(err.message || 'Unable to load users')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openAddUser = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setFormOpen(true)
    setError('')
  }

  const openEditUser = (user) => {
    setEditingUser(user)
    setForm({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'donor',
      password: '',
    })
    setFormOpen(true)
    setError('')
  }

  const closeForm = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setFormOpen(false)
    setError('')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
      }

      if (form.password) {
        payload.password = form.password
      }

      if (editingUser) {
        await apiClient.put(`/auth/users/${editingUser._id}`, payload)
      } else {
        await apiClient.post('/auth/register', payload)
      }

      await loadUsers()
      closeForm()
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = async (userId, role) => {
    try {
      setSaving(true)
      await apiClient.put(`/auth/users/${userId}/role`, { role })
      await loadUsers()
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to update role')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return

    try {
      setSaving(true)
      await apiClient.delete(`/auth/users/${userId}`)
      await loadUsers()
    } catch (err) {
      setError(err.message || 'Unable to delete user')
    } finally {
      setSaving(false)
    }
  }

  const adminCount = users.filter((user) => user.role === 'admin').length

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Total Users</h6>
              <p className="display-6 mb-0">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Admins</h6>
              <p className="display-6 mb-0">{adminCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Hospitals</h6>
              <p className="display-6 mb-0">{users.filter((user) => user.role === 'hospital').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 text-danger mb-0">Users</h2>
            <div>
              <button className="btn btn-sm btn-danger me-2" onClick={openAddUser}>
                Add User
              </button>
              <span className="text-muted">{saving ? 'Saving...' : ''}</span>
            </div>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Search users by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {formOpen && (
            <div className="border rounded-3 p-3 mb-4 bg-white">
              <h5 className="mb-3 text-danger">{editingUser ? 'Edit User' : 'Add User'}</h5>
              <form onSubmit={handleSubmitUser}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      name="username"
                      value={form.username}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={form.role}
                      onChange={handleFormChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="hospital">Hospital</option>
                      <option value="donor">Donor</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Password{editingUser ? ' (leave blank to keep current)' : ''}</label>
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleFormChange}
                      placeholder={editingUser ? 'Optional' : 'Enter password'}
                      required={!editingUser}
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-danger" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                  </button>
                  <button className="btn btn-outline-secondary" type="button" onClick={closeForm} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-muted">Loading users...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No users found.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username || user.fullName || 'User'}</td>
                        <td>{user.email}</td>
                        <td>
                          <select className="form-select form-select-sm" value={user.role || 'donor'} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                            <option value="admin">Admin</option>
                            <option value="hospital">Hospital</option>
                            <option value="donor">Donor</option>
                          </select>
                        </td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => openEditUser(user)}>
                              Edit
                            </button>
                            {user.role !== 'admin' && (
                              <button className="btn btn-sm btn-danger" onClick={() => handleRoleChange(user._id, 'admin')}>
                                Make Admin
                              </button>
                            )}
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user._id)}>Delete</button>
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
