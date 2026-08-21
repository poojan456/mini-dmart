import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axiosConfig';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchTerm.trim() !== '') {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      
      // Initialize quantities to 1
      const initialQtys = {};
      response.data.forEach(p => initialQtys[p.id] = 1);
      setQuantities(initialQtys);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (productId, delta, maxStock) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = current + delta;
      if (next >= 1 && next <= maxStock) {
        return { ...prev, [productId]: next };
      }
      return prev;
    });
  };

  const handleAddToCart = (product) => {
    if (product.stockQuantity <= 0) {
      Swal.fire('Out of Stock', 'This item is currently unavailable.', 'error');
      return;
    }

    const qtyToAdd = quantities[product.id] || 1;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity + qtyToAdd > product.stockQuantity) {
        Swal.fire('Stock Limit', `You cannot add more than ${product.stockQuantity} items in total.`, 'warning');
        return;
      }
      existingItem.quantity += qtyToAdd;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, quantity: qtyToAdd, maxStock: product.stockQuantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    Swal.fire({
      title: 'Added to Cart!',
      text: `${qtyToAdd}x ${product.name} added to your shopping cart.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    
    // Reset quantity back to 1
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Products...</h3></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px', gap: '15px' }}>
        <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>Fresh Groceries</h2>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#888' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '35px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={18} color="#888" />
            <select 
              className="form-control" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map(product => (
            <div className="card" key={product.id} style={{ display: 'flex', flexDirection: 'column', padding: '15px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ height: '200px', width: '100%', marginBottom: '15px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: '8px' }}>
                <img 
                  src={product.imageUrl || `https://placehold.co/600x400/f4f6f8/0c8346?text=${encodeURIComponent(product.name)}`} 
                  alt={product.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/f4f6f8/0c8346?text=${encodeURIComponent(product.name)}` }}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
              
              <h3 style={{ fontSize: '18px', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '13px', flexGrow: 1 }}>{product.category}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  ₹{product.price.toFixed(2)}
                </span>
                <span style={{ fontSize: '13px', padding: '4px 8px', borderRadius: '12px', backgroundColor: product.stockQuantity > 0 ? '#e8f5e9' : '#ffebee', color: product.stockQuantity > 0 ? '#2e7d32' : '#c62828', fontWeight: '500' }}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
                </span>
              </div>
              
              {/* Quantity Selector inside the box */}
              {product.stockQuantity > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '5px', borderRadius: '8px' }}>
                  <button 
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--primary-color)', padding: '0 10px' }}
                    onClick={(e) => { e.stopPropagation(); handleQtyChange(product.id, -1, product.stockQuantity); }}
                  >-</button>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{quantities[product.id] || 1}</span>
                  <button 
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--primary-color)', padding: '0 10px' }}
                    onClick={(e) => { e.stopPropagation(); handleQtyChange(product.id, 1, product.stockQuantity); }}
                  >+</button>
                </div>
              )}

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                disabled={product.stockQuantity <= 0}
              >
                <ShoppingCart size={18} /> {product.stockQuantity > 0 ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
