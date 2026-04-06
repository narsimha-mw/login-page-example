export const INITIAL_PRODUCTS = [
  { id: 1,  name: 'Wireless Headphones',   quantity: 50,  stock: 35,  price: 79.99,  description: 'Over-ear noise cancelling wireless headphones with 30hr battery life.',      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' },
  { id: 2,  name: 'Mechanical Keyboard',   quantity: 30,  stock: 18,  price: 129.99, description: 'TKL mechanical keyboard with RGB backlight and blue switches.',               image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop' },
  { id: 3,  name: 'USB-C Hub',             quantity: 100, stock: 72,  price: 39.99,  description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.',       image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop' },
  { id: 4,  name: 'Webcam 4K',             quantity: 40,  stock: 12,  price: 149.99, description: '4K autofocus webcam with built-in dual mic and privacy cover.',               image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop' },
  { id: 5,  name: 'Desk Lamp LED',         quantity: 60,  stock: 45,  price: 29.99,  description: 'Touch-control LED desk lamp with 5 brightness levels and USB charging port.', image: 'https://images.unsplash.com/photo-1513506003901-1e6a35d44e47?w=400&h=300&fit=crop' },
  { id: 6,  name: 'Laptop Stand',          quantity: 80,  stock: 55,  price: 49.99,  description: 'Adjustable aluminium laptop stand compatible with 10-17 inch laptops.',        image: 'https://images.unsplash.com/photo-1527864526791-730c23e17064?w=400&h=300&fit=crop' },
  { id: 7,  name: 'Wireless Mouse',        quantity: 90,  stock: 67,  price: 24.99,  description: 'Ergonomic silent wireless mouse with 12-month battery life.',                  image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop' },
  { id: 8,  name: 'Monitor 27"',           quantity: 20,  stock: 8,   price: 349.99, description: '27-inch QHD IPS monitor with 144Hz refresh rate and AMD FreeSync.',           image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop' },
  { id: 9,  name: 'Cable Management Kit',  quantity: 200, stock: 180, price: 14.99,  description: 'Velcro cable ties, clips and sleeves for a clean desk setup.',                 image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { id: 10, name: 'Portable SSD 1TB',      quantity: 45,  stock: 30,  price: 99.99,  description: 'USB 3.2 Gen2 portable SSD with up to 1050MB/s read speed.',                   image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop' },
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
export const EMPTY_FORM = { name: '', quantity: '', stock: '', price: '', description: '', image: '' };
