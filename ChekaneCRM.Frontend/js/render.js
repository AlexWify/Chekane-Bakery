// Навигация
function renderNav() {
    console.log('renderNav вызвана, currentUser:', currentUser);
    
    const navLinks = document.getElementById('navLinks');
    const userInfo = document.getElementById('userInfo');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (!navLinks) {
        console.error('navLinks не найден!');
        return;
    }
    
    let links = `
        <button class="nav-link" onclick="changePage('home')">🏠 Главная</button>
        <button class="nav-link" onclick="changePage('products')">🍞 Товары</button>
        <button class="nav-link" onclick="changePage('cart')">🛒 Корзина (${cartCount})</button>
    `;
    
    if (currentUser) {
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

// Управление страницами
async function changePage(page) {
    console.log('changePage вызвана, page:', page);
    console.log('currentUser:', currentUser);
    
    currentPage = page;
    renderNav();
    
    const app = document.getElementById('app');
    if (!app) {
        console.error('app элемент не найден!');
        return;
    }
    
    try {
        switch(page) {
            case 'home':
                console.log('Отображаем главную');
                await renderHome();
                break;
            case 'products':
                console.log('Отображаем товары');
                await renderProducts();
                break;
            case 'cart':
                console.log('Отображаем корзину');
                if (typeof renderCart === 'function') {
                    await renderCart();
                } else {
                    app.innerHTML = '<div class="error">Ошибка: функция корзины не найдена</div>';
                }
                break;
            case 'orders':
                console.log('Отображаем заказы');
                if (typeof renderOrders === 'function') {
                    console.log('renderOrders существует, вызываем...');
                    await renderOrders();
                } else {
                    console.error('renderOrders НЕ существует!');
                    app.innerHTML = '<div class="error">Ошибка: функция заказов не загружена. Проверьте подключение orders.js</div>';
                }
                break;
            case 'admin':
                console.log('Отображаем админку');
                await renderAdmin();
                break;
            case 'users':
                console.log('Отображаем пользователей');
                await renderUsers();
                break;
            case 'staff':
                console.log('Отображаем сотрудников');
                await renderStaff();
                break;
            case 'login':
                console.log('Отображаем вход');
                showLoginPage();
                break;
            case 'register':
                console.log('Отображаем регистрацию');
                showRegisterPage();
                break;
            default:
                console.log('Страница не найдена, переход на главную');
                await renderHome();
        }
    } catch (error) {
        console.error('Ошибка при отображении страницы:', error);
        app.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// Глобальные функции для HTML
window.changePage = changePage;
window.renderNav = renderNav;
