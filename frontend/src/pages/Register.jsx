import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // By default setting the user as CUSTOMER. Admins can be manually configured in DB.
      const response = await api.post('/auth/register', { name, email, password, role: 'CUSTOMER' });
      localStorage.setItem('token', response.data.token);
      Swal.fire('Success', 'Registered successfully!', 'success');
      navigate('/');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)' }}>Register</h2>
        
        <img 
          src="https://img.freepik.com/free-vector/new-user-online-registration-concept_23-2148674987.jpg" 
          alt="Register Illustration" 
          className="auth-img" 
        />

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
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
              minLength="6"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
