import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      let isAdmin = false;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        isAdmin = payload.roles && payload.roles.includes('ROLE_ADMIN');
      } catch (e) {
        console.error(e);
      }

      Swal.fire('Success', 'Logged in successfully!', 'success');
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
    }}>
      <div style={{ 
        display: 'flex', width: '800px', height: '500px', backgroundColor: '#fff', 
        borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
        >
          ✕
        </button>

        {/* Left Column (Image/Promo) */}
        <div style={{ 
          flex: '1.2', backgroundColor: '#f4fbe9', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ color: '#0c8346', fontFamily: '"Arial Black", Impact, sans-serif', fontSize: '28px', margin: '0 0 20px 0', textTransform: 'lowercase' }}>
              mini-dmart
            </h2>
            <h1 style={{ color: '#333', fontSize: '32px', lineHeight: '1.2', margin: '0', fontWeight: '800' }}>
              Everything<br/>Delivered in<br/><span style={{ color: '#0c8346' }}>minutes</span>
            </h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="https://img.freepik.com/free-vector/delivery-service-illustrated_23-2148505081.jpg" 
              alt="Delivery Illustration" 
              style={{ width: '90%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
            />
          </div>
        </div>

        {/* Right Column (Form) */}
        <div style={{ flex: '1', padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            Groceries delivered in <br/><span style={{ color: '#0c8346' }}>minutes</span>
          </h3>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="Email Address"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }}
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }}
            />
            <button type="submit" style={{ 
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#0c8346', 
              color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' 
            }}>
              Continue
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '20px' }}>
            By continuing, you agree to our<br/>
            <span style={{ color: '#0c8346', cursor: 'pointer' }}>Terms of Use</span> & <span style={{ color: '#0c8346', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
          
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#0c8346', fontWeight: 'bold', textDecoration: 'none' }}>Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
