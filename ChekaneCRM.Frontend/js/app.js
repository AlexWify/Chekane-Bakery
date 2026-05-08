console.log('app.js загружен');

const savedUser = localStorage.getItem('user');
if (savedUser) {
    try { currentUser = JSON.parse(savedUser); } catch(e) {}
}

const savedCart = localStorage.getItem('cart');
if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch(e) {}
}

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

// Запуск
renderNav();
changePage('home');
