# E-App — React PWA Dashboard

A full-featured e-commerce dashboard built with React. It includes secure login, product management, cart & order flow, invoicing, and payment tracking — all in a clean sidebar-driven UI.

**Live URL:** `http://localhost:3000`
**Default credentials:** `Test@test.com` / `test@12345`

---

## Overview

E-App is a single-page React application that simulates an end-to-end B2C product management and ordering experience. It is designed for internal teams or business users to manage products, track orders, generate invoices, and view payment history — all from one dashboard.

---

## Features at a Glance

| Feature | Description |
|---|---|
| Secure Login | Email/password auth with show/hide toggle and error feedback |
| Product Grid | Responsive card grid with full-background images and hover overlay |
| Discount Pricing | Regular price (strikethrough) + discount % badge + final price |
| Cart | Floating cart with item count badge, qty tracking, and total |
| Order Flow | Cart → Place Order → Pay Now → Invoice auto-generated |
| Bulk Upload | Import products via CSV/Excel file |
| PDF Invoice | Download per-invoice PDF with company branding |
| Excel Export | Download all orders as an `.xlsx` file |
| Indian Locale | All prices in ₹ (Indian Rupee), profile set to Bangalore, India |

---

## Sections

### 1. Login
- Default credentials: `Test@test.com` / `test@12345`
- Password must be 8–10 characters
- Shows "Invalid credentials" banner on wrong login
- Password visibility toggle (eye icon)

### 2. Profile
- Displays user avatar, email, and account stats (Orders, Amount Spent, Tier)
- Shows member details: Phone (`+91 1234567890`), Location (`Bangalore, India`), Account Status

### 3. Products
- **Grid view** — auto-fill responsive card layout
- Each card shows:
  - Full-background product image with description + View/Edit overlay on hover
  - Add to Cart button (top-right of image)
  - Regular price with strikethrough, discount % badge, and final discounted price
  - Delete button
- **Add Product** — form modal with name, quantity, stock, regular price, discount %, image URL, description
- **Edit Product** — pre-filled form modal
- **View Product** — read-only detail view
- **Bulk Upload** — upload CSV/Excel with columns: `name, quantity, stock, price, discount, description`
- **Sample Template** — download a headers-only Excel template for bulk upload

### 4. Orders
- Lists all placed orders with Order ID, Date, Products, Items, Total, Status
- Multi-SKU support: first product shown as tag; "+N more" opens a detail modal
- **Pay Now** button appears for orders in `Pending Payment` status
- **Download Excel** — exports all orders as `.xlsx`

### 5. Invoices
- Auto-generated after each successful payment
- Shows Invoice ID, Order ID, Date, Amount, Status
- **Download PDF** — generates a branded PDF invoice with E-App company details

### 6. Payments
- Records every payment transaction
- Shows Payment ID, Date, Method, Amount, and Status (Success / Pending / Refunded)
- Supports: Credit/Debit Card, UPI, Net Banking, Cash on Delivery

---

## Cart & Order Flow

```
Add to Cart → Cart Dropdown → Place Order
    → Orders Tab (Pending Payment)
        → Pay Now → Select Payment Method → Confirm
            → Order: Delivered
            → Invoice: auto-created (Paid)
            → Payment: recorded (Success)
                → View Invoice → Download PDF
```

> Final (discounted) price is used in cart, order total, invoice, and payment record.

---

## Tech Stack

| Library | Purpose |
|---|---|
| React (CRA) | UI framework |
| jsPDF | PDF invoice generation |
| SheetJS (xlsx) | Excel export and bulk CSV/Excel import |
| CSS Grid | Responsive product card layout |

---

## Project Structure

```
src/
  components/
    LoginPage.js      # Login form with validation
    Dashboard.js      # Main dashboard — all tabs and logic
    Dashboard.css     # All component styles
    data.js           # Static seed data (products, orders, invoices, payments)
```

---

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create a production build:

```bash
npm run build
```

---

## Repository

GitHub: [narsimha-mw/React-MyApp_PWA](https://github.com/narsimha-mw/React-MyApp_PWA)
Branch: `main`
