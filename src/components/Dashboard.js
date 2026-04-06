import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import './Dashboard.css';
import {
  PRODUCT_VISUALS, INITIAL_PRODUCTS, SAMPLE_ORDERS,
  SAMPLE_INVOICES, SAMPLE_PAYMENTS, TABS, EMPTY_FORM,
} from './data';

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

export default function Dashboard({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState('Profile');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [modalState, setModalState] = useState({ open: false, mode: null, product: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const fileInputRef = useRef(null);

  // ---------- Cart ----------
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // ---------- Product CRUD ----------
  const openAdd = () => { setForm(EMPTY_FORM); setFormErrors({}); setModalState({ open: true, mode: 'add', product: null }); };
  const openEdit = (product) => {
    setForm({ ...product, quantity: String(product.quantity), stock: String(product.stock), price: String(product.price) });
    setFormErrors({});
    setModalState({ open: true, mode: 'edit', product });
  };
  const openView = (product) => setModalState({ open: true, mode: 'view', product });
  const closeModal = () => setModalState({ open: false, mode: null, product: null });

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) errors.quantity = 'Valid quantity required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) errors.stock = 'Valid stock required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errors.price = 'Valid price required';
    if (!form.description.trim()) errors.description = 'Description is required';
    return errors;
  };

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    if (modalState.mode === 'add') {
      setProducts(prev => [...prev, {
        id: Date.now(), name: form.name.trim(), quantity: Number(form.quantity),
        stock: Number(form.stock), price: parseFloat(form.price), description: form.description.trim(),
      }]);
    } else {
      setProducts(prev => prev.map(p =>
        p.id === modalState.product.id
          ? { ...p, name: form.name.trim(), quantity: Number(form.quantity), stock: Number(form.stock), price: parseFloat(form.price), description: form.description.trim() }
          : p
      ));
    }
    closeModal();
  };

  const handleDelete = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null); };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ---------- Bulk Upload ----------
  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkError('');
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        const required = ['name', 'quantity', 'stock', 'price', 'description'];
        if (rows.length === 0) { setBulkError('File is empty.'); return; }
        const keys = Object.keys(rows[0]).map(k => k.toLowerCase());
        const missing = required.filter(r => !keys.includes(r));
        if (missing.length > 0) { setBulkError(`Missing columns: ${missing.join(', ')}`); return; }
        const newProducts = rows.map(row => ({
          id: Date.now() + Math.random(),
          name: String(row.name || row.Name).trim(),
          quantity: Number(row.quantity || row.Quantity) || 0,
          stock: Number(row.stock || row.Stock) || 0,
          price: parseFloat(row.price || row.Price) || 0,
          description: String(row.description || row.Description).trim(),
        })).filter(p => p.name);
        setProducts(prev => [...prev, ...newProducts]);
      } catch {
        setBulkError('Failed to parse file. Use CSV or Excel with columns: name, quantity, stock, price, description');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // ---------- Download Orders Excel ----------
  const downloadOrdersExcel = () => {
    const data = SAMPLE_ORDERS.map(o => ({
      'Order ID': o.id, 'Date': o.date, 'Items': o.items,
      'Total (₹)': o.total.toFixed(2), 'Status': o.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  };

  // ---------- Download Invoice PDF ----------
  const downloadInvoicePDF = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text('E-App', 20, 20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('INVOICE', 160, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('E-App Pvt Ltd', 20, 32);
    doc.text('Bangalore, India', 20, 38);
    doc.text('+91 1234567890', 20, 44);
    doc.setDrawColor(200);
    doc.line(20, 50, 190, 50);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Invoice ID: ${inv.id}`, 20, 60);
    doc.text(`Date: ${inv.date}`, 20, 68);
    doc.text(`Status: ${inv.status}`, 20, 76);
    doc.setFontSize(12);
    doc.setFillColor(240, 240, 255);
    doc.rect(20, 88, 170, 10, 'F');
    doc.setTextColor(50);
    doc.text('Description', 25, 95);
    doc.text('Amount', 160, 95);
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text('Services / Products', 25, 110);
    doc.text(`Rs. ${inv.amount.toFixed(2)}`, 155, 110);
    doc.setDrawColor(200);
    doc.line(20, 118, 190, 118);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 130, 128);
    doc.text(`Rs. ${inv.amount.toFixed(2)}`, 155, 128);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Thank you for your business!', 20, 270);
    doc.save(`${inv.id}.pdf`);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-icon">&#128274;</span>
          <span className="sidebar-brand">E-App</span>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button key={tab} className={`sidebar-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <span className="sidebar-tab-icon">{tabIcon(tab)}</span>
              {tab}
            </button>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={onLogout}>
          <span>&#x2192;</span> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dash-header">
          <h1 className="dash-title">{activeTab}</h1>

          {/* Cart Icon */}
          <div className="cart-area">
            <button className="cart-btn" onClick={() => setCartOpen(o => !o)}>
              <CartIcon />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {cartOpen && (
              <div className="cart-dropdown">
                <div className="cart-dropdown-header">
                  <strong>Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})</strong>
                  <button className="modal-close" onClick={() => setCartOpen(false)}>&#x2715;</button>
                </div>
                {cart.length === 0 ? (
                  <p className="cart-empty">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="cart-list">
                      {cart.map(c => (
                        <li key={c.id} className="cart-item">
                          <div className="cart-item-info">
                            <span className="cart-item-name">{c.name}</span>
                            <span className="cart-item-meta">Qty: {c.qty} &nbsp;|&nbsp; ₹{(c.price * c.qty).toFixed(2)}</span>
                          </div>
                          <button className="cart-remove" onClick={() => removeFromCart(c.id)}>&#x2715;</button>
                        </li>
                      ))}
                    </ul>
                    <div className="cart-total">
                      <span>Total</span>
                      <strong>₹{cartTotal.toFixed(2)}</strong>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="dash-content">
          {activeTab === 'Profile' && <ProfileTab email={userEmail} />}
          {activeTab === 'Products' && (
            <ProductsTab
              products={products}
              visuals={PRODUCT_VISUALS}
              onAdd={openAdd}
              onEdit={openEdit}
              onView={openView}
              onDelete={(id) => setDeleteConfirm(id)}
              onAddToCart={addToCart}
              onBulkUpload={() => fileInputRef.current.click()}
              bulkError={bulkError}
            />
          )}
          {activeTab === 'Orders' && <OrdersTab orders={SAMPLE_ORDERS} onDownload={downloadOrdersExcel} />}
          {activeTab === 'Invoices' && <InvoicesTab invoices={SAMPLE_INVOICES} onDownload={downloadInvoicePDF} />}
          {activeTab === 'Payments' && <PaymentsTab payments={SAMPLE_PAYMENTS} />}
        </div>
      </main>

      {/* Hidden bulk file input */}
      <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleBulkUpload} />

      {/* Product Modal */}
      {modalState.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalState.mode === 'add' ? 'Add Product' : modalState.mode === 'edit' ? 'Edit Product' : 'Product Details'}</h2>
              <button className="modal-close" onClick={closeModal}>&#x2715;</button>
            </div>
            {modalState.mode === 'view' ? (
              <div className="modal-view">
                <div className="view-row"><span>Name</span><strong>{modalState.product.name}</strong></div>
                <div className="view-row"><span>Quantity</span><strong>{modalState.product.quantity}</strong></div>
                <div className="view-row"><span>Stock</span><strong>{modalState.product.stock}</strong></div>
                <div className="view-row"><span>Price</span><strong>₹{modalState.product.price.toFixed(2)}</strong></div>
                <div className="view-row"><span>Description</span><strong>{modalState.product.description}</strong></div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={closeModal}>Close</button>
                  <button className="btn-edit" onClick={() => { closeModal(); openEdit(modalState.product); }}>Edit</button>
                </div>
              </div>
            ) : (
              <div className="modal-form">
                {[
                  { label: 'Product Name', name: 'name', type: 'text', placeholder: 'e.g. Wireless Headphones' },
                  { label: 'Quantity', name: 'quantity', type: 'number', placeholder: 'e.g. 50' },
                  { label: 'Stock', name: 'stock', type: 'number', placeholder: 'e.g. 35' },
                  { label: 'Price (₹)', name: 'price', type: 'number', placeholder: 'e.g. 79.99' },
                ].map(field => (
                  <div className="modal-field" key={field.name}>
                    <label>{field.label}</label>
                    <input type={field.type} name={field.name} value={form[field.name]}
                      onChange={handleFormChange} placeholder={field.placeholder}
                      className={formErrors[field.name] ? 'input-error' : ''}
                      min={field.type === 'number' ? '0' : undefined}
                      step={field.name === 'price' ? '0.01' : '1'} />
                    {formErrors[field.name] && <span className="error-msg">{formErrors[field.name]}</span>}
                  </div>
                ))}
                <div className="modal-field">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange}
                    placeholder="Product description..." rows={3}
                    className={formErrors.description ? 'input-error' : ''} />
                  {formErrors.description && <span className="error-msg">{formErrors.description}</span>}
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button className="btn-primary-sm" onClick={handleSave}>
                    {modalState.mode === 'add' ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Product</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>&#x2715;</button>
            </div>
            <p className="delete-msg">Are you sure you want to delete <strong>{products.find(p => p.id === deleteConfirm)?.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Tab Components ----

function ProfileTab({ email }) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">{email.charAt(0).toUpperCase()}</div>
      <h2 className="profile-name">{email.split('@')[0]}</h2>
      <p className="profile-email">{email}</p>
      <div className="profile-stats">
        <div className="stat"><span className="stat-value">3</span><span className="stat-label">Orders</span></div>
        <div className="stat"><span className="stat-value">₹489.94</span><span className="stat-label">Spent</span></div>
        <div className="stat"><span className="stat-value">Gold</span><span className="stat-label">Tier</span></div>
      </div>
      <div className="profile-info">
        <div className="info-row"><span>Member since</span><span>January 2025</span></div>
        <div className="info-row"><span>Account status</span><span className="badge-active">Active</span></div>
        <div className="info-row"><span>Phone</span><span>+91 1234567890</span></div>
        <div className="info-row"><span>Location</span><span>Bangalore, India</span></div>
      </div>
    </div>
  );
}

function ProductsTab({ products, visuals, onAdd, onEdit, onView, onDelete, onAddToCart, onBulkUpload, bulkError }) {
  const getVisual = (id, index) => visuals[index % visuals.length];

  return (
    <div>
      <div className="section-toolbar">
        <span className="section-count">{products.length} Products</span>
        <div className="toolbar-actions">
          <button className="btn-outline" onClick={onBulkUpload}>⬆ Bulk Upload</button>
          <button className="btn-primary-sm" onClick={onAdd}>+ Add Product</button>
        </div>
      </div>
      {bulkError && <p className="bulk-error">{bulkError}</p>}
      <div className="product-grid">
        {products.map((p, i) => {
          const visual = getVisual(p.id, i);
          return (
            <div key={p.id} className="product-card">
              {/* Cart button top-right overlay */}
              <button className="card-cart-btn" onClick={() => onAddToCart(p)} title="Add to cart">
                🛒
              </button>

              {/* Image area with hover overlay */}
              <div className="product-img-wrap" style={{ background: visual.bg }}>
                <span className="product-emoji">{visual.emoji}</span>
                {/* Hover overlay */}
                <div className="product-img-overlay">
                  <p className="overlay-desc">{p.description}</p>
                  <div className="overlay-meta">
                    <span>Stock: <strong>{p.stock}</strong></span>
                    <span>Qty: <strong>{p.quantity}</strong></span>
                  </div>
                  <button className="overlay-view-btn" onClick={() => onView(p)}>View Details</button>
                </div>
              </div>

              {/* Card body */}
              <div className="product-card-body">
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-price">₹{p.price.toFixed(2)}</p>
                <div className="product-card-actions">
                  <button className="btn-edit" onClick={() => onEdit(p)}>Edit</button>
                  <button className="card-delete-btn" onClick={() => onDelete(p.id)} title="Delete">🗑</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersTab({ orders, onDownload }) {
  return (
    <div>
      <div className="section-toolbar">
        <span className="section-count">{orders.length} Orders</span>
        <button className="btn-outline" onClick={onDownload}>⬇ Download Excel</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.date}</td>
                <td>{o.items}</td>
                <td>₹{o.total.toFixed(2)}</td>
                <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesTab({ invoices, onDownload }) {
  return (
    <div>
      <div className="section-toolbar">
        <span className="section-count">{invoices.length} Invoices</span>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Invoice ID</th><th>Date</th><th>Amount</th><th>Status</th><th>Download</th></tr></thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td><strong>{inv.id}</strong></td>
                <td>{inv.date}</td>
                <td>₹{inv.amount.toFixed(2)}</td>
                <td><span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                <td>
                  <button className="btn-outline btn-sm" onClick={() => onDownload(inv)}>⬇ PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsTab({ payments }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead><tr><th>Payment ID</th><th>Date</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {payments.map(pay => (
            <tr key={pay.id}>
              <td><strong>{pay.id}</strong></td>
              <td>{pay.date}</td>
              <td>{pay.method}</td>
              <td>₹{pay.amount.toFixed(2)}</td>
              <td><span className={`status-badge ${pay.status.toLowerCase()}`}>{pay.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function tabIcon(tab) {
  const icons = { Profile: '👤', Products: '📦', Orders: '🛒', Invoices: '🧾', Payments: '💳' };
  return icons[tab] || '';
}
