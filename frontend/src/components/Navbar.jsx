import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import Swal from 'sweetalert2';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0c8346',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        navigate('/login');
        Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
      }
    });
  };



  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.roles && payload.roles.includes('ROLE_ADMIN');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <nav className="navbar" style={{ backgroundColor: '#fff', color: '#333', borderBottom: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={isAdmin ? "/admin" : "/"} style={{ textDecoration: 'none' }}>
          <h2 style={{ 
            fontFamily: '"Arial Black", Impact, sans-serif', 
            fontWeight: 900, 
            fontSize: '34px', 
            letterSpacing: '-1.5px', 
            margin: 0,
            textTransform: 'lowercase'
          }}>
            <span style={{ color: '#0c8346' }}>mini</span>
            <span style={{ color: '#2d3748' }}>dmart</span>
          </h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {!isAdmin && <Link to="/" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>Home</Link>}
          {token ? (
            <>
              {!isAdmin && (
                <>
                  <Link to="/cart" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}><ShoppingCart size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Cart</Link>
                  <Link to="/orders" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>My Orders</Link>
                </>
              )}
              <Link to="/profile" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}><User size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Profile</Link>
              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: '#dc3545', fontWeight: 'bold', marginLeft: '10px', verticalAlign: 'middle', border: '1px solid #dc3545', padding: '6px 12px', borderRadius: '6px' }}>
                <LogOut size={16} style={{ display: 'inline', verticalAlign: 'middle' }}/> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
              <Link to="/register" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
