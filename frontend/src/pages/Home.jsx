import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Assuming you have an authenticated token to fetch products
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      if(err.response?.status === 401 || err.response?.status === 403) {
         Swal.fire('Session Expired', 'Please login to view products', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stockQuantity <= 0) {
      Swal.fire('Out of Stock', 'This item is currently unavailable.', 'error');
      return;
    }

    // Basic Cart implementation using LocalStorage for now
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, quantity: 1, maxStock: product.stockQuantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} has been added to your shopping cart.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Products...</h3></div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Fresh Groceries</h2>
      
      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No products available at the moment.</p>
          <p style={{ fontSize: '14px', color: '#666' }}>(Admin needs to add products via API)</p>
        </div>
      ) : (
        <div className="grid">
          {products.map(product => (
            <div className="card" key={product.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <img 
                src={product.imageUrl || "https://img.freepik.com/free-vector/grocery-cart-with-items_23-2148270146.jpg"} 
                alt={product.name} 
                className="product-img" 
              />
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', flexGrow: 1 }}>{product.category}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  ${product.price.toFixed(2)}
                </span>
                <span style={{ fontSize: '14px', color: product.stockQuantity > 0 ? 'green' : 'red' }}>
                  {product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                </span>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={() => handleAddToCart(product)}
                disabled={product.stockQuantity <= 0}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
