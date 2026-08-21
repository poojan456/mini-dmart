import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    try {
      const res = await api.get('/returns');
      setReturns(res.data.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch return requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/returns/${id}/status`, { status });
      Swal.fire({
        title: 'Status Updated',
        text: `Return request has been ${status.toLowerCase()}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      fetchReturns();
    } catch (err) {
      Swal.fire('Error', 'Failed to update return status', 'error');
    }
  };

  if (loading) return <div>Loading returns...</div>;

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#333', margin: '0 0 20px 0' }}>Manage Return Requests</h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4fbe9', color: '#0c8346' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Customer Email</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>#{req.id}</td>
                <td style={tdStyle}>#{req.order?.id}</td>
                <td style={tdStyle}>{new Date(req.requestDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{req.user?.email || 'Unknown'}</td>
                <td style={tdStyle}>{req.reason}</td>
                <td style={tdStyle}>
                  <span style={{ 
                    backgroundColor: req.status === 'APPROVED' ? '#e8f5e9' : req.status === 'REJECTED' ? '#ffebee' : '#fff3e0',
                    color: req.status === 'APPROVED' ? '#2e7d32' : req.status === 'REJECTED' ? '#c62828' : '#e65100',
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                  }}>
                    {req.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {req.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleAction(req.id, 'APPROVED')} style={actionBtnStyle('#0c8346')} title="Approve">
                        <CheckCircle size={20} />
                      </button>
                      <button onClick={() => handleAction(req.id, 'REJECTED')} style={actionBtnStyle('#dc3545')} title="Reject">
                        <XCircle size={20} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#aaa', fontSize: '13px' }}>Processed</span>
                  )}
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No return requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 15px', fontWeight: '600', borderBottom: '2px solid #e8f5e9' };
const tdStyle = { padding: '12px 15px', color: '#555' };
const actionBtnStyle = (color) => ({
  background: 'none', border: 'none', color: color, cursor: 'pointer', padding: '0'
});

export default AdminReturns;
