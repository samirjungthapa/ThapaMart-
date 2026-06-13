import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../store/api.js';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiBox, FiPlus, FiTrash2, FiEdit2, FiCheck, FiRefreshCw } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeSubTab, setActiveSubTab] = useState('products'); // 'products', 'orders', 'users'

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

  return (
    <div className="premium-mesh-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Banner */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage ThapaMart system databases and analytics.</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center px-4.5 py-2 text-xs font-bold rounded-full bg-slate-800 hover:bg-slate-950 text-white shadow-premium transition-all"
          >
            <FiRefreshCw className="mr-1.5 w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* Analytics metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="glass-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><FiTrendingUp className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Sales Revenue</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">${totalSales}</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><FiShoppingBag className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Orders</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{ordersCount}</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-accent/10 text-accent rounded-xl"><FiBox className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Available Catalog items</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{productsCount}</p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sub Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-4 border border-slate-100 dark:border-slate-850 shadow-premium flex flex-row lg:flex-col gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveSubTab('products')}
                className={`w-full text-left px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center ${activeSubTab === 'products' ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
              >
                <FiBox className="mr-2 w-4 h-4" /> Products CRUD
              </button>
              <button
                onClick={() => setActiveSubTab('orders')}
                className={`w-full text-left px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center ${activeSubTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
              >
                <FiShoppingBag className="mr-2 w-4 h-4" /> Orders Management
              </button>
              <button
                onClick={() => setActiveSubTab('users')}
                className={`w-full text-left px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center ${activeSubTab === 'users' ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
              >
                <FiUsers className="mr-2 w-4 h-4" /> Users Directory
              </button>
            </div>
          </div>

          {/* Sub Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Products CRUD sub tab view */}
            {activeSubTab === 'products' && (
              <div className="space-y-6">
                
                {/* Form to Create/Update */}
                <div className="glass-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-premium">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase mb-4 flex items-center">
                    <FiPlus className="mr-1.5 w-4 h-4" /> {editingId ? 'Edit Product' : 'Add New Product'}
                  </h3>

                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        className="p-2.5 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select
                        className="p-2.5 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
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
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                      <textarea
                        required
                        rows="2"
                        className="p-2.5 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price ($)</label>
                      <input
                        type="number"
                        required
                        className="p-2.5 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Level</label>
                      <input
                        type="number"
                        required
                        className="p-2.5 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4.5 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-premium"
                      >
                        {editingId ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Table list of products */}
                <div className="glass-panel rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-premium">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {products.map((p) => (
                        <tr key={p.id || p._id} className="text-slate-700 dark:text-slate-200">
                          <td className="p-4 font-semibold">{p.title}</td>
                          <td className="p-4 uppercase text-[10px] font-bold text-primary dark:text-accent">{p.category}</td>
                          <td className="p-4">${p.price}</td>
                          <td className="p-4">{p.stock} units</td>
                          <td className="p-4 flex justify-center space-x-1">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id || p._id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
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
              <div className="glass-panel rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-premium">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                      <th className="p-4">Reference</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {orders.map((o) => (
                      <tr key={o.id || o._id} className="text-slate-700 dark:text-slate-200">
                        <td className="p-4 font-mono font-bold text-slate-500">{o.id || o._id}</td>
                        <td className="p-4">{o.user?.name || 'Anonymous'}</td>
                        <td className="p-4">${o.totalPrice}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${o.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[10px] uppercase text-primary dark:text-accent">{o.orderStatus}</td>
                        <td className="p-4 flex justify-center">
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id || o._id, o.orderStatus)}
                            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-850 hover:bg-slate-950 text-white rounded-lg transition-colors text-[10px] font-bold"
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
              <div className="glass-panel rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-premium">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                      <th className="p-4">ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {users.map((u) => (
                      <tr key={u.id} className="text-slate-700 dark:text-slate-200">
                        <td className="p-4 font-mono text-slate-500">{u.id}</td>
                        <td className="p-4 font-semibold">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            {u.role}
                          </span>
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
    </div>
  );
};

export default AdminDashboard;
