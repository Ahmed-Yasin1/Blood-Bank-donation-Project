import { useEffect, useState } from 'react'
import apiClient, { getApiError } from './api/ApiClient'
import './App.css'

export default function App() {
  const [status, setStatus] = useState('Checking API connection…')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    apiClient
      .get('/health')
      .then(({ data }) => {
        setStatus(data.message)
        setIsConnected(true)
      })
      .catch((error) => setStatus(getApiError(error)))
  }, [])

  return (
    <main className="app-shell">
      <section className="connection-card">
        <p className={isConnected ? 'status connected' : 'status'}>
          {isConnected ? 'Connected' : 'Not connected'}
        </p>
        <h1>Blood Bank Management System</h1>
        <p>{status}</p>
        {!isConnected}
      </section>
    </main>
  )
}