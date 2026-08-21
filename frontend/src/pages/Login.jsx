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
      localStorage.setItem('token', response.data.token);
      Swal.fire('Success', 'Logged in successfully!', 'success');
      navigate('/');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)' }}>Login</h2>
        
        {/* Placeholder image for Auth, using a generic shopping cart illustration */}
        <img 
          src="https://img.freepik.com/free-vector/shopping-cart-icon-isolated-illustration_18591-82223.jpg" 
          alt="Shopping Cart" 
          className="auth-img" 
        />

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
