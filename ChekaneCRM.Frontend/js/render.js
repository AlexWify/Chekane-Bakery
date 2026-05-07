// Навигация
function renderNav() {
    const navLinks = document.getElementById('navLinks');
    const userInfo = document.getElementById('userInfo');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let links = `
        <button class="nav-link ${currentPage === 'home' ? 'active' : ''}" onclick="changePage('home')">🏠 Главная</button>
        <button class="nav-link ${currentPage === 'products' ? 'active' : ''}" onclick="changePage('products')">🍞 Товары</button>
        <button class="nav-link ${currentPage === 'cart' ? 'active' : ''}" onclick="changePage('cart')">🛒 Корзина (${cartCount})</button>
    `;
    
    if (currentUser) {
        links += `<button class="nav-link ${currentPage === 'orders' ? 'active' : ''}" onclick="changePage('orders')">📦 Мои заказы</button>`;
        if (currentUser.roleId === 1) {
            links += `<button class="nav-link ${currentPage === 'admin' ? 'active' : ''}" onclick="changePage('admin')">⚙️ Админ панель</button>`;
        }
    }
    
    navLinks.innerHTML = links;
    
    if (!currentUser) {
        userInfo.innerHTML = `
            <button class="btn-login" onclick="showLoginPage()">🔐 Вход</button>
            <button class="btn-register" onclick="showRegisterPage()">📝 Регистрация</button>
        `;
    } else {
        userInfo.innerHTML = `
            <span class="role-badge">${roleNames[currentUser.roleId]}</span>
            <span>👤 ${escapeHtml(currentUser.name)}</span>
            <button class="btn-logout" onclick="logout()">🚪 Выйти</button>
        `;
    }
}

// Управление страницами
async function changePage(page) {
    currentPage = page;
    renderNav();
    
    switch(page) {
        case 'home': await renderHome(); break;
        case 'products': await renderProducts(); break;
        case 'cart': await renderCart(); break;
        case 'orders': await renderOrders(); break;
        case 'admin': await renderAdmin(); break;
        case 'users': await renderUsers(); break;
        case 'staff': await renderStaff(); break;
        case 'login': showLoginPage(); break;
        case 'register': showRegisterPage(); break;
        default: await renderHome();
    }
}
