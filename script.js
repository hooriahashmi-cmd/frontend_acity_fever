
// MENU DATA

const menuItems = [
    {
        id: 1,
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and special sauce",
        price: 25.00,
        category: "lunch",
        image: "assets/burgerss.jpg"
    },
    {
        id: 2,
        name: "Jollof Rice & Chicken",
        description: "Spicy Ghanaian jollof with grilled chicken",
        price: 30.00,
        category: "lunch",
        image: "assets/jolllof.jpg"
    },
    {
        id: 3,
        name: "Waakye Special",
        description: "Rice and beans with spaghetti, gari, and protein",
        price: 20.00,
        category: "breakfast",
        image: "assets/waakye.jpg"
    },
    {
        id: 4,
        name: "Fried Rice",
        description: "Mixed vegetables with chicken and shrimp",
        price: 28.00,
        category: "dinner",
        image: "assets/fried-rice.webp"
    },
    {
        id: 5,
        name: "Banku & Tilapia",
        description: "Traditional fermented corn dough with grilled tilapia",
        price: 35.00,
        category: "dinner",
        image: "assets/tilapia.jpg"
    },
    {
        id: 6,
        name: "Pizza Margherita",
        description: "Fresh mozzarella, tomato sauce, and basil",
        price: 40.00,
        category: "lunch",
        image: "assets/pizza.jpg"
    },
    {
        id: 8,
        name: "Fufu & Light Soup",
        description: "Pounded cassava with goat meat light soup",
        price: 32.00,
        category: "dinner",
        image: "assets/fufu.jpg"
    },
    {
        id: 9,
        name: "Chicken Shawarma",
        description: "Grilled chicken wrap with veggies and sauce",
        price: 22.00,
        category: "lunch",
        image: "assets/shawarma.webp"
    },
    {
        id: 10,
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 15.00,
        category: "drinks",
        image: "assets/orange.jpg"
    },
    {
        id: 11,
        name: "Sobolo Drink",
        description: "Refreshing hibiscus drink",
        price: 10.00,
        category: "drinks",
        image: "assets/sobolo.jpg"
    },
    {
        id: 12,
        name: "Chocolate Cake",
        description: "Rich chocolate layer cake with frosting",
        price: 45.00,
        category: "desserts",
        image: "assets/cake.jpg"
    }
];

// Global cart variable
let cart = JSON.parse(localStorage.getItem('cart') || '[]');


// UTILITY FUNCTIONS
function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMsg');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 3000);
    }
}

function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function isAdminLoggedIn() {
    return localStorage.getItem('adminUser') !== null || sessionStorage.getItem('isAdmin') === 'true';
}

function getAdminUser() {
    return JSON.parse(localStorage.getItem('adminUser') || 'null');
}


// LOGIN & REGISTRATION HANDLERS
function goToLogin() {
    window.location.href = 'login.html';
}

function goToMenu() {
    window.location.href = 'menu.html';
}

function goToCart() {
    window.location.href = 'cart.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function logoutAdmin() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!email.includes('@')) {
        showError('Please enter a valid email');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                room_number: data.user.room_number
            }));

            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 1500);
        } else {
            showError(data.error || 'Invalid email or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed: ' + error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const room_number = document.getElementById('regRoom').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!fullName || !email || !room_number || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (!email.includes('@')) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: fullName,
                email: email,
                room_number: room_number,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                room_number: data.user.room_number
            }));

            showSuccess('Account created successfully. Redirecting...');

            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 2000);
        } else {
            showError(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed: ' + error.message);
    }
}

function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    const validAdmins = [
        { username: 'admin', password: 'admin123' },
        { username: 'manager', password: 'manager123' }
    ];

    const admin = validAdmins.find(a => a.username === username && a.password === password);

    if (admin) {
        localStorage.setItem('adminUser', JSON.stringify({
            username: username,
            loginTime: new Date().toISOString()
        }));

        sessionStorage.setItem('isAdmin', 'true');

        showSuccess('Login successful. Redirecting...');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    } else {
        showError('Invalid username or password');
    }
}

// MENU & SHOPPING
function displayMenuItems(category = 'all') {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    const filteredItems = category === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === category);

    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <span class="menu-item-category">${item.category}</span>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">GH₵ ${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showCartNotification(item.name);
}

function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
    }
}

