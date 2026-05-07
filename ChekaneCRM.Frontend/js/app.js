// Главный файл приложения
// Загружаем сохранённые данные
const savedUser = localStorage.getItem('user');
if (savedUser) {
    try { currentUser = JSON.parse(savedUser); } catch(e) {}
}

const savedCart = localStorage.getItem('cart');
if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch(e) {}
}

// Глобальные функции для HTML
window.showAddProductForm = showAddProductForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.createProduct = createProduct;
window.updateProduct = updateProduct;
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
window.renderCart = renderCart; // ДОБАВЛЕНО

// Запуск
renderNav();
changePage('home');
