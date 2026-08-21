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

  return (
    <nav className="navbar">
      <div className="container">
        <h2><Link to="/">Mini D-Mart</Link></h2>
        <div>
          <Link to="/">Home</Link>
          {token ? (
            <>
              <Link to="/cart"><ShoppingCart size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Cart</Link>
              <Link to="/orders">My Orders</Link>
              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'white', marginLeft: '10px', verticalAlign: 'middle' }}>
                <LogOut size={18} style={{ display: 'inline', verticalAlign: 'middle' }}/> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