function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${itemName} added to cart!</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// CART PAGE
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';

    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/120'}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">GH₵ ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-description">${item.description || ''}</div>
                <div class="cart-item-footer">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
                        <div class="qty-display">${item.quantity}</div>
                        <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('totalAmount');
    const deliveryFeeEl = document.getElementById('deliveryFee');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (deliveryFeeEl) deliveryFeeEl.textContent = deliveryFee.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

function increaseQuantity(index) {
    if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function decreaseQuantity(index) {
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function removeFromCart(index) {
    if (confirm('Remove this item from cart?')) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function clearCart() {
    if (confirm('Clear entire cart?')) {
        cart = [];
        localStorage.removeItem('cart');
        displayCartItems();
    }
}

function proceedToCheckout() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Please login to complete checkout');
        window.location.href = 'login.html';
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    const order = {
        id: 'ORD' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        items: [...cart],
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        userEmail: currentUser.email,
        userRoom: currentUser.room_number,
        userName: currentUser.name
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    localStorage.removeItem('cart');
    cart = [];

    alert('Order placed successfully!\n\nOrder ID: ' + order.id);
    window.location.href = 'index.html';
}

function displayUserOrders() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        document.getElementById('ordersContent').innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-lock"></i>
                <h2>Please login to view orders</h2>
                <button class="login-btn" onclick="window.location.href='login.html'">Go to Login</button>
            </div>
        `;
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(o => o.userEmail === currentUser.email);

    if (userOrders.length === 0) {
        document.getElementById('ordersContent').innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-inbox"></i>
                <h2>No orders yet</h2>
                <p>Start by browsing our menu and placing an order!</p>
                <button class="order-now-btn" onclick="window.location.href='menu.html'">Browse Menu</button>
            </div>
        `;
        return;
    }

    const statusColors = {
        pending: '#ff6b35',
        preparing: '#ffa500',
        ready: '#27ae60',
        completed: '#3c2219'
    };

    const statusIcons = {
        pending: 'hourglass-start',
        preparing: 'fire',
        ready: 'check-circle',
        completed: 'check-double'
    };

    document.getElementById('ordersContent').innerHTML = userOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id-info">
                    <h3>Order #${order.id}</h3>
                    <p>${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div class="order-status" style="background-color: ${statusColors[order.status]};">
                    <i class="fas fa-${statusIcons[order.status]}"></i>
                    <span>${order.status.toUpperCase()}</span>
                </div>
            </div>

            <div class="order-items">
                <h4>Items:</h4>
                <ul>
                    ${order.items.map(item => `
                        <li>
                            <span>${item.name} x${item.quantity}</span>
                            <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="order-footer">
                <div class="order-total">
                    <span>Total:</span>
                    <strong>GH₵ ${order.total.toFixed(2)}</strong>
                </div>
                <div class="order-delivery">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Delivery: Room ${order.userRoom}</span>
                </div>
            </div>

            <div class="order-timeline">
                <div class="timeline-step ${order.status === 'pending' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed' ? 'completed' : ''}">
                    <div class="timeline-marker"></div>
                    <span>Pending</span>
                </div>
                <div class="timeline-step ${order.status === 'preparing' || order.status === 'ready' || order.status === 'completed' ? 'completed' : ''}">
                    <div class="timeline-marker"></div>
                    <span>Preparing</span>
                </div>
                <div class="timeline-step ${order.status === 'ready' || order.status === 'completed' ? 'completed' : ''}">
                    <div class="timeline-marker"></div>
                    <span>Ready</span>
                </div>
                <div class="timeline-step ${order.status === 'completed' ? 'completed' : ''}">
                    <div class="timeline-marker"></div>
                    <span>Completed</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

function loadAdminDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    const pending = orders.filter(o => o.status === 'pending').length;
    const preparing = orders.filter(o => o.status === 'preparing').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    const pendingCountEl = document.getElementById('pendingCount');
    const preparingCountEl = document.getElementById('preparingCount');
    const readyCountEl = document.getElementById('readyCount');
    const completedCountEl = document.getElementById('completedCount');

    if (pendingCountEl) pendingCountEl.textContent = pending;
    if (preparingCountEl) preparingCountEl.textContent = preparing;
    if (readyCountEl) readyCountEl.textContent = ready;
    if (completedCountEl) completedCountEl.textContent = completed;

    loadRecentOrders();
}

function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const recentOrdersList = document.getElementById('recentOrdersList');

    if (!recentOrdersList) return;

    const ordersNeedingAttention = orders.filter(o =>
        ['pending', 'preparing', 'ready'].includes(o.status)
    ).slice(0, 5);

    if (ordersNeedingAttention.length === 0) {
        recentOrdersList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>All orders are up to date!</p>
            </div>
        `;
        return;
    }

    recentOrdersList.innerHTML = ordersNeedingAttention.map(order => `
        <div class="admin-order-item">
            <div class="admin-order-header">
                <span class="order-id">#${order.id}</span>
                <span class="order-status status-${order.status}">${capitalizeStatus(order.status)}</span>
            </div>
            <div class="admin-order-details">
                <span><i class="fas fa-user"></i> ${order.userEmail.split('@')[0]}</span>
                <span><i class="fas fa-door-open"></i> Room ${order.userRoom}</span>
                <span><i class="fas fa-shopping-bag"></i> ${order.items.length} items</span>
                <span><i class="fas fa-money-bill"></i> GH₵ ${order.total.toFixed(2)}</span>
            </div>
            <button class="update-status-btn" onclick="openStatusModal('${order.id}', '${order.status}')">
                Update Status
            </button>
        </div>
    `).join('');
}

let currentModalOrderId = null;
let currentModalStatus = null;

function openStatusModal(orderId, currentStatus) {
    currentModalOrderId = orderId;
    currentModalStatus = currentStatus;
    document.getElementById('modalOrderId').textContent = orderId;

    document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.classList.remove('selected');
        const btnStatus = btn.className.match(/pending|preparing|ready|completed/)?.[0];
        if (btnStatus === currentStatus) {
            btn.classList.add('selected');
        }
    });

    document.getElementById('statusModal').style.display = 'flex';
}

function closeStatusModal() {
    document.getElementById('statusModal').style.display = 'none';
    currentModalOrderId = null;
    currentModalStatus = null;
}

function loadAllOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('ordersTableBody');

    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #999;">
                    No orders yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.userEmail.split('@')[0]}</td>
            <td>Room ${order.userRoom}</td>
            <td>${order.items.length} items</td>
            <td>GH₵ ${order.total.toFixed(2)}</td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${capitalizeStatus(order.status)}
                </span>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="table-action-btn" onclick="openStatusModal('${order.id}', '${order.status}')">
                    Update
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(newStatus) {
    currentModalStatus = newStatus;
    document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.status-option-btn').classList.add('selected');
}

