import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      // Sort by newest first
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load your orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Orders...</h3></div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>My Order History</h2>
      
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map(order => (
            <div className="card" key={order.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={20} /> Order #{order.id}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666' }}>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: order.status === 'PENDING' ? '#ff9900' : 'var(--primary-color)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {order.status}
                  </span>
                  <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Total: ${order.totalAmount?.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h4>Items:</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '10px' }}>
                  {order.items?.map(item => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
                      <span>{item.product?.name} (x{item.quantity})</span>
                      <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
