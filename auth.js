/* =============================================
   Habiness — Authentication System
   LocalStorage-based user management
   ============================================= */

const HabinessAuth = (() => {
  const STORAGE_KEY = 'habiness_users';
  const SESSION_KEY = 'habiness_session';

  /* --- User Database (localStorage) --- */
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function getUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  /* --- Session Management --- */
  function getSession() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (session && session.expiresAt > Date.now()) {
        return session;
      }
      clearSession();
      return null;
    } catch {
      return null;
    }
  }

  function saveSession(user) {
    const session = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    dispatchAuthEvent('login', session);
    return session;
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    dispatchAuthEvent('logout');
  }

  /* --- Authentication Actions --- */
  function register(userData) {
    const { email, password, firstName, lastName, phone, address } = userData;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return { success: false, error: 'All required fields must be filled.' };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if user already exists
    if (getUserByEmail(email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Create new user
    const users = getUsers();
    const newUser = {
      id: generateUserId(),
      email: email.toLowerCase(),
      password: hashPassword(password), // Simple hash (not production-ready)
      firstName,
      lastName,
      phone: phone || '',
      address: address || {},
      createdAt: Date.now(),
      orders: []
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after registration
    saveSession(newUser);

    return { success: true, user: sanitizeUser(newUser) };
  }

  function login(email, password) {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const user = getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (user.password !== hashPassword(password)) {
      return { success: false, error: 'Invalid email or password.' };
    }

    saveSession(user);
    return { success: true, user: sanitizeUser(user) };
  }

  function logout() {
    clearSession();
    window.location.href = 'index.html';
  }

  function isLoggedIn() {
    return getSession() !== null;
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;

    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    return user ? sanitizeUser(user) : null;
  }

  function updateUserProfile(updates) {
    const session = getSession();
    if (!session) {
      return { success: false, error: 'Not logged in.' };
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === session.userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'phone', 'address'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        users[userIndex][field] = updates[field];
      }
    });

    saveUsers(users);
    
    // Update session
    saveSession(users[userIndex]);

    return { success: true, user: sanitizeUser(users[userIndex]) };
  }

  function addOrder(orderData) {
    const session = getSession();
    if (!session) return { success: false, error: 'Not logged in.' };

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === session.userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    const order = {
      id: orderData.id,
      items: orderData.items,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      createdAt: Date.now()
    };

    users[userIndex].orders.unshift(order);
    saveUsers(users);

    return { success: true, order };
  }

  /* --- Helper Functions --- */
  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function hashPassword(password) {
    // Simple hash for demo purposes (NOT production-ready!)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /* --- Auth Event System --- */
  function dispatchAuthEvent(type, data = null) {
    window.dispatchEvent(new CustomEvent('auth-changed', { 
      detail: { type, data } 
    }));
  }

  /* --- Navigation UI Updates --- */
  function updateNavigationUI() {
    const session = getSession();
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    // Find or create auth menu item
    let authMenuItem = navLinks.querySelector('.nav-auth-item');
    
    if (session) {
      // User is logged in
      const userName = session.firstName;
      
      if (!authMenuItem) {
        authMenuItem = document.createElement('li');
        authMenuItem.className = 'nav-auth-item';
        navLinks.appendChild(authMenuItem);
      }

      authMenuItem.innerHTML = `
        <div class="user-menu">
          <button class="user-menu-btn" id="user-menu-btn" aria-label="User menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>${userName}</span>
          </button>
          <div class="user-dropdown" id="user-dropdown">
            <a href="profile.html">My Profile</a>
            <a href="profile.html#orders">My Orders</a>
            <button onclick="HabinessAuth.logout()">Logout</button>
          </div>
        </div>
      `;

      // Toggle dropdown
      const menuBtn = authMenuItem.querySelector('#user-menu-btn');
      const dropdown = authMenuItem.querySelector('#user-dropdown');
      
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });

    } else {
      // User is logged out
      if (!authMenuItem) {
        authMenuItem = document.createElement('li');
        authMenuItem.className = 'nav-auth-item';
        navLinks.appendChild(authMenuItem);
      }

      authMenuItem.innerHTML = `
        <a href="login.html" class="nav-auth-link">Login</a>
      `;
    }
  }

  /* --- Initialize on page load --- */
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      updateNavigationUI();
    });

    window.addEventListener('auth-changed', () => {
      updateNavigationUI();
    });
  }

  /* --- Public API --- */
  return {
    register,
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    updateUserProfile,
    addOrder,
    getSession
  };
})();

/* --- Checkout Protection --- */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Protect checkout page
    if (window.location.pathname.includes('checkout.html')) {
      if (!HabinessAuth.isLoggedIn()) {
        // Save intended destination
        sessionStorage.setItem('redirect_after_login', 'checkout.html');
        window.location.href = 'login.html';
      }
    }
  });
}
