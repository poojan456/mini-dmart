import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      Swal.fire({
        title: 'Status Updated',
        text: `Order #${orderId} is now ${newStatus}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      fetchOrders();
    } catch (err) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return '#0c8346';
      case 'SHIPPED': return '#0277bd';
      case 'CANCELLED': return '#dc3545';
      case 'RETURN_REQUESTED': return '#ff9800';
      case 'RETURNED': return '#6c757d';
      default: return '#555';
    }
  };

  const formatDate = (dateData) => {
    if (!dateData) return 'Unknown';
    if (Array.isArray(dateData)) {
      return new Date(dateData[0], dateData[1] - 1, dateData[2], dateData[3] || 0, dateData[4] || 0).toLocaleString();
    }
    return new Date(dateData).toLocaleString();
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#333', margin: '0 0 20px 0' }}>Manage Orders</h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4fbe9', color: '#0c8346' }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Customer Email</th>
              <th style={thStyle}>Total Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>#{order.id}</td>
                <td style={tdStyle}>{order.user?.email || 'Unknown'}</td>
                <td style={tdStyle}>₹{order.totalAmount.toFixed(2)}</td>
                <td style={tdStyle}>
                  <span style={{ 
                    backgroundColor: getStatusColor(order.status) + '20', 
                    color: getStatusColor(order.status),
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No orders found.</td>
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

export default AdminOrders;
