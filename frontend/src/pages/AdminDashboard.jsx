import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminReturns from '../components/admin/AdminReturns';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Basic Admin Check (Real auth should happen in backend/context)
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.roles || !payload.roles.includes('ROLE_ADMIN')) {
        navigate('/'); // Redirect non-admins to home
      }
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container" style={{ marginTop: '20px', minHeight: '60vh' }}>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ width: '250px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', alignSelf: 'flex-start' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Admin Panel</h3>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button 
                onClick={() => setActiveTab('overview')}
                style={tabStyle(activeTab === 'overview')}
              >
                Dashboard Overview
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('products')}
                style={tabStyle(activeTab === 'products')}
              >
                Manage Products
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('orders')}
                style={tabStyle(activeTab === 'orders')}
              >
                Manage Orders
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('returns')}
                style={tabStyle(activeTab === 'returns')}
              >
                Return Requests
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'returns' && <AdminReturns />}
        </div>
        
      </div>
    </div>
  );
}

const tabStyle = (isActive) => ({
  width: '100%',
  textAlign: 'left',
  padding: '12px 15px',
  backgroundColor: isActive ? '#f4fbe9' : 'transparent',
  color: isActive ? '#0c8346' : '#555',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: isActive ? 'bold' : '500',
  fontSize: '15px',
  transition: 'all 0.2s',
  borderLeft: isActive ? '4px solid #0c8346' : '4px solid transparent'
});

export default AdminDashboard;
