let allUsers = [];

async function renderUsers(searchTerm = '') {
    if (!currentUser || currentUser.roleId !== 1) {
        changePage('home');
        return;
    }
    
    const users = await loadUsers();
    allUsers = users;
    
    let filteredUsers = users;
    if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        filteredUsers = users.filter(u => 
            (u.phone && u.phone.includes(term)) ||
            u.name.toLowerCase().includes(term) ||
            u.surname.toLowerCase().includes(term) ||
            u.login.toLowerCase().includes(term)
        );
    }
    
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <button class="btn" onclick="changePage('admin')">◀ Назад</button>
            <button class="btn" onclick="renderUsers()">👥 Пользователи</button>
            <button class="btn" onclick="renderStaff()">👨‍🍳 Сотрудники</button>
        </div>
        
        <h2>👥 Все пользователи</h2>
        
        <div style="margin-bottom: 2rem; position: relative;">
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" 
                       id="searchUserInput" 
                       placeholder="🔍 Поиск по телефону, имени, фамилии или логину..." 
                       style="flex: 1; padding: 0.8rem; background: #1a1a1a; border: 2px solid #d9b8ff; border-radius: 30px; color: white;">
                <button onclick="searchUsers()" style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d); padding: 0.8rem 1.5rem; border-radius: 30px;">🔍 Найти</button>
                <button onclick="clearUserSearch()" style="background: #666; padding: 0.8rem 1.5rem; border-radius: 30px;">❌ Очистить</button>
            </div>
            <div id="userSearchResultInfo" style="margin-top: 0.5rem; color: #888;"></div>
        </div>
        
        <div style="overflow-x: auto;">
            <table class="users-table" border="1" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Email</th>
                        <th>Логин</th>
                        <th>Телефон</th>
                        <th>Роль</th>
                        <th>Сменить роль</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody"></tbody>
            </table>
        </div>
    `;
    
    const tbody = document.getElementById('usersTableBody');
    const resultInfo = document.getElementById('userSearchResultInfo');
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">😕 Пользователи не найдены</td></tr>';
        resultInfo.innerHTML = 'Найдено: 0 пользователей';
        return;
    }
    
    resultInfo.innerHTML = `Найдено: ${filteredUsers.length} пользователей${searchTerm ? ` по запросу "${searchTerm}"` : ''}`;
    
    tbody.innerHTML = filteredUsers.map(u => {
        const isSuperAdmin = u.id === 1;
        const isCurrentUser = u.id === currentUser.userId;
        
        if (isSuperAdmin) {
            return `
                <tr>
                    <td>${u.id}</td>
                    <td style="color: #d9b8ff; font-weight: bold;">${escapeHtml(u.name)} 👑</td>
                    <td style="color: #d9b8ff; font-weight: bold;">${escapeHtml(u.surname)} 👑</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td style="color: #d9b8ff;">${escapeHtml(u.login)}</td>
                    <td style="color: #d9b8ff; font-weight: bold;">📱 ${escapeHtml(u.phone || 'не указан')}</td>
                    <td><span class="role-badge" style="background: linear-gradient(135deg, gold, orange);">👑 ГЛАВНЫЙ АДМИН 👑</span></td>
                    <td style="color: #ff8888; text-align: center;">🔒 НЕЛЬЗЯ ИЗМЕНИТЬ</td>
                </tr>
            `;
        }
        
        if (isCurrentUser && !isSuperAdmin) {
            return `
                <tr>
                    <td>${u.id}</td>
                    <td>${escapeHtml(u.name)} <span style="color: #ff8888;">(это вы)</span></td>
                    <td>${escapeHtml(u.surname)} <span style="color: #ff8888;">(это вы)</span></td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>${escapeHtml(u.login)}</td>
                    <td>📱 ${escapeHtml(u.phone || 'не указан')}</td>
                    <td><span class="role-badge">${roleBadges[u.roleId]}</span></td>
                    <td style="color: #ff8888;">⚠️ Вы не можете изменить свою роль</td>
                </tr>
            `;
        }
        
        return `
            <tr>
                <td>${u.id}</td>
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.surname)}</td>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.login)}</td>
                <td>📱 ${escapeHtml(u.phone || 'не указан')}</td>
                <td><span class="role-badge">${roleBadges[u.roleId]}</span></td>
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
        `;
    }).join('');
    
    const searchInput = document.getElementById('searchUserInput');
    if (searchInput) {
        searchInput.value = searchTerm;
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchUsers(); });
    }
}

function searchUsers() {
    const searchInput = document.getElementById('searchUserInput');
    renderUsers(searchInput ? searchInput.value : '');
}

function clearUserSearch() {
    const searchInput = document.getElementById('searchUserInput');
    if (searchInput) searchInput.value = '';
    renderUsers('');
}

async function changeUserRole(userId) {
    if (userId === 1) {
        showToast('⛔ НЕЛЬЗЯ изменить роль ГЛАВНОГО АДМИНА! Это защищённый аккаунт.', 'error');
        return;
    }
    
    if (userId === currentUser.userId) {
        showToast('⛔ Вы не можете изменить свою собственную роль!', 'warning');
        return;
    }
    
    const select = document.getElementById(`roleSelect_${userId}`);
    if (!select) {
        showToast('Ошибка: элемент не найден', 'error');
        return;
    }
    
    const roleId = parseInt(select.value);
    
    try {
        await updateUserRole(userId, roleId);
        showToast('✅ Роль пользователя изменена!', 'success');
        await renderUsers();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

window.renderUsers = renderUsers;
window.changeUserRole = changeUserRole;
window.searchUsers = searchUsers;
window.clearUserSearch = clearUserSearch;