function saveStatusUpdate() {
    if (!currentModalStatus) {
        alert('Please select a status');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === currentModalOrderId);

    if (!order) {
        alert('Order not found');
        return;
    }

    order.status = currentModalStatus;
    order.lastUpdatedAt = new Date().toISOString();

    localStorage.setItem('orders', JSON.stringify(orders));

    alert(`Order #${currentModalOrderId} updated to ${capitalizeStatus(currentModalStatus)}`);
    loadAdminDashboard();

    if (document.getElementById('ordersTableBody')) {
        loadAllOrdersTable();
    }

    closeStatusModal();
}

function capitalizeStatus(status) {
    const statusMap = {
        pending: 'Pending',
        preparing: 'Preparing',
        ready: 'Ready for Pickup',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
}

function logoutAdmin() {
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('isAdmin');
    window.location.href = 'admin.html?login=true';
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // LOGIN FORM
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // REGISTRATION FORM
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // ADMIN LOGIN FORM
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    if (document.getElementById('adminUser')) {
        if (!isAdminLoggedIn()) {
            window.location.href = 'admin.html?login=true';
        }
        loadAdminDashboard();
    }

    // Update cart count on all pages
    updateCartUI();

    // HOME PAGE BUTTONS
    const orderBtn = document.querySelector('.order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (user) {
                window.location.href = 'menu.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    const orderNowBtn = document.querySelector('.order-now-btn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (user) {
                window.location.href = 'menu.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (user) {
                logout();
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // MENU PAGE
    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) {
        displayMenuItems();

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                displayMenuItems(category);
            });
        });

        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    }

    // CART PAGE
    if (document.getElementById('cartItems')) {
        displayCartItems();

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn && checkoutBtn.textContent === 'Proceed to Checkout') {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }
    }

    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target.id === 'statusModal') {
            closeStatusModal();
        }
    });
});

// Add cart notification styles
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }

    .cart-notification.show {
        transform: translateX(0);
    }

    .cart-notification i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);
