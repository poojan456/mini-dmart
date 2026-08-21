import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    Swal.fire({
      title: 'Add New Product',
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Product Name">
        <input id="swal-input-desc" class="swal2-input" placeholder="Description">
        <input id="swal-input-price" class="swal2-input" type="number" placeholder="Price (₹)">
        <input id="swal-input-stock" class="swal2-input" type="number" placeholder="Stock Quantity">
        <input id="swal-input-cat" class="swal2-input" placeholder="Category (e.g. Dairy, Fruits)">
        <input id="swal-input-img" class="swal2-input" placeholder="Image URL">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#0c8346',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input-name').value,
          description: document.getElementById('swal-input-desc').value,
          price: parseFloat(document.getElementById('swal-input-price').value),
          stockQuantity: parseInt(document.getElementById('swal-input-stock').value),
          category: document.getElementById('swal-input-cat').value,
          imageUrl: document.getElementById('swal-input-img').value
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value.name && result.value.price) {
        try {
          await api.post('/products', result.value);
          Swal.fire('Added!', 'Product has been added.', 'success');
          fetchProducts();
        } catch (err) {
          Swal.fire('Error', 'Failed to add product', 'error');
        }
      }
    });
  };

  const handleEditProduct = (product) => {
    Swal.fire({
      title: 'Edit Product',
      html: `
        <input id="swal-edit-name" class="swal2-input" placeholder="Product Name" value="${product.name}">
        <input id="swal-edit-desc" class="swal2-input" placeholder="Description" value="${product.description}">
        <input id="swal-edit-price" class="swal2-input" type="number" placeholder="Price (₹)" value="${product.price}">
        <input id="swal-edit-stock" class="swal2-input" type="number" placeholder="Stock Quantity" value="${product.stockQuantity}">
        <input id="swal-edit-cat" class="swal2-input" placeholder="Category" value="${product.category}">
        <input id="swal-edit-img" class="swal2-input" placeholder="Image URL" value="${product.imageUrl || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#0c8346',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-edit-name').value,
          description: document.getElementById('swal-edit-desc').value,
          price: parseFloat(document.getElementById('swal-edit-price').value),
          stockQuantity: parseInt(document.getElementById('swal-edit-stock').value),
          category: document.getElementById('swal-edit-cat').value,
          imageUrl: document.getElementById('swal-edit-img').value
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(\`/products/\${product.id}\`, result.value);
          Swal.fire('Updated!', 'Product has been updated.', 'success');
          fetchProducts();
        } catch (err) {
          Swal.fire('Error', 'Failed to update product', 'error');
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(\`/products/\${id}\`);
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          fetchProducts();
        } catch (err) {
          Swal.fire('Error', 'Failed to delete product', 'error');
        }
      }
    });
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: 0 }}>Manage Products</h2>
        <button 
          className="btn"
          style={{ backgroundColor: '#0c8346', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
          onClick={handleAddProduct}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4fbe9', color: '#0c8346' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{product.id}</td>
                <td style={tdStyle}>
                  <img src={product.imageUrl || `https://placehold.co/50?text=No+Img`} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>₹{product.price.toFixed(2)}</td>
                <td style={tdStyle}>
                  <span style={{ color: product.stockQuantity > 0 ? '#0c8346' : '#dc3545', fontWeight: 'bold' }}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleEditProduct(product)} style={actionBtnStyle('#0277bd')} title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} style={actionBtnStyle('#dc3545')} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 15px', fontWeight: '600', borderBottom: '2px solid #e8f5e9' };
const tdStyle = { padding: '12px 15px', color: '#555' };
const actionBtnStyle = (color) => ({
  background: 'none', border: 'none', color: color, cursor: 'pointer', padding: '5px', marginRight: '5px'
});

export default AdminProducts;
