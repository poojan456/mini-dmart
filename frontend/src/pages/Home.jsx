import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // --- Banner Slider Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      id: 1,
      title: "Stock up on daily essentials",
      subtitle: "Get farm-fresh goodness & a range of exotic fruits, vegetables, eggs & more",
      bgColor: "#2e7d32",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Culinary_fruits_front_view.jpg"
    },
    {
      id: 2,
      title: "Mega Pantry Clearance",
      subtitle: "Save up to 40% on rice, wheat, oils, and daily pantry staples",
      bgColor: "#43a047", // Changed from red/orange to a fresh green shade
      imgUrl: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 3,
      title: "Express Home Delivery",
      subtitle: "Order now and get your groceries delivered at lightning speed",
      bgColor: "#0277bd",
      imgUrl: "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000); // change slide every 4 seconds
    return () => clearInterval(timer);
  }, [banners.length]);

  // Helper to extract size/weight for Blinkit style display
  const extractSize = (name) => {
    const match = name.match(/(\d+\s*(kg|g|L|ml|Pack|Dozen|Rolls|lb|oz))/i);
    return match ? match[0] : '1 unit';
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Products...</h3></div>;
  }

  return (
    <div className="container">
      {/* --- HERO BANNER SLIDER --- */}
      <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', borderRadius: '12px', marginBottom: '40px', backgroundColor: '#f0f0f0' }}>
        {banners.map((banner, index) => (
          <div key={banner.id} className="hero-banner" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `linear-gradient(to right, ${banner.bgColor} 40%, transparent), url(${banner.imgUrl}) right/cover no-repeat`,
            backgroundColor: banner.bgColor, // fallback
            color: 'white',
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            transition: 'transform 0.6s ease-in-out'
          }}>
            <div className="hero-text">
              <h2>{banner.title}</h2>
              <p>{banner.subtitle}</p>
              <button className="btn" style={{ backgroundColor: 'white', color: banner.bgColor, fontWeight: 'bold', padding: '10px 25px', fontSize: '16px' }}>Shop Now</button>
            </div>
          </div>
        ))}
        {/* Slider Dots */}
        <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              style={{ 
                width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer',
                backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>
      </div>
      {/* --- END HERO BANNER --- */}

      {!localStorage.getItem('token') ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', marginTop: '40px' }}>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>Please Log In</h2>
          <p style={{ marginBottom: '25px', fontSize: '18px', color: '#555' }}>You must be logged in to view our product catalog and make purchases.</p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '18px' }}>
            Go to Login
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px', gap: '15px' }}>
            <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>All Products</h2>
            
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ 
                  display: 'flex', flexDirection: 'column', padding: '12px', 
                  border: '1px solid #f0f0f0', borderRadius: '10px', backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', transition: 'box-shadow 0.2s, transform 0.2s ease-in-out',
                  cursor: 'pointer', transform: 'scale(1)'
                }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'scale(1.03)'; }} 
                   onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  
                  {/* Image Section */}
                  <div style={{ height: '140px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img 
                      src={product.imageUrl || `https://placehold.co/600x400/f4f6f8/0c8346?text=${encodeURIComponent(product.name)}`} 
                      alt={product.name}
                      style={{ 
                        maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', 
                        opacity: product.stockQuantity <= 0 ? 0.3 : 1 
                      }}
                      onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/f4f6f8/0c8346?text=${encodeURIComponent(product.name)}` }}
                    />
                    {product.stockQuantity <= 0 && (
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        backgroundColor: '#888', color: 'white', padding: '4px 8px', borderRadius: '4px',
                        fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap'
                      }}>
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div style={{ marginTop: '12px', flexGrow: 1 }}>
                    
                    <div style={{ 
                      fontSize: '14px', fontWeight: '600', color: '#222', marginTop: '8px',
                      lineHeight: '1.3', height: '36px', overflow: 'hidden', 
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {product.name}
                    </div>

                    <div style={{ fontSize: '12px', color: '#777', marginTop: '6px' }}>
                      {extractSize(product.name)}
                    </div>
                  </div>

                  {/* Price & Add Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#222' }}>
                      ₹{product.price.toFixed(0)}
                    </div>
                    
                    {product.stockQuantity > 0 ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                        style={{
                          border: '1px solid #318616', color: '#318616', backgroundColor: '#f4fbe9',
                          padding: '6px 18px', borderRadius: '6px', fontWeight: 'bold', 
                          fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase'
                        }}
                      >
                        ADD
                      </button>
                    ) : (
                      <button 
                        disabled
                        style={{
                          border: '1px solid #ccc', color: '#999', backgroundColor: '#f9f9f9',
                          padding: '6px 18px', borderRadius: '6px', fontWeight: 'bold', 
                          fontSize: '13px', cursor: 'not-allowed', textTransform: 'uppercase'
                        }}
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
