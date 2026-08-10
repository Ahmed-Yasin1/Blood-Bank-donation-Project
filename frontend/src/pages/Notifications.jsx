export default function Notifications() {
  return (
    <div className="container-fluid">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 text-danger mb-3">Recent Notifications</h2>
          <div className="list-group">
            <div className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>Emergency request received</strong>
                <span className="text-muted small">5 min ago</span>
              </div>
              <div className="text-muted small">City Hospital requested 4 units of O-.</div>
            </div>
            <div className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>Inventory low stock alert</strong>
                <span className="text-muted small">20 min ago</span>
              </div>
              <div className="text-muted small">A- stock has dropped below the threshold.</div>
            </div>
            <div className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>Donor reminder</strong>
                <span className="text-muted small">1 hr ago</span>
              </div>
              <div className="text-muted small">Eligible donors were notified about upcoming donation drive.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}