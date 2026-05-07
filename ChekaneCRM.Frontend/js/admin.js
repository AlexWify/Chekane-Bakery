// Админ панель
async function renderAdmin() {
    if (!currentUser || currentUser.roleId !== 1) {
        changePage('home');
        return;
    }
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>⚙️ Админ панель</h2>
        <div class="feature-grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1rem; margin-top:2rem;">
            <div class="feature-card">
                <h3>👥 Пользователи</h3>
                <p>Управление ролями</p>
                <button onclick="renderUsers()">Управлять</button>
            </div>
            <div class="feature-card">
                <h3>👨‍🍳 Сотрудники</h3>
                <p>Список сотрудников</p>
                <button onclick="renderStaff()">Смотреть</button>
            </div>
            <div class="feature-card">
                <h3>🍞 Товары</h3>
                <p>Добавление и редактирование</p>
                <button onclick="changePage('products')">Товары</button>
            </div>
            <div class="feature-card">
                <h3>📦 Заказы</h3>
                <p>Управление заказами</p>
                <button onclick="changePage('orders')">Заказы</button>
            </div>
        </div>
    `;
}
