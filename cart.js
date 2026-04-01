/* =============================================
   Habiness — Cart State Management
   Shared across all pages
   ============================================= */

const HabinessCart = (() => {
  const STORAGE_KEY = 'habiness_cart';

  // Product catalogue — single source of truth
  const PRODUCTS = [
    { id: 1, name: 'Sinamay Storage Basket',  category: 'Baskets',    price: 1850, artisan: 'Lola Imelda, Bohol',         image: 'images/product-basket-1.png',  alt: 'Handwoven rattan basket with geometric pattern' },
    { id: 2, name: 'Hablon Weave Blanket',    category: 'Textiles',   price: 3200, artisan: 'Maria Santos, Cebu',          image: 'images/product-textile-1.png', alt: 'Handwoven textile with traditional Visayan patterns' },
    { id: 3, name: 'Palayok Heritage Jar',    category: 'Pottery',    price: 2400, artisan: 'Mang Rodel, Siquijor',        image: 'images/product-pottery-1.png', alt: 'Handcrafted clay pottery with carved patterns' },
    { id: 4, name: 'Alegre Acoustic Guitar',  category: 'Guitars',    price: 8500, artisan: 'Mang Tonio, Lapu-Lapu City',  image: 'images/product-guitar-1.png',  alt: 'Handcrafted acoustic guitar from Lapu-Lapu City' },
    { id: 5, name: 'Magellan Ukulele',        category: 'Guitars',    price: 4200, artisan: 'Jun Cañete, Lapu-Lapu City',  image: 'images/product-guitar-2.png',  alt: 'Handcrafted ukulele from Lapu-Lapu City' },
    { id: 6, name: 'Rattan Placemat Set',     category: 'Home Décor', price: 980,  artisan: 'Tatay Ben, Bohol',             image: 'images/product-decor-1.png',   alt: 'Woven rattan placemats and coasters set' },
    { id: 7, name: 'Abacá Lidded Bowl',       category: 'Baskets',    price: 1100, artisan: 'Aling Rosa, Leyte',            image: 'images/product-basket-2.png',  alt: 'Small round abaca fiber basket with lid' },
    { id: 8, name: 'Patadyong Table Runner',  category: 'Textiles',   price: 1650, artisan: 'Nanay Luz, Cebu',              image: 'images/product-textile-2.png', alt: 'Handwoven table runner with diamond stripe pattern' },
  ];

  /* --- Cart State --- */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
    dispatchCartEvent();
  }

  function addItem(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty });
    }
    saveCart(cart);
    return cart;
  }

  function removeItem(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartWithProducts() {
    const cart = getCart();
    return cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return product ? { ...product, qty: item.qty, subtotal: product.price * item.qty } : null;
    }).filter(Boolean);
  }

  function getTotal() {
    return getCartWithProducts().reduce((sum, item) => sum + item.subtotal, 0);
  }

  function getItemCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  /* --- Badge Update --- */
  function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getItemCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  /* --- Custom Event --- */
  function dispatchCartEvent() {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: getCartWithProducts() }));
  }

  /* --- Format Currency --- */
  function formatPrice(amount) {
    return '₱' + amount.toLocaleString('en-PH');
  }

  /* --- Init badge on load --- */
  document.addEventListener('DOMContentLoaded', updateCartBadge);

  return {
    PRODUCTS,
    getCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getCartWithProducts,
    getTotal,
    getItemCount,
    updateCartBadge,
    formatPrice
  };
})();


/* =============================================
   Cart Drawer (Slide-in Panel)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Inject cart drawer HTML if not already present
  if (!document.getElementById('cart-drawer')) {
    const drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-overlay" id="cart-overlay"></div>
      <div class="cart-drawer-panel">
        <div class="cart-drawer-header">
          <h3>Your Cart</h3>
          <button class="cart-drawer-close" id="cart-close" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="cart-drawer-items" id="cart-items"></div>
        <div class="cart-drawer-footer" id="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <span id="cart-total-amount">₱0</span>
          </div>
          <a href="checkout.html" class="btn cart-checkout-btn" id="cart-checkout-btn">Proceed to Checkout</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Close handlers
    document.getElementById('cart-overlay').addEventListener('click', closeCartDrawer);
    document.getElementById('cart-close').addEventListener('click', closeCartDrawer);
  }

  // Listen for cart-updated events
  window.addEventListener('cart-updated', renderCartDrawer);
  renderCartDrawer();
});


function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-amount');
  const footerEl = document.getElementById('cart-footer');
  if (!itemsContainer) return;

  const cartItems = HabinessCart.getCartWithProducts();

  if (cartItems.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Your cart is empty</p>
        <a href="shop.html" class="btn btn-outline">Browse Products</a>
      </div>
    `;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (footerEl) footerEl.style.display = '';

  itemsContainer.innerHTML = cartItems.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.alt}" class="cart-item-img" loading="lazy" decoding="async" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-artisan">${item.artisan}</p>
        <p class="cart-item-price">${HabinessCart.formatPrice(item.price)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.qty - 1})" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.qty + 1})" aria-label="Increase quantity">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = HabinessCart.formatPrice(HabinessCart.getTotal());
}

function changeQty(productId, newQty) {
  if (newQty < 1) {
    HabinessCart.removeItem(productId);
  } else {
    HabinessCart.updateQty(productId, newQty);
  }
}

function removeFromCart(productId) {
  HabinessCart.removeItem(productId);
}

function addToCart(productId) {
  HabinessCart.addItem(productId);
  openCartDrawer();

  // Show success toast
  const product = HabinessCart.PRODUCTS.find(p => p.id === productId);
  if (product && typeof showToast === 'function') {
    showToast(`${product.name} added to cart!`, 'success');
  }

  // Brief "Added" feedback on the button
  const btn = document.querySelector(`[data-add-to-cart="${productId}"]`);
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('added');
    }, 1200);
  }
}
