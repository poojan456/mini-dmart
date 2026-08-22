import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, ShoppingBag, RotateCcw, IndianRupee } from 'lucide-react';
import api from '../../api/axiosConfig';

const COLORS = ['#0c8346', '#ff9900', '#0277bd', '#d84315', '#6c757d', '#dc3545'];

function AdminOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingReturns: 0
  });
  
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes, returnsRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/returns')
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;
        const returns = returnsRes.data;

        // Calculate Revenue
        const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Calculate Pending Returns
        const pendingReturns = returns.filter(r => r.status === 'PENDING').length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
          pendingReturns
        });

        // Group Orders by Status for Pie Chart
        const statusCounts = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(statusCounts).map(status => ({
          name: status,
          value: statusCounts[status]
        }));

        setOrderStatusData(chartData);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div 
          style={cardStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
        >
          <div style={iconBoxStyle('#e8f5e9', '#0c8346')}><Package size={24} /></div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Products</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{stats.totalProducts}</h3>
          </div>
        </div>
        <div 
          style={cardStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
        >
          <div style={iconBoxStyle('#fff3e0', '#ff9900')}><ShoppingBag size={24} /></div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Orders</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{stats.totalOrders}</h3>
          </div>
        </div>
        <div 
          style={cardStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
        >
          <div style={iconBoxStyle('#e3f2fd', '#0277bd')}><IndianRupee size={24} /></div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Revenue</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>₹{stats.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>
        <div 
          style={cardStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
        >
          <div style={iconBoxStyle('#ffebee', '#d84315')}><RotateCcw size={24} /></div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pending Returns</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{stats.pendingReturns}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#444', textAlign: 'center' }}>Orders by Status</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={orderStatusData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#444', textAlign: 'center' }}>Orders Overview</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f4f4f4'}} />
                <Bar dataKey="value" fill="#0c8346" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  cursor: 'pointer'
};

const iconBoxStyle = (bgColor, color) => ({
  backgroundColor: bgColor,
  color: color,
  width: '50px',
  height: '50px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export default AdminOverview;
