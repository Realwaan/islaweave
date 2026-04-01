# 🚀 Quick Start Guide - IslaWeave Website

## Getting Started

### 1. Open the Website
Simply open `index.html` in your web browser:
- Double-click `index.html` in File Explorer, OR
- Right-click → Open with → Your preferred browser

### 2. Test the Features

#### 🔐 Create an Account
1. Click the **"Login"** button in the navigation
2. Click **"Sign up"** at the bottom
3. Fill in your details:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
4. Click **"Create Account"**
5. You'll be automatically logged in!

#### 🛍️ Shop Products
1. Browse products on the homepage (click any product card)
2. Visit the **Shop** page
3. Try the **search bar** - search for "basket", "guitar", etc.
4. Use **category filters** - Baskets, Textiles, Pottery, etc.
5. Click **"Add to Cart"** on any product

#### 🛒 Manage Cart
1. Click the **cart icon** in the navigation
2. The cart drawer slides in from the right
3. Adjust quantities with **+/-** buttons
4. Remove items with the trash icon
5. Click **"Proceed to Checkout"**

#### 💳 Complete Purchase
1. You'll be redirected to login if not logged in
2. Fill in shipping details (auto-filled from your profile)
3. Choose payment method (COD, GCash, Bank Transfer)
4. Click **"Place Order"**
5. See your order confirmation!

#### 👤 View Profile & Orders
1. Click your **name** in the navigation
2. Select **"My Profile"** from dropdown
3. Switch between:
   - **Account Info** tab - Update your details
   - **My Orders** tab - View order history
4. Click **"Logout"** when done

## 🎨 Features to Explore

### Homepage
- **Hero section** with scroll indicator
- **Featured products** (click to go to shop)
- **Artisan spotlight**
- **Values section**
- **CTA banner**

### Shop Page
- **Search functionality** - Type to filter products
- **Category filters** - One-click filtering
- **Product grid** - Responsive layout
- **Add to cart** buttons with feedback

### Authentication
- **Login** - With password toggle
- **Signup** - With password strength meter
- **Auto-login** after registration
- **Session persistence** (stays logged in)
- **Protected checkout** (login required)

### Cart System
- **Slide-in drawer** - Smooth animation
- **Quantity controls** - +/- buttons
- **Real-time total** - Updates automatically
- **Empty state** - Helpful message

### Checkout
- **Auto-fill** from user profile
- **Form validation** - Clear error messages
- **Loading states** - Button spinners
- **Order confirmation** - Modal popup
- **Order tracking** - Saved to profile

### Profile Page
- **Tabbed interface** - Info & Orders
- **Update profile** - Save changes
- **Order history** - View past orders
- **Order details** - Items, total, status

## 🎯 Testing Scenarios

### Test User Registration
```
Email: john@example.com
Password: test1234
Name: John Doe
```

### Test Product Search
- Search: "guitar" → Shows 2 guitar products
- Search: "basket" → Shows 2 basket products
- Search: "cebu" → Shows products from Cebu artisans

### Test Shopping Flow
1. Add 3 different products to cart
2. Change quantity to 2 on one item
3. Remove one item
4. Go to checkout
5. Place order
6. Check profile → My Orders

### Test Login Flow
1. Logout (if logged in)
2. Try to access checkout directly
3. You'll be redirected to login
4. Login with your account
5. You'll be taken back to checkout

## 🐛 Troubleshooting

### Cart is empty after refresh?
- The cart uses localStorage, so it persists
- Check browser console for errors
- Try clearing localStorage: F12 → Application → Local Storage → Clear

### Login not working?
- Check that you typed the email correctly
- Passwords are case-sensitive
- Make sure you registered first

### Products not showing?
- Check browser console for JavaScript errors
- Make sure all files are in the correct location
- Images folder should be in the same directory

### Navigation menu not responsive?
- Try refreshing the page
- Check if JavaScript is enabled
- Resize window to trigger responsive breakpoints

## 📱 Mobile Testing
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (iPhone, Galaxy, etc.)
4. Test:
   - Mobile navigation menu
   - Cart drawer on mobile
   - Product grid layout
   - Form inputs and buttons
   - Toast notifications

## 🎨 Customization

### Change Colors
Edit `style.css` - look for the `:root` section:
```css
:root {
  --accent: #C08552;  /* Change this! */
  --bg: #FFF8F0;
  --text: #4B2E2B;
}
```

### Add More Products
Edit `cart.js` - find the `PRODUCTS` array:
```javascript
const PRODUCTS = [
  { 
    id: 9, 
    name: 'Your Product', 
    category: 'Category',
    price: 1500,
    artisan: 'Artisan Name',
    image: 'images/your-image.png',
    alt: 'Product description'
  },
  // ... add more
];
```

### Change Logo
Replace `images/logo.png` with your own logo image.

## ✅ All Features Checklist

- ✅ User Registration & Login
- ✅ Session Management
- ✅ Product Browsing
- ✅ Product Search
- ✅ Category Filtering
- ✅ Shopping Cart
- ✅ Checkout Process
- ✅ Order Confirmation
- ✅ User Profile
- ✅ Order History
- ✅ Form Validation
- ✅ Toast Notifications
- ✅ Loading States
- ✅ Responsive Design
- ✅ Mobile Navigation
- ✅ Password Security Indicators
- ✅ Interactive Product Cards
- ✅ Empty States
- ✅ Error Handling

## 🎉 Enjoy Your New Website!

Your IslaWeave e-commerce website is now fully functional with:
- Modern authentication system
- Enhanced UX with search and filters
- Beautiful, responsive design
- Complete shopping flow
- User profile and order tracking

**Need help?** Check the README.md for detailed documentation.
