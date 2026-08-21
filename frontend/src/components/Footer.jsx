import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1e3932', color: '#fff', padding: '50px 20px 20px', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        <div>
          <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '24px' }}>Mini D-Mart</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc', paddingRight: '20px' }}>
            Your one-stop destination for fresh groceries, daily essentials, and household needs delivered right to your doorstep with lightning speed.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '12px' }}><Link to="/" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link></li>
            <li style={{ marginBottom: '12px' }}><Link to="/cart" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Shopping Cart</Link></li>
            <li style={{ marginBottom: '12px' }}><Link to="/orders" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>My Orders</Link></li>
            <li style={{ marginBottom: '12px' }}><Link to="/profile" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Customer Support</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '12px' }}>FAQ</li>
            <li style={{ marginBottom: '12px' }}>Return Policy</li>
            <li style={{ marginBottom: '12px' }}>Terms of Service</li>
            <li style={{ marginBottom: '12px' }}>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Contact Us</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📍 123 Grocery Lane, Market City</li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📞 +91 8626048783</li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>✉️ support@minidmart.com</li>
          </ul>
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px', 
        paddingTop: '20px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        color: '#888', 
        fontSize: '14px' 
      }}>
        © {new Date().getFullYear()} Mini D-Mart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
