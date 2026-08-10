import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ width: '100%', maxWidth: '430px' }}>
        <div className="card-body p-4">
          <h2 className="h4 text-danger mb-2">Sign in</h2>
          <p className="text-muted mb-4">Access the blood bank dashboard.</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn btn-danger w-100" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-3 small text-muted">
            Demo admin: <strong>admin@bloodbank.local</strong> / <strong>Admin123</strong>
          </div>
        </div>
      </div>
import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
  };

  return (
    <div className="login-container" style={{ padding: '2rem' }}>
      <h2>Sign in</h2>
      <p>Sign in to access the blood management system.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" style={{ padding: '0.75rem', background: '#800020', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Login;
