import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../store/api.js';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiBox, FiPlus, FiTrash2, FiEdit2, FiCheck, FiRefreshCw } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeSubTab, setActiveSubTab] = useState('products'); // 'products', 'orders', 'users'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Datasets
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Create/Update Product
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: prodData } = await api.get('/products?limit=100');
      setProducts(prodData.products || []);

      const { data: ordData } = await api.get('/orders');
      setOrders(ordData || []);

      // Mock users list or API get users
      setUsers([
        { id: 'u-1', name: 'Samir Thapa', email: 'samir@thapamart.com', role: 'admin' },
        { id: 'u-2', name: 'John Customer', email: 'john@gmail.com', role: 'customer' }
      ]);
    } catch (err) {
      console.warn("ℹ️ API failed. Loading premium simulated datasets in Admin Console.");
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setProducts([
      { id: "prod-1", title: "Pro Sound Max Wireless Headphones", category: "electronics", price: 189.99, stock: 25 },
      { id: "prod-2", title: "Minimalist Leather Smart Watch", category: "electronics", price: 249.99, stock: 15 },
      { id: "prod-3", title: "Classic Cotton Bomber Jacket", category: "fashion", price: 89.99, stock: 50 }
    ]);
    setOrders([
      { id: "ord-1", user: { name: 'Samir Thapa' }, totalPrice: 229.69, paymentStatus: 'Paid', orderStatus: 'Shipped' },
      { id: "ord-2", user: { name: 'John Customer' }, totalPrice: 89.99, paymentStatus: 'Pending', orderStatus: 'Pending' }
    ]);
    setUsers([
      { id: 'u-1', name: 'Samir Thapa', email: 'samir@thapamart.com', role: 'admin' },
      { id: 'u-2', name: 'John Customer', email: 'john@gmail.com', role: 'customer' }
    ]);
  };

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [userInfo, navigate]);

  // Live order processing simulation interval
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const nextOrders = prevOrders.map(o => {
          if (o.paymentStatus === 'Paid') {
            if (o.orderStatus === 'Pending' || o.orderStatus === 'Processing') {
              changed = true;
              return { ...o, orderStatus: 'Shipped' };
            } else if (o.orderStatus === 'Shipped') {
              changed = true;
              return { ...o, orderStatus: 'Delivered' };
            }
          }
          return o;
        });
        return nextOrders;
      });
    }, 8000); // Auto-advance every 8 seconds

    return () => clearInterval(timer);
  }, []);

  const handleToggleUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await api.put(`/auth/users/${userId}/role`, { role: nextRole });
      fetchData();
    } catch (err) {
      setUsers(users.map(u => (u.id === userId || u._id === userId) ? { ...u, role: nextRole } : u));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, category, price: Number(price), stock: Number(stock) };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      // Simulate on mock state
      if (editingId) {
        setProducts(products.map(p => p.id === editingId ? { ...p, ...payload } : p));
      } else {
        setProducts([...products, { id: `prod-mock-${Date.now()}`, ...payload }]);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('electronics');
    setPrice('');
    setStock('');
    setEditingId(null);
  };

  const handleEditProductClick = (p) => {
    setEditingId(p.id || p._id);
    setTitle(p.title);
    setDescription(p.description || '');
    setCategory(p.category);
    setPrice(p.price);
    setStock(p.stock);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      setProducts(products.filter(p => p.id !== id && p._id !== id));
    }
  };

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    const nextStatusMap = {
      'Pending': 'Processing',
      'Processing': 'Shipped',
      'Shipped': 'Delivered',
      'Delivered': 'Pending'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Pending';

    try {
      await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      fetchData();
    } catch (err) {
      setOrders(orders.map(o => (o.id === orderId || o._id === orderId) ? { ...o, orderStatus: nextStatus } : o));
    }
  };

  // Math variables
  const totalSales = orders.reduce((acc, o) => o.paymentStatus === 'Paid' ? acc + o.totalPrice : acc, 0).toFixed(2);
  const productsCount = products.length;
  const ordersCount = orders.length;

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '4rem 0', minHeight: '100vh', background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 900, color: '#09090B', lineHeight: 1.1 }}>
              Admin Console
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#71717A', margin: '0.5rem 0 0 0' }}>
              Manage ThapaMart system databases, products, and customer orders.
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: '#000000',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <FiRefreshCw /> <span>Refresh Data</span>
          </button>
        </div>

        {/* Analytics metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', letterSpacing: '0.05em' }}>
              Total Revenue
            </span>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#09090B', margin: '0.5rem 0 0 0', fontFamily: "'Cormorant Garamond', serif" }}>
              Rs. {Number(totalSales * 133).toLocaleString('en-NP')}
            </p>
          </div>

          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', letterSpacing: '0.05em' }}>
              Total Orders
            </span>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#09090B', margin: '0.5rem 0 0 0', fontFamily: "'Cormorant Garamond', serif" }}>
              {ordersCount}
            </p>
          </div>

          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', letterSpacing: '0.05em' }}>
              Catalog Items
            </span>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#09090B', margin: '0.5rem 0 0 0', fontFamily: "'Cormorant Garamond', serif" }}>
              {productsCount}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Sub Navigation */}
          <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveSubTab('products')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: activeSubTab === 'products' ? '#000000' : '#FFFFFF',
                color: activeSubTab === 'products' ? '#FFFFFF' : '#09090B',
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <FiBox size={16} /> Products Catalog
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: activeSubTab === 'orders' ? '#000000' : '#FFFFFF',
                color: activeSubTab === 'orders' ? '#FFFFFF' : '#09090B',
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <FiShoppingBag size={16} /> Orders Management
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: activeSubTab === 'users' ? '#000000' : '#FFFFFF',
                color: activeSubTab === 'users' ? '#FFFFFF' : '#09090B',
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <FiUsers size={16} /> Users Directory
            </button>
          </div>

          {/* Sub Content Area */}
          <div className="lg:col-span-3">
            
            {/* Products CRUD sub tab view */}
            {activeSubTab === 'products' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                
                {/* Visual Category Distribution Progress Bars */}
                {products.length > 0 && (
                  <div style={{ border: '1px solid #E5E7EB', padding: '1.5rem', background: '#F9FAFB' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem 0', color: '#09090B' }}>
                      Category Distribution
                    </h4>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      {Object.entries(categoryCounts).map(([cat, count]) => {
                        const pct = ((count / products.length) * 100).toFixed(0);
                        return (
                          <div key={cat} style={{ flexGrow: 1, minWidth: '130px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', marginBottom: '0.35rem' }}>
                              <span>{cat}</span>
                              <span>{count} items ({pct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#E5E7EB' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#000000' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Form to Create/Update */}
                <div style={{ border: '1px solid #E5E7EB', padding: '2.5rem', background: '#F9FAFB' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', borderBottom: '1px solid #09090B', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiPlus /> {editingId ? 'Edit Product' : 'Add New Product'}
                  </h3>

                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#71717A', marginBottom: '0.5rem' }}>Product Title</label>
                      <input
                        type="text"
                        required
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.875rem 1rem', color: '#09090B', fontSize: '0.875rem', outline: 'none' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#71717A', marginBottom: '0.5rem' }}>Category</label>
                      <select
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.875rem 1rem', color: '#09090B', fontSize: '0.875rem', outline: 'none' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home-living">Home & Living</option>
                        <option value="beauty">Beauty</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#71717A', marginBottom: '0.5rem' }}>Description</label>
                      <textarea
                        required
                        rows="3"
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.875rem 1rem', color: '#09090B', fontSize: '0.875rem', outline: 'none' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#71717A', marginBottom: '0.5rem' }}>Price (Rs.)</label>
                      <input
                        type="number"
                        required
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.875rem 1rem', color: '#09090B', fontSize: '0.875rem', outline: 'none' }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#71717A', marginBottom: '0.5rem' }}>Stock Level</label>
                      <input
                        type="number"
                        required
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.875rem 1rem', color: '#09090B', fontSize: '0.875rem', outline: 'none' }}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            color: '#09090B',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        style={{
                          padding: '0.75rem 2rem',
                          background: '#000000',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          cursor: 'pointer'
                        }}
                      >
                        {editingId ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Table list of products */}
                <div style={{ border: '1px solid #E5E7EB' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#09090B', color: '#FFFFFF' }}>
                        <th style={{ padding: '1rem' }}>Title</th>
                        <th style={{ padding: '1rem' }}>Category</th>
                        <th style={{ padding: '1rem' }}>Price</th>
                        <th style={{ padding: '1rem' }}>Stock</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id || p._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '1rem', fontWeight: 700 }}>{p.title}</td>
                          <td style={{ padding: '1rem', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 800, color: '#71717A' }}>{p.category}</td>
                          <td style={{ padding: '1rem', fontWeight: 900 }}>Rs. {Number(p.price).toLocaleString()}</td>
                          <td style={{ 
                            padding: '1rem', 
                            color: p.stock <= 5 ? '#EF4444' : 'inherit', 
                            fontWeight: p.stock <= 5 ? 700 : 'normal' 
                          }}>
                            {p.stock} units {p.stock <= 5 && '⚠️ (Low)'}
                          </td>
                          <td style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEditProductClick(p)}
                              style={{ background: 'transparent', border: 'none', color: '#09090B', cursor: 'pointer', padding: '0.25rem' }}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id || p._id)}
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.25rem' }}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Orders list view */}
            {activeSubTab === 'orders' && (
              <div style={{ border: '1px solid #E5E7EB' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#09090B', color: '#FFFFFF' }}>
                      <th style={{ padding: '1rem' }}>Reference</th>
                      <th style={{ padding: '1rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Total</th>
                      <th style={{ padding: '1rem' }}>Payment</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id || o._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td 
                          onClick={() => setSelectedOrder(o)}
                          style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 750, color: '#09090B', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {o.id || o._id}
                        </td>
                        <td style={{ padding: '1rem' }}>{o.user?.name || 'Anonymous'}</td>
                        <td style={{ padding: '1rem', fontWeight: 900 }}>Rs. {Number(o.totalPrice).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: o.paymentStatus === 'Paid' ? '#ECFDF5' : '#FEF2F2',
                            color: o.paymentStatus === 'Paid' ? '#065F46' : '#991B1B',
                            borderRadius: '2px'
                          }}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>{o.orderStatus}</td>
                        <td style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id || o._id, o.orderStatus)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.4rem 0.75rem',
                              background: '#000000',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              cursor: 'pointer'
                            }}
                          >
                            <FiCheck /> <span>Advance</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users view */}
            {activeSubTab === 'users' && (
              <div style={{ border: '1px solid #E5E7EB' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#09090B', color: '#FFFFFF' }}>
                      <th style={{ padding: '1rem' }}>ID</th>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#71717A' }}>{u.id}</td>
                        <td style={{ padding: '1rem', fontWeight: 700 }}>{u.name}</td>
                        <td style={{ padding: '1rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              background: u.role === 'admin' ? '#000000' : '#F3F4F6',
                              color: u.role === 'admin' ? '#FFFFFF' : '#09090B',
                              borderRadius: '2px'
                            }}>
                              {u.role}
                            </span>
                            <button
                              onClick={() => handleToggleUserRole(u.id || u._id, u.role)}
                              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.25rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                            >
                              Toggle Role
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #000000', padding: '2.5rem', width: '100%', maxWidth: '550px', position: 'relative' }}>
            <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.25rem', fontWeight: 900, marginBottom: '1.5rem', color: '#09090B' }}>Order Details</h3>
            
            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#374151' }}>
              <div>
                <strong>Order Reference:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedOrder.id || selectedOrder._id}</span>
              </div>
              <div>
                <strong>Customer Profile:</strong> {selectedOrder.user?.name || 'Anonymous'}
              </div>
              <div>
                <strong>Shipping Destination:</strong><br/>
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country}
              </div>
              <div>
                <strong>Items Summary:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid #E5E7EB', padding: '0.75rem', background: '#F9FAFB' }}>
                  {selectedOrder.products?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {item.image && <img src={item.image} style={{ width: '30px', height: '40px', objectFit: 'cover' }} />}
                      <div style={{ flexGrow: 1 }}>
                        <span style={{ fontWeight: 700, color: '#09090B' }}>{item.title}</span><br/>
                        <span style={{ fontSize: '0.7rem', color: '#71717A' }}>Qty: {item.quantity} &bull; Rs. {Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
                <span><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</span>
                <span><strong>Order Fulfillment:</strong> {selectedOrder.orderStatus}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {selectedOrder.paymentStatus !== 'Paid' && (
                  <button
                    onClick={async () => {
                      try {
                        await api.put(`/orders/${selectedOrder.id || selectedOrder._id}/pay`, { id: 'manual_override', status: 'Succeeded' });
                        setSelectedOrder(null);
                        fetchData();
                      } catch (err) {
                        setOrders(orders.map(o => (o.id === selectedOrder.id || o._id === selectedOrder._id) ? { ...o, paymentStatus: 'Paid', orderStatus: 'Processing' } : o));
                        setSelectedOrder(null);
                      }
                    }}
                    style={{ padding: '0.6rem 1.25rem', background: '#000000', color: '#FFFFFF', border: 'none', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    Mark as Paid (Override)
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ padding: '0.6rem 1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#09090B', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
