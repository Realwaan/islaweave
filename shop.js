/* =============================================
   Habiness — Shop Page Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('shop-products');
  const filtersContainer = document.getElementById('shop-filters');
  const searchInput = document.getElementById('product-search');
  const noResults = document.getElementById('no-results');
  
  if (!grid || !filtersContainer) return;

  let activeCategory = 'all';
  let searchTerm = '';

  /* --- Render Products with Smooth Transition --- */
  function renderProducts(category, search = '', animated = true) {
    let products = category === 'all'
      ? HabinessCart.PRODUCTS
      : HabinessCart.PRODUCTS.filter(p => p.category === category);

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.artisan.toLowerCase().includes(searchLower)
      );
    }

    if (products.length === 0) {
      // Fade out grid smoothly
      if (animated) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(20px)';
        setTimeout(() => {
          grid.innerHTML = '';
          noResults.style.display = 'block';
          noResults.style.animation = 'fadeIn 0.5s ease-out';
        }, 300);
      } else {
        grid.innerHTML = '';
        noResults.style.display = 'block';
      }
      return;
    }

    noResults.style.display = 'none';

    // Fade out old products if animated
    if (animated && grid.children.length > 0) {
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(20px)';
      grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        renderProductsHTML(products);
        // Fade in new products
        setTimeout(() => {
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        }, 50);
      }, 300);
    } else {
      renderProductsHTML(products);
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }
  }

  function renderProductsHTML(products) {
    grid.innerHTML = products.map(p => `
      <article class="product-card" data-category="${p.category}">
        <div class="product-card-img">
          <img src="${p.image}" alt="${p.alt}" loading="lazy" />
        </div>
        <div class="product-card-body">
          <p class="product-category">${p.category}</p>
          <h3>${p.name}</h3>
          <p class="artisan-name">by ${p.artisan}</p>
          <div class="product-card-actions">
            <p class="product-price">${HabinessCart.formatPrice(p.price)}</p>
            <button class="btn btn-add-cart" data-add-to-cart="${p.id}" onclick="addToCart(${p.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  /* --- Filter Buttons with Ripple Effect --- */
  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      width: 10px;
      height: 10px;
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    activeCategory = btn.dataset.category;
    
    // Smooth button transition
    filtersContainer.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.style.transform = 'scale(1)';
    });
    
    btn.classList.add('active');
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 200);

    renderProducts(activeCategory, searchTerm, true);
  });

  /* --- Search Input with Debounce --- */
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTerm = e.target.value;
      
      // Debounce for smoother performance
      searchTimeout = setTimeout(() => {
        renderProducts(activeCategory, searchTerm, true);
      }, 300);
    });

    // Focus styles with smooth transition
    searchInput.addEventListener('focus', (e) => {
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.transform = 'scale(1.02)';
      e.target.style.transition = 'all 0.3s ease';
    });

    searchInput.addEventListener('blur', (e) => {
      e.target.style.borderColor = 'rgba(140, 90, 60, 0.2)';
      e.target.style.transform = 'scale(1)';
    });
  }

  // Initial render (no animation on first load)
  renderProducts('all', '', false);

  // Add CSS for ripple animation if not exists
  if (!document.getElementById('shop-animations')) {
    const style = document.createElement('style');
    style.id = 'shop-animations';
    style.textContent = `
      @keyframes ripple {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(40);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});
