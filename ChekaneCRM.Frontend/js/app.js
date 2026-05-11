console.log('app.js загружен');

const savedUser = localStorage.getItem('user');
if (savedUser) {
    try { currentUser = JSON.parse(savedUser); } catch(e) {}
}

const savedCart = localStorage.getItem('cart');
if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch(e) {}
}
//changePage('products')

// Глобальные функции для HTML
window.changePage = changePage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.toggleProductAvailability = toggleProductAvailability;
window.updateOrderStatus = updateOrderStatus;
window.changeUserRole = changeUserRole;
window.showLoginPage = showLoginPage;
window.showRegisterPage = showRegisterPage;
window.logout = logout;
window.renderUsers = renderUsers;
window.renderStaff = renderStaff;
window.renderCart = renderCart;
window.renderOrders = renderOrders;
window.renderAdmin = renderAdmin;
window.renderHome = renderHome;
window.renderProducts = renderProducts;
window.renderProfile = renderProfile;
window.deleteOrder = deleteOrder;
window.filterOrdersByDate = filterOrdersByDate;
window.clearDateFilter = clearDateFilter;
window.exportOrdersToCSV = exportOrdersToCSV;
window.formatDateTime = formatDateTime;
window.showAddProductForm = showAddProductForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.createProduct = createProduct;
window.updateProduct = updateProduct;
window.loginByPhone = loginByPhone;
window.openProductDetails = openProductDetails;
window.searchProducts = searchProducts;
window.clearSearch = clearSearch;
window.searchUsers = searchUsers;
window.clearUserSearch = clearUserSearch;

//  СОЗДАНИЕ НЕОНОВОГО ФОНА 
function createNeonBackground() {
    // Проверяем, нет ли уже фона
    if (document.querySelector('.neon-bg')) return;
    
    // Создаем контейнер для фона
    const bgContainer = document.createElement('div');
    bgContainer.className = 'neon-bg';
    
    // Добавляем горизонтальные линии
    for (let i = 0; i < 6; i++) {
        const line = document.createElement('div');
        line.className = 'neon-line';
        line.style.top = `${10 + Math.random() * 80}%`;
        line.style.width = `${50 + Math.random() * 100}%`;
        line.style.left = `${Math.random() * 30}%`;
        line.style.animationDelay = `${i * 1.5}s`;
        line.style.animationDuration = `${6 + Math.random() * 4}s`;
        bgContainer.appendChild(line);
    }
    
    // Добавляем вертикальные линии
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'neon-line-vertical';
        line.style.left = `${15 + Math.random() * 70}%`;
        line.style.height = `${40 + Math.random() * 60}%`;
        line.style.top = `${Math.random() * 30}%`;
        line.style.animationDelay = `${i * 2}s`;
        line.style.animationDuration = `${8 + Math.random() * 5}s`;
        bgContainer.appendChild(line);
    }
    
    // Добавляем сердечки
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'neon-heart';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${15 + Math.random() * 25}px`;
        heart.style.animationDelay = `${Math.random() * 15}s`;
        heart.style.animationDuration = `${10 + Math.random() * 10}s`;
        bgContainer.appendChild(heart);
    }
    
    // Добавляем точки
    for (let i = 0; i < 50; i++) {
        const dot = document.createElement('div');
        dot.className = 'neon-dot';
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 3}s`;
        dot.style.animationDuration = `${2 + Math.random() * 3}s`;
        bgContainer.appendChild(dot);
    }
    
    document.body.insertBefore(bgContainer, document.body.firstChild);
}

// Запускаем создание фона при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNeonBackground);
} else {
    createNeonBackground();
}

// Запуск
renderNav();
changePage('home');
