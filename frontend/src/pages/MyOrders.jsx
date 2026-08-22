import { useState, useEffect } from 'react';
import { Package, RefreshCw, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [ordersRes, returnsRes] = await Promise.all([
        api.get('/orders/my-orders'),
        api.get('/returns/my-returns').catch(() => ({ data: [] }))
      ]);
      const sorted = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      
      const returnMap = {};
      returnsRes.data.forEach(r => {
        if (r.order && r.order.id) {
          returnMap[r.order.id] = r;
        }
      });
      setReturns(returnMap);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load your orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: 'Request Return',
      input: 'textarea',
      inputLabel: 'Why are you returning this order?',
      inputPlaceholder: 'Type your reason here...',
      inputAttributes: {
        'aria-label': 'Type your reason here'
      },
      showCancelButton: true,
      confirmButtonColor: 'var(--primary-color)',
      confirmButtonText: 'Submit Request'
    });

    if (reason) {
      try {
        await api.post(`/returns/${orderId}`, { reason });
        Swal.fire('Submitted!', 'Your return request has been submitted for approval.', 'success');
        fetchOrders(); // refresh orders (optional, could update local state if backend updates order status to RETURN_REQUESTED)
      } catch (err) {
        Swal.fire('Failed', err.response?.data?.message || 'Failed to submit return request', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#ff9800'; // Orange
      case 'DELIVERED': return '#4caf50'; // Green
      case 'CANCELLED': return '#f44336'; // Red
      default: return 'var(--primary-color)';
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Orders...</h3></div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>My Order History</h2>
      
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Package size={48} color="#ccc" style={{ marginBottom: '15px' }} />
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {orders.map(order => (
            <div className="card" key={order.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0' }}>
                    <Package size={18} /> Order #{order.id}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{new Date(order.createdAt).toLocaleString()}</p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>
                    <strong>Delivery:</strong> {order.deliveryType === 'STORE_PICKUP' ? 'Store Pickup' : 'Home Delivery'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {order.status}
                  </span>
                  <p style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '18px', color: 'var(--text-dark)' }}>
                    ₹{order.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Items ({order.items?.length}):</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                  {order.items?.map(item => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '500' }}>{item.product?.name}</span>
                        <span style={{ color: '#888', fontSize: '12px' }}>x{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: '500' }}>₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons based on order status */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                {order.status === 'DELIVERED' && !returns[order.id] && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleReturnRequest(order.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', padding: '8px 15px' }}
                  >
                    <RefreshCw size={16} /> Request Return
                  </button>
                )}
                
                {/* Note: In a real app with cancel endpoints, we would have a cancel button here for PENDING orders */}
                {order.status === 'PENDING' && (
                   <span style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', alignSelf: 'center' }}>
                     Preparing order...
                   </span>
                )}
                
                {returns[order.id] && returns[order.id].status === 'PENDING' && (
                   <span style={{ fontSize: '14px', color: '#ff9800', fontWeight: 'bold', alignSelf: 'center' }}>
                     Return Request Pending
                   </span>
                )}
                {returns[order.id] && returns[order.id].status === 'APPROVED' && (
                   <span style={{ fontSize: '14px', color: '#4caf50', fontWeight: 'bold', alignSelf: 'center' }}>
                     Return Accepted
                   </span>
                )}
                {returns[order.id] && returns[order.id].status === 'REJECTED' && (
                   <span style={{ fontSize: '14px', color: '#f44336', fontWeight: 'bold', alignSelf: 'center' }}>
                     Return Rejected
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
