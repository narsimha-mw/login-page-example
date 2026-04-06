import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import './Dashboard.css';
import {
  INITIAL_PRODUCTS, SAMPLE_ORDERS, SAMPLE_INVOICES,
  SAMPLE_PAYMENTS, PAYMENT_OPTIONS, TABS, EMPTY_FORM,
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
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [invoices, setInvoices] = useState(SAMPLE_INVOICES);
  const [payments, setPayments] = useState(SAMPLE_PAYMENTS);

  // Product modal
  const [modalState, setModalState] = useState({ open: false, mode: null, product: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Cart
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Payment modal
  const [paymentModal, setPaymentModal] = useState({ open: false, order: null, method: '' });
  const [paySuccess, setPaySuccess] = useState(false);

  // Bulk upload
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
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  // ---------- Place Order ----------
  const placeOrder = () => {
    if (cart.length === 0) return;
    const today = new Date().toISOString().split('T')[0];
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: today,
      items: cartCount,
      total: parseFloat(cartTotal.toFixed(2)),
      status: 'Pending Payment',
      cart: [...cart],
    };
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setCartOpen(false);
    setActiveTab('Orders');
  };

  // ---------- Payment ----------
  const openPayment = (order) => setPaymentModal({ open: true, order, method: '' });

  const handlePayment = () => {
    if (!paymentModal.method) return;
    const today = new Date().toISOString().split('T')[0];
    const order = paymentModal.order;

    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Delivered' } : o));

    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      date: today,
      amount: order.total,
      status: 'Paid',
      orderId: order.id,
    };
    setInvoices(prev => [...prev, newInvoice]);

    const methodLabel = PAYMENT_OPTIONS.find(p => p.id === paymentModal.method)?.label || paymentModal.method;
    const newPayment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      date: today,
      method: methodLabel,
      amount: order.total,
      status: 'Success',
    };
    setPayments(prev => [...prev, newPayment]);

    setPaySuccess(true);
  };

  const closePaymentModal = () => {
    if (paySuccess) {
      setActiveTab('Invoices');
    }
    setPaymentModal({ open: false, order: null, method: '' });
    setPaySuccess(false);
  };

  // ---------- Product CRUD ----------
  const openAdd = () => { setForm(EMPTY_FORM); setFormErrors({}); setModalState({ open: true, mode: 'add', product: null }); };
  const openEdit = (p) => {
    setForm({ ...p, quantity: String(p.quantity), stock: String(p.stock), price: String(p.price), image: p.image || '' });
    setFormErrors({});
    setModalState({ open: true, mode: 'edit', product: p });
  };
  const openView = (p) => setModalState({ open: true, mode: 'view', product: p });
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
    const idx = products.length;
    if (modalState.mode === 'add') {
      setProducts(prev => [...prev, {
        id: Date.now(), name: form.name.trim(), quantity: Number(form.quantity),
        stock: Number(form.stock), price: parseFloat(form.price),
        description: form.description.trim(),
        image: form.image.trim() || `https://picsum.photos/seed/prod${idx}/400/300`,
      }]);
    } else {
      setProducts(prev => prev.map(p => p.id === modalState.product.id
        ? { ...p, name: form.name.trim(), quantity: Number(form.quantity), stock: Number(form.stock), price: parseFloat(form.price), description: form.description.trim(), image: form.image.trim() || p.image }
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

  // ---------- Download Bulk Template ----------
  const downloadBulkTemplate = () => {
    const headers = [{ name: '', quantity: '', stock: '', price: '', description: '' }];
    const ws = XLSX.utils.json_to_sheet(headers);
    // Remove the single empty data row — keep only the header row
    ws['!ref'] = 'A1:E1';
    ws['!cols'] = [{ wch: 24 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'bulk_products_template.xlsx');
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
        if (rows.length === 0) { setBulkError('File is empty.'); return; }
        const keys = Object.keys(rows[0]).map(k => k.toLowerCase());
        const missing = ['name', 'quantity', 'stock', 'price', 'description'].filter(r => !keys.includes(r));
        if (missing.length > 0) { setBulkError(`Missing columns: ${missing.join(', ')}`); return; }
        const newProds = rows.map((row, i) => ({
          id: Date.now() + i,
          name: String(row.name || row.Name).trim(),
          quantity: Number(row.quantity || row.Quantity) || 0,
          stock: Number(row.stock || row.Stock) || 0,
          price: parseFloat(row.price || row.Price) || 0,
          description: String(row.description || row.Description).trim(),
          image: `https://picsum.photos/seed/bulk${Date.now() + i}/400/300`,
        })).filter(p => p.name);
        setProducts(prev => [...prev, ...newProds]);
      } catch {
        setBulkError('Failed to parse file. Use CSV/Excel with columns: name, quantity, stock, price, description');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // ---------- Downloads ----------
  const downloadOrdersExcel = () => {
    const data = orders.map(o => ({
      'Order ID': o.id, 'Date': o.date, 'Items': o.items,
      'Total (₹)': o.total.toFixed(2), 'Status': o.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  };

  const downloadInvoicePDF = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(102, 126, 234);
    doc.text('E-App', 20, 22);
    doc.setTextColor(0); doc.setFontSize(16);
    doc.text('INVOICE', 155, 22);
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text('E-App Pvt Ltd', 20, 34);
    doc.text('Bangalore, India', 20, 40);
    doc.text('+91 1234567890', 20, 46);
    doc.setDrawColor(200); doc.line(20, 52, 190, 52);
    doc.setFontSize(11); doc.setTextColor(0);
    doc.text(`Invoice ID : ${inv.id}`, 20, 62);
    doc.text(`Order ID   : ${inv.orderId || '-'}`, 20, 70);
    doc.text(`Date       : ${inv.date}`, 20, 78);
    doc.text(`Status     : ${inv.status}`, 20, 86);
    doc.setFillColor(240, 240, 255);
    doc.rect(20, 96, 170, 10, 'F');
    doc.setTextColor(60);
    doc.text('Description', 25, 103); doc.text('Amount', 158, 103);
    doc.setTextColor(0);
    doc.text('Services / Products', 25, 116);
    doc.text(`Rs. ${inv.amount.toFixed(2)}`, 154, 116);
    doc.setDrawColor(200); doc.line(20, 124, 190, 124);
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text('Total :', 128, 134);
    doc.text(`Rs. ${inv.amount.toFixed(2)}`, 154, 134);
    doc.setFont(undefined, 'normal'); doc.setFontSize(9); doc.setTextColor(150);
    doc.text('Thank you for your business!', 20, 270);
    doc.save(`${inv.id}.pdf`);
  };

  // ---------- Render ----------
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
              <span className="sidebar-tab-icon">{tabIcon(tab)}</span>{tab}
            </button>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={onLogout}><span>&#x2192;</span> Logout</button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dash-header">
          <h1 className="dash-title">{activeTab}</h1>
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
                      <span>Total</span><strong>₹{cartTotal.toFixed(2)}</strong>
                    </div>
                    <div className="cart-footer">
                      <button className="btn-place-order" onClick={placeOrder}>Place Order</button>
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
              onAdd={openAdd} onEdit={openEdit} onView={openView}
              onDelete={(id) => setDeleteConfirm(id)} onAddToCart={addToCart}
              onBulkUpload={() => fileInputRef.current.click()}
              onDownloadTemplate={downloadBulkTemplate}
              bulkError={bulkError}
            />
          )}
          {activeTab === 'Orders' && <OrdersTab orders={orders} onDownload={downloadOrdersExcel} onPay={openPayment} />}
          {activeTab === 'Invoices' && <InvoicesTab invoices={invoices} onDownload={downloadInvoicePDF} />}
          {activeTab === 'Payments' && <PaymentsTab payments={payments} />}
        </div>
      </main>

      {/* Hidden bulk input */}
      <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleBulkUpload} />

      {/* Product Add/Edit/View Modal */}
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
                  { label: 'Image URL (optional)', name: 'image', type: 'text', placeholder: 'https://...' },
                ].map(field => (
                  <div className="modal-field" key={field.name}>
                    <label>{field.label}</label>
                    <input type={field.type} name={field.name} value={form[field.name]}
                      onChange={handleFormChange} placeholder={field.placeholder}
                      className={formErrors[field.name] ? 'input-error' : ''}
                      min={field.type === 'number' ? '0' : undefined}
                      step={field.name === 'price' ? '0.01' : undefined} />
                    {formErrors[field.name] && <span className="error-msg">{formErrors[field.name]}</span>}
                  </div>
                ))}
                <div className="modal-field">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange}
                    placeholder="Product description..." rows={3} className={formErrors.description ? 'input-error' : ''} />
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
            <p className="delete-msg">Are you sure you want to delete <strong>{products.find(p => p.id === deleteConfirm)?.name}</strong>?</p>
            <div className="modal-actions modal-actions-center">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.open && (
        <div className="modal-overlay" onClick={!paySuccess ? closePaymentModal : undefined}>
          <div className="modal payment-modal" onClick={e => e.stopPropagation()}>
            {paySuccess ? (
              <div className="pay-success">
                <div className="pay-success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p>Your invoice has been generated automatically.</p>
                <button className="btn-primary-sm" onClick={closePaymentModal}>View Invoices</button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Complete Payment</h2>
                  <button className="modal-close" onClick={closePaymentModal}>&#x2715;</button>
                </div>
                <div className="payment-body">
                  {/* Order Summary */}
                  <div className="pay-order-summary">
                    <p className="pay-order-id">Order: <strong>{paymentModal.order.id}</strong> &nbsp;|&nbsp; {paymentModal.order.date}</p>
                    {paymentModal.order.cart && paymentModal.order.cart.length > 0 && (
                      <ul className="pay-items-list">
                        {paymentModal.order.cart.map(c => (
                          <li key={c.id}>
                            <span>{c.name} × {c.qty}</span>
                            <span>₹{(c.price * c.qty).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="pay-total-row">
                      <span>Total Amount</span>
                      <strong className="pay-amount">₹{paymentModal.order.total.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <p className="pay-method-label">Select Payment Method</p>
                  <div className="pay-methods">
                    {PAYMENT_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        className={`pay-method-btn ${paymentModal.method === opt.id ? 'selected' : ''}`}
                        onClick={() => setPaymentModal(prev => ({ ...prev, method: opt.id }))}
                      >
                        <span className="pay-method-icon">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn-pay-now"
                    disabled={!paymentModal.method}
                    onClick={handlePayment}
                  >
                    Pay ₹{paymentModal.order.total.toFixed(2)}
                  </button>
                </div>
              </>
            )}
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

function ProductsTab({ products, onAdd, onEdit, onView, onDelete, onAddToCart, onBulkUpload, onDownloadTemplate, bulkError }) {
  return (
    <div>
      <div className="section-toolbar">
        <span className="section-count">{products.length} Products</span>
        <div className="toolbar-actions">
          <button className="btn-outline" onClick={onDownloadTemplate}>⬇ Sample Template</button>
          <button className="btn-outline" onClick={onBulkUpload}>⬆ Bulk Upload</button>
          <button className="btn-primary-sm" onClick={onAdd}>+ Add Product</button>
        </div>
      </div>
      {bulkError && <p className="bulk-error">{bulkError}</p>}
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            {/* Cart button — top right */}
            <button className="card-cart-btn" onClick={() => onAddToCart(p)} title="Add to cart">🛒</button>

            {/* Full-BG image with hover overlay */}
            <div
              className="product-img-bg"
              style={{ backgroundImage: `url(${p.image})` }}
            >
              <div className="product-img-overlay">
                <p className="overlay-desc">{p.description}</p>
                <div className="overlay-actions">
                  <button className="overlay-view-btn" onClick={() => onView(p)}>View</button>
                  <button className="overlay-edit-btn" onClick={() => onEdit(p)}>Edit</button>
                </div>
              </div>
            </div>

            {/* Card info */}
            <div className="product-card-info">
              <div className="product-card-text">
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-price">₹{p.price.toFixed(2)}</p>
              </div>
              <button className="card-delete-btn" onClick={() => onDelete(p.id)} title="Delete">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ orders, onDownload, onPay }) {
  return (
    <div>
      <div className="section-toolbar">
        <span className="section-count">{orders.length} Orders</span>
        <button className="btn-outline" onClick={onDownload}>⬇ Download Excel</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Order ID</th><th>Date</th><th>Products</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.date}</td>
                <td className="td-products">
                  {o.cart && o.cart.length > 0
                    ? o.cart.map(c => (
                        <span key={c.id} className="product-tag">{c.name} ×{c.qty}</span>
                      ))
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>{o.items}</td>
                <td>₹{o.total.toFixed(2)}</td>
                <td><span className={`status-badge ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                <td>
                  {o.status === 'Pending Payment' && (
                    <button className="btn-pay-cta" onClick={() => onPay(o)}>💳 Pay Now</button>
                  )}
                </td>
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
          <thead><tr><th>Invoice ID</th><th>Order ID</th><th>Date</th><th>Amount</th><th>Status</th><th>Download</th></tr></thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td><strong>{inv.id}</strong></td>
                <td>{inv.orderId || '-'}</td>
                <td>{inv.date}</td>
                <td>₹{inv.amount.toFixed(2)}</td>
                <td><span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                <td><button className="btn-outline btn-sm" onClick={() => onDownload(inv)}>⬇ PDF</button></td>
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
