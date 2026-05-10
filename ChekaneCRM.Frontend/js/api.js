const API_URL = 'http://localhost:5000/api';

async function apiRequest(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body !== null && body !== undefined) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${url}`, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Ошибка ${response.status}`);
    }
    return await response.json();
}

async function loginByPhone(phone, password) {
    return await apiRequest('/auth/login-by-phone', 'POST', { phone, password });
}

async function registerUser(userData) {
    return await apiRequest('/auth/register', 'POST', userData);
}

async function loadProducts() {
    return await apiRequest('/products');
}

async function createProduct(productData) {
    return await apiRequest('/products', 'POST', productData);
}

async function updateProduct(productId, productData) {
    return await apiRequest(`/products/${productId}`, 'PUT', productData);
}

async function toggleProductAvailability(id) {
    return await apiRequest(`/products/${id}/toggle`, 'PATCH', {});
}

// работающ loadOrders - используем глобальный currentUser
async function loadOrders() {
    console.log('loadOrders вызвана');
    console.log('currentUser:', currentUser);
    
    if (!currentUser) {
        console.log('Нет пользователя');
        return [];
    }
    
    // Админ (roleId === 1) видит все заказы
    if (currentUser.roleId === 1) {
        console.log('Админ - загружаем все заказы');
        return await apiRequest('/orders');
    }
    
    // Обычный пользователь - только свои
    console.log('Обычный пользователь - загружаем свои заказы');
    return await apiRequest(`/orders/client/${currentUser.userId}`);
}

async function createOrder(orderData) {
    return await apiRequest('/orders', 'POST', orderData);
}

async function updateOrderStatus(orderId, status) {
    return await apiRequest(`/orders/${orderId}/status`, 'PATCH', status);
}

async function loadUsers() {
    return await apiRequest('/users');
}

async function loadStaff() {
    return await apiRequest('/users/staff');
}

async function updateUserRole(userId, roleId) {
    return await apiRequest(`/users/${userId}/role`, 'PATCH', roleId);
}

async function loginUser(login, password) {
    return await apiRequest('/auth/login', 'POST', { login, password });
}

// Экспорт в глобальную область
if (typeof window !== 'undefined') {
    window.apiRequest = apiRequest;
    window.loginByPhone = loginByPhone;
    window.registerUser = registerUser;
    window.loadProducts = loadProducts;
    window.createProduct = createProduct;
    window.updateProduct = updateProduct;
    window.toggleProductAvailability = toggleProductAvailability;
    window.loadOrders = loadOrders;
    window.createOrder = createOrder;
    window.updateOrderStatus = updateOrderStatus;
    window.loadUsers = loadUsers;
    window.loadStaff = loadStaff;
    window.updateUserRole = updateUserRole;
    window.loginUser = loginUser;
}
