// API вызовы
async function apiRequest(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // если body не null, преобразуем в JSON
    if (body !== null && body !== undefined) {
        options.body = JSON.stringify(body);
    }

    console.log(`API Request: ${method} ${url}`, body); // Для отладки

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

// Товары
async function loadProducts() {
    return await apiRequest('/products');
}

async function toggleProductAvailability(id) {
    return await apiRequest(`/products/${id}/toggle`, 'PATCH', {});
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

async function updateUserRole(userId, roleId) {
    console.log(`Отправляем смену роли: userId=${userId}, roleId=${roleId}`);
    return await apiRequest(`/users/${userId}/role`, 'PATCH', roleId);
}

// Авторизация
async function loginUser(login, password) {
    return await apiRequest('/auth/login', 'POST', { login, password });
}

async function registerUser(userData) {
    return await apiRequest('/auth/register', 'POST', userData);
}
// Добавление товара (только админ)
async function createProduct(productData) {
    return await apiRequest('/products', 'POST', productData);
}

// Обновление товара (только админ)
async function updateProduct(productId, productData) {
    return await apiRequest(`/products/${productId}`, 'PUT', productData);
}
