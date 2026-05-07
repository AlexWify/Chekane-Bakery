// API вызовы
async function apiRequest(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${API_URL}${url}`, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка запроса');
    }
    return response.json();
}

// Товары
async function loadProducts() {
    return await apiRequest('/products');
}

async function toggleProductAvailability(id) {
    return await apiRequest(`/products/${id}/toggle`, 'PATCH');
}

// Заказы
async function loadOrders() {
    if (!currentUser) return [];
    const isAdmin = currentUser.roleId === 1;
    const url = isAdmin ? '/orders' : `/orders/client/${currentUser.userId}`;
    return await apiRequest(url);
}

async function createOrder(orderData) {
    return await apiRequest('/orders', 'POST', orderData);
}

async function updateOrderStatus(orderId, status) {
    return await apiRequest(`/orders/${orderId}/status`, 'PATCH', { status });
}

// Пользователи
async function loadUsers() {
    return await apiRequest('/users');
}

async function loadStaff() {
    return await apiRequest('/users/staff');
}

async function changeUserRole(userId, roleId) {
    return await apiRequest(`/users/${userId}/role`, 'PATCH', roleId);
}

// Авторизация
async function loginUser(login, password) {
    return await apiRequest('/auth/login', 'POST', { login, password });
}

async function registerUser(userData) {
    return await apiRequest('/auth/register', 'POST', userData);
}
