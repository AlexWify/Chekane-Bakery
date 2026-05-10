const API_URL = 'http://localhost:5000/api';

async function apiRequest(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body !== null && body !== undefined) {
        options.body = JSON.stringify(body);
    }

    console.log(`API Request: ${method} ${url}`, body);

    try {
        const response = await fetch(`${API_URL}${url}`, options);

        if (!response.ok) {
            let errorMessage = `Ошибка ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.message || error.title || errorMessage;
                console.error('Детали ошибки:', error);
            } catch(e) {}
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
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

async function loadOrders() {
    if (!window.currentUser) return [];
    const isAdmin = window.currentUser.roleId === 1;
    const url = isAdmin ? '/orders' : `/orders/client/${window.currentUser.userId}`;
    return await apiRequest(url);
}

async function createOrder(orderData) {
    return await apiRequest('/orders', 'POST', orderData);
}

async function updateOrderStatus(orderId, status) {
    return await apiRequest(`/orders/${orderId}/status`, 'PATCH', { status });
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
