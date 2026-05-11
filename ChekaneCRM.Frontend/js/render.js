function renderNav() {
    const navLinks = document.getElementById('navLinks');
    const userInfo = document.getElementById('userInfo');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let links = `
        <button class="nav-link" onclick="changePage('home')">🏠 Главная</button>
        <button class="nav-link" onclick="changePage('products')">🍞 Товары</button>
        <button class="nav-link" onclick="changePage('cart')">🛒 Корзина (${cartCount})</button>
    `;
    
    if (currentUser) {
        links += `<button class="nav-link" onclick="changePage('profile')">👤 Профиль</button>`;
        links += `<button class="nav-link" onclick="changePage('orders')">📦 Мои заказы</button>`;
        if (currentUser.roleId === 1) {
            links += `<button class="nav-link" onclick="changePage('admin')">⚙️ Админ панель</button>`;
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


async function changePage(page) {
    currentPage = page;
    renderNav();
    
    const app = document.getElementById('app');
    
    switch(page) {
        case 'home': 
            await renderHome(); 
            break;
        case 'products': 
            await renderProducts(); 
            break;
            case 'products': 
            await renderProducts();
           // Добавляем черный фон 
          const productsDiv = document.querySelector('.products-page');
         if (productsDiv) {
        productsDiv.style.background = '#0a0a0f';
        productsDiv.style.borderRadius = '20px';
        productsDiv.style.padding = '1.5rem';
    }
    break;
        case 'cart': 
            await renderCart(); 
            break;
        case 'profile':
            if (typeof renderProfile === 'function') {
                await renderProfile();
            } else {
                app.innerHTML = '<div class="error">Ошибка: профиль не загружен</div>';
            }
            break;
        case 'orders':
            if (typeof renderOrders === 'function') {
                await renderOrders();
            } else {
                app.innerHTML = '<div class="error">Ошибка: заказы не загружены</div>';
            }
            break;
        case 'admin': 
            await renderAdmin(); 
            break;
        case 'users': 
            await renderUsers(); 
            break;
        case 'staff': 
            await renderStaff(); 
            break;
        case 'login': 
            showLoginPage(); 
            break;
        case 'register': 
            showRegisterPage(); 
            break;
        default: 
            await renderHome();
    }
}

window.changePage = changePage;
