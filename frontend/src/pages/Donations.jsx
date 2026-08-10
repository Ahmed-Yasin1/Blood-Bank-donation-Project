import { useEffect, useState } from 'react'
import apiClient from '../api/ApiClient'

export default function Donations() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/donors')
        setStats({ totalDonors: Array.isArray(response?.data) ? response.data.length : 0 })
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Unable to load donations data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h1 className="h3 text-danger mb-2">Donations</h1>
              <p className="text-muted mb-0">Track donation collections, donor contributions and blood inventory support.</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading donations data...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="text-danger">Total Donations</h5>
                <p className="display-6 mb-0">{stats?.totalDonors ?? 0}</p>
                <p className="text-muted small mb-0">Total number of donation records available.</p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="text-danger">Overview</h5>
                <p className="text-muted">This page is a starting point for donation tracking. You can extend it later with donation requests, collection events, and hospital support details.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
