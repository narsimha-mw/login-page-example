export const INITIAL_PRODUCTS = [
  { id: 1, name: 'Surf excel', quantity: 50, stock: 35, price: 79.99, discount: 10, description: 'Over-ear noise cancelling wireless headphones with 30hr battery life.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/f56130907a65e19221b7e1f83be3d53759f0c219-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' },
  { id: 2, name: 'RIN', quantity: 30, stock: 18, price: 129.99, discount: 15, description: 'TKL mechanical keyboard with RGB backlight and blue switches.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/90e4ecc5edbc8c99e35dea1b2c7a9d980e1e42d7-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' },
  { id: 3, name: 'Wheel', quantity: 100, stock: 72, price: 39.99, discount: 20, description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/8751da315274eb0aebfe08f5c2a00771e4aca1f2-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' },
  { id: 4, name: 'Comfort', quantity: 40, stock: 12, price: 149.99, discount: 5, description: '4K autofocus webcam with built-in dual mic and privacy cover.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/0023f51bc3bb5c4ac1c7821bf86af96b25751e11-1080x1080.jpg?w=160&h=160&fit=crop&auto=format' },
  { id: 5, name: 'Sun light', quantity: 60, stock: 45, price: 29.99, discount: 25, description: 'Touch-control LED desk lamp with 5 brightness levels and USB charging port.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/94753d47529b1108ebeefc69386fa52731a16492-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' },
  { id: 6, name: 'Domex', quantity: 80, stock: 55, price: 49.99, discount: 10, description: 'Adjustable aluminium laptop stand compatible with 10-17 inch laptops.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/61be85407e0738d4c8a052b20edb803653ef7285-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' },
  { id: 7, name: 'CIF', quantity: 90, stock: 67, price: 24.99, discount: 30, description: 'Ergonomic silent wireless mouse with 12-month battery life.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/c4e7aac1d54033483d1626f15c1434dc4fce2063-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' },
  { id: 8, name: 'VIM', quantity: 20, stock: 8, price: 349.99, discount: 8, description: '27-inch QHD IPS monitor with 144Hz refresh rate and AMD FreeSync.', image: 'https://www.hul.co.in/content-images/92ui5egz/production/ad524ab1e9e91ffc83dba8ab264ce27b1747ed10-1920x1080.jpg?w=1200&h=675&fit=crop&auto=format' }
];

export const SAMPLE_ORDERS = [
  { id: 'ORD-001', date: '2026-03-15', items: 3, total: 259.97, status: 'Delivered', cart: [] },
  { id: 'ORD-002', date: '2026-03-28', items: 1, total: 149.99, status: 'Shipped', cart: [] },
  { id: 'ORD-003', date: '2026-04-01', items: 2, total: 79.98, status: 'Processing', cart: [] },
];

export const SAMPLE_INVOICES = [
  { id: 'INV-2026-001', date: '2026-03-15', amount: 259.97, status: 'Paid', orderId: 'ORD-001' },
  { id: 'INV-2026-002', date: '2026-03-28', amount: 149.99, status: 'Paid', orderId: 'ORD-002' },
  { id: 'INV-2026-003', date: '2026-04-01', amount: 79.98, status: 'Pending', orderId: 'ORD-003' },
];

export const SAMPLE_PAYMENTS = [
  { id: 'PAY-001', date: '2026-03-15', method: 'Visa •••• 4242', amount: 259.97, status: 'Success' },
  { id: 'PAY-002', date: '2026-03-28', method: 'PayPal', amount: 149.99, status: 'Success' },
  { id: 'PAY-003', date: '2026-04-01', method: 'Mastercard •••• 1234', amount: 79.98, status: 'Pending' },
];

export const PAYMENT_OPTIONS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export const TABS = ['Profile', 'Products', 'Orders', 'Invoices', 'Payments'];
export const EMPTY_FORM = { name: '', quantity: '', stock: '', price: '', discount: '', description: '', image: '' };
