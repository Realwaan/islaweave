/* =============================================
   Habiness — Checkout Page Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const summaryItems = document.getElementById('summary-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  const form = document.getElementById('checkout-form');
  const orderBtn = document.getElementById('place-order-btn');

  const SHIPPING_FEE = 150;

  // Pre-fill form with user data if logged in
  const currentUser = HabinessAuth.getCurrentUser();
  if (currentUser) {
    document.getElementById('first-name').value = currentUser.firstName || '';
    document.getElementById('last-name').value = currentUser.lastName || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    
    if (currentUser.address) {
      document.getElementById('address').value = currentUser.address.street || '';
      document.getElementById('city').value = currentUser.address.city || '';
      document.getElementById('province').value = currentUser.address.province || '';
      document.getElementById('zip').value = currentUser.address.zip || '';
    }
  }

  function renderSummary() {
    const items = HabinessCart.getCartWithProducts();
    const subtotal = HabinessCart.getTotal();
    const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

    if (items.length === 0) {
      summaryItems.innerHTML = `<p class="summary-empty">Your cart is empty. <a href="shop.html">Go shopping</a></p>`;
      subtotalEl.textContent = '₱0';
      shippingEl.textContent = '₱0';
      totalEl.textContent = '₱0';
      orderBtn.disabled = true;
      orderBtn.style.opacity = '0.5';
      return;
    }

    summaryItems.innerHTML = items.map(item => `
      <div class="summary-item">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" />
        <div class="summary-item-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.qty}</p>
        </div>
        <span class="summary-item-price">${HabinessCart.formatPrice(item.subtotal)}</span>
      </div>
    `).join('');

    subtotalEl.textContent = HabinessCart.formatPrice(subtotal);
    shippingEl.textContent = HabinessCart.formatPrice(SHIPPING_FEE);
    totalEl.textContent = HabinessCart.formatPrice(total);
    orderBtn.disabled = false;
    orderBtn.style.opacity = '';
  }

  renderSummary();
  window.addEventListener('cart-updated', renderSummary);

  /* --- Form Submission --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      firstError.focus();
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (HabinessCart.getItemCount() === 0) return;

    // Show loading state
    const originalHTML = orderBtn.innerHTML;
    orderBtn.disabled = true;
    orderBtn.innerHTML = `<span class="btn-loader">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </span>Processing...`;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate order ID
    const orderId = 'HAB-' + Date.now().toString(36).toUpperCase();
    
    // Save order to user account if logged in
    if (HabinessAuth.isLoggedIn()) {
      const orderData = {
        id: orderId,
        items: HabinessCart.getCartWithProducts(),
        total: HabinessCart.getTotal() + SHIPPING_FEE,
        shippingAddress: {
          firstName: document.getElementById('first-name').value,
          lastName: document.getElementById('last-name').value,
          street: document.getElementById('address').value,
          city: document.getElementById('city').value,
          province: document.getElementById('province').value,
          zip: document.getElementById('zip').value,
          phone: document.getElementById('phone').value,
          email: document.getElementById('email').value
        },
        paymentMethod: form.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('notes').value
      };

      HabinessAuth.addOrder(orderData);
    }

    document.getElementById('order-id').textContent = 'Order #' + orderId;

    // Show confirmation modal
    const modal = document.getElementById('order-modal');
    modal.classList.remove('hidden');

    // Clear cart
    HabinessCart.clearCart();
    renderSummary();

    // Reset button
    orderBtn.disabled = false;
    orderBtn.innerHTML = originalHTML;
  });
});

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
