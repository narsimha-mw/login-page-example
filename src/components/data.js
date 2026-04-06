export const PRODUCT_VISUALS = [
  { emoji: '🎧', bg: '#e0e7ff' },
  { emoji: '⌨️', bg: '#fce7f3' },
  { emoji: '🔌', bg: '#dcfce7' },
  { emoji: '📷', bg: '#fef9c3' },
  { emoji: '💡', bg: '#ffedd5' },
  { emoji: '💻', bg: '#e0f2fe' },
  { emoji: '🖱️', bg: '#f3e8ff' },
  { emoji: '🖥️', bg: '#fee2e2' },
  { emoji: '🔧', bg: '#d1fae5' },
  { emoji: '💾', bg: '#fae8ff' },
];

export const INITIAL_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', quantity: 50, stock: 35, price: 79.99, description: 'Over-ear noise cancelling wireless headphones with 30hr battery life.' },
  { id: 2, name: 'Mechanical Keyboard', quantity: 30, stock: 18, price: 129.99, description: 'TKL mechanical keyboard with RGB backlight and blue switches.' },
  { id: 3, name: 'USB-C Hub', quantity: 100, stock: 72, price: 39.99, description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.' },
  { id: 4, name: 'Webcam 4K', quantity: 40, stock: 12, price: 149.99, description: '4K autofocus webcam with built-in dual mic and privacy cover.' },
  { id: 5, name: 'Desk Lamp LED', quantity: 60, stock: 45, price: 29.99, description: 'Touch-control LED desk lamp with 5 brightness levels and USB charging port.' },
  { id: 6, name: 'Laptop Stand', quantity: 80, stock: 55, price: 49.99, description: 'Adjustable aluminium laptop stand compatible with 10-17 inch laptops.' },
  { id: 7, name: 'Wireless Mouse', quantity: 90, stock: 67, price: 24.99, description: 'Ergonomic silent wireless mouse with 12-month battery life.' },
  { id: 8, name: 'Monitor 27"', quantity: 20, stock: 8, price: 349.99, description: '27-inch QHD IPS monitor with 144Hz refresh rate and AMD FreeSync.' },
  { id: 9, name: 'Cable Management Kit', quantity: 200, stock: 180, price: 14.99, description: 'Velcro cable ties, clips and sleeves for a clean desk setup.' },
  { id: 10, name: 'Portable SSD 1TB', quantity: 45, stock: 30, price: 99.99, description: 'USB 3.2 Gen2 portable SSD with up to 1050MB/s read speed.' },
];

export const SAMPLE_ORDERS = [
  { id: 'ORD-001', date: '2026-03-15', items: 3, total: 259.97, status: 'Delivered' },
  { id: 'ORD-002', date: '2026-03-28', items: 1, total: 149.99, status: 'Shipped' },
  { id: 'ORD-003', date: '2026-04-01', items: 2, total: 79.98, status: 'Processing' },
];

export const SAMPLE_INVOICES = [
  { id: 'INV-2026-001', date: '2026-03-15', amount: 259.97, status: 'Paid' },
  { id: 'INV-2026-002', date: '2026-03-28', amount: 149.99, status: 'Paid' },
  { id: 'INV-2026-003', date: '2026-04-01', amount: 79.98, status: 'Pending' },
];

export const SAMPLE_PAYMENTS = [
  { id: 'PAY-001', date: '2026-03-15', method: 'Visa •••• 4242', amount: 259.97, status: 'Success' },
  { id: 'PAY-002', date: '2026-03-28', method: 'PayPal', amount: 149.99, status: 'Success' },
  { id: 'PAY-003', date: '2026-04-01', method: 'Mastercard •••• 1234', amount: 79.98, status: 'Pending' },
];

export const TABS = ['Profile', 'Products', 'Orders', 'Invoices', 'Payments'];

export const EMPTY_FORM = { name: '', quantity: '', stock: '', price: '', description: '' };
