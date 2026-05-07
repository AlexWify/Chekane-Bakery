// Страница пользователей (админ)
async function renderUsers() {
    if (!currentUser || currentUser.roleId !== 1) {
        changePage('home');
        return;
    }
    
    try {
        const users = await loadUsers();
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <button class="btn" onclick="changePage('admin')">◀ Назад</button>
                <button class="btn" onclick="renderUsers()">👥 Пользователи</button>
                <button class="btn" onclick="renderStaff()">👨‍🍳 Сотрудники</button>
            </div>
            <h2>👥 Все пользователи</h2>
            <div style="overflow-x: auto;">
                <table class="users-table">
                    <thead>
                        <tr><th>ID</th><th>Имя</th><th>Фамилия</th><th>Email</th><th>Логин</th><th>Роль</th><th>Сменить роль</th></tr>
                    </thead>
                    <tbody id="usersTableBody"></tbody>
                </table>
            </div>
        `;
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.surname)}</td>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.login)}</td>
                <td><span class="role-badge">${roleBadges[u.roleId] || 'Неизвестно'}</span></td>
                <td>
                    <select id="roleSelect_${u.id}" class="status-select">
                        <option value="1" ${u.roleId === 1 ? 'selected' : ''}>👑 Админ</option>
                        <option value="2" ${u.roleId === 2 ? 'selected' : ''}>💼 Продавец</option>
                        <option value="3" ${u.roleId === 3 ? 'selected' : ''}>👨‍🍳 Пекарь</option>
                        <option value="4" ${u.roleId === 4 ? 'selected' : ''}>👤 Клиент</option>
                    </select>
                    <button onclick="changeUserRole(${u.id})" class="btn" style="margin-top:0;">Изменить</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        showToast('Ошибка загрузки пользователей: ' + error.message, 'error');
    }
}

// changeUserRole - вызывает updateUserRole из api.js
async function changeUserRole(userId) {
    const select = document.getElementById(`roleSelect_${userId}`);
    if (!select) {
        showToast('Ошибка: элемент не найден', 'error');
        return;
    }
    
    const roleId = parseInt(select.value);
    
    console.log(`Меняем роль пользователя ${userId} на ${roleId}`);
    
    try {
        // Вызываем исправленную функцию из api.js
        await updateUserRole(userId, roleId);
        showToast('✅ Роль пользователя изменена!', 'success');
        
        // Если изменили роль текущего пользователя, обновляем данные
        if (currentUser && currentUser.userId === userId) {
            currentUser.roleId = roleId;
            localStorage.setItem('user', JSON.stringify(currentUser));
            renderNav();
        }
        
        // Обновляем список пользователей
        await renderUsers();
        
    } catch (error) {
        console.error('Ошибка при смене роли:', error);
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

// Глобальные функции
window.renderUsers = renderUsers;
window.changeUserRole = changeUserRole;
