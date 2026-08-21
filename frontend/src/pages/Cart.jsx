import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryType, setDeliveryType] = useState('STORE_PICKUP');
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(loadedCart);
  }, []);

  const handleRemove = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    if (newQuantity < 1) return;
    if (newQuantity > maxStock) {
      Swal.fire('Stock Limit', `Only ${maxStock} items available in stock.`, 'warning');
      return;
    }
    
    const updatedCart = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (deliveryType === 'HOME_DELIVERY' && !shippingAddress.trim()) {
      Swal.fire('Address Required', 'Please enter a shipping address for home delivery.', 'warning');
      return;
    }

    // Transform cart for backend OrderRequest DTO
    const orderRequest = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      deliveryType: deliveryType,
      shippingAddress: deliveryType === 'HOME_DELIVERY' ? shippingAddress : null
    };

    try {
      await api.post('/orders', orderRequest);
      localStorage.removeItem('cart');
      setCartItems([]);
      Swal.fire('Order Placed!', 'Your order has been successfully placed.', 'success');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      Swal.fire('Checkout Failed', err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>Your Cart is Empty</h2>
        <p style={{ margin: '20px 0' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Shopping Cart</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '300px' }}>
          {cartItems.map(item => (
            <div className="card" key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="btn" style={{ padding: '5px 10px' }} onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.maxStock)}>-</button>
                <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                <button className="btn" style={{ padding: '5px 10px' }} onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.maxStock)}>+</button>
                
                <button className="btn btn-secondary" style={{ marginLeft: '15px' }} onClick={() => handleRemove(item.productId)}>
                  <Trash2 size={18} style={{ display: 'block' }}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ flex: '1', minWidth: '300px', height: 'fit-content' }}>
          <h3>Order Summary</h3>
          <hr style={{ margin: '15px 0', borderTop: '1px solid #eee' }} />
          
          <div className="form-group">
            <label>Delivery Method</label>
            <select 
              className="form-control" 
              value={deliveryType} 
              onChange={(e) => setDeliveryType(e.target.value)}
            >
              <option value="STORE_PICKUP">Store Pickup (Free)</option>
              <option value="HOME_DELIVERY">Home Delivery</option>
            </select>
          </div>

          {deliveryType === 'HOME_DELIVERY' && (
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full address..."
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', margin: '20px 0' }}>
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={handleCheckout}>
            <CreditCard size={18} /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
