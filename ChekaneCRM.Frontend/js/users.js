// users.js - с красивыми смайликами в выпадающем списке
async function renderUsers() {
    if (!currentUser || currentUser.roleId !== 1) {
        changePage('home');
        return;
    }
    
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
            <table class="users-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">ID</th>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">Имя</th>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">Фамилия</th>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">Email</th>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">Логин</th>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">Роль</th>
                        <th style="padding: 12px; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black;">Сменить роль</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody"></tbody>
            </table>
        </div>
    `;
    
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(u => {
        // Смайлик для роли
        const roleEmojis = { 1: '👑', 2: '💼', 3: '👨‍🍳', 4: '👤' };
        const roleEmoji = roleEmojis[u.roleId] || '❓';
        
        return `
            <tr style="border-bottom: 1px solid #d9b8ff;">
                <td style="padding: 10px;">${u.id}</td>
                <td style="padding: 10px;">${escapeHtml(u.name)}</td>
                <td style="padding: 10px;">${escapeHtml(u.surname)}</td>
                <td style="padding: 10px;">${escapeHtml(u.email)}</td>
                <td style="padding: 10px;">${escapeHtml(u.login)}</td>
                <td style="padding: 10px;">
                    <span style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d); color: black; padding: 5px 12px; border-radius: 20px; font-weight: bold;">
                        ${roleEmoji} ${roleNames[u.roleId]}
                    </span>
                </td>
                <td style="padding: 10px;">
                    <select id="roleSelect_${u.id}" style="background: #1a1a1a; color: white; border: 1px solid #d9b8ff; border-radius: 20px; padding: 6px 12px; font-size: 14px;">
                        <option value="1" ${u.roleId === 1 ? 'selected' : ''}>👑 Админ</option>
                        <option value="2" ${u.roleId === 2 ? 'selected' : ''}>💼 Продавец</option>
                        <option value="3" ${u.roleId === 3 ? 'selected' : ''}>👨‍🍳 Пекарь</option>
                        <option value="4" ${u.roleId === 4 ? 'selected' : ''}>👤 Клиент</option>
                    </select>
                    <button onclick="changeUserRole(${u.id})" style="background: linear-gradient(135deg, #00b894, #009432); border: none; border-radius: 20px; padding: 6px 15px; margin-left: 8px; color: white; font-weight: bold; cursor: pointer;">✨ Изменить</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function changeUserRole(userId) {
    const select = document.getElementById(`roleSelect_${userId}`);
    if (!select) return;
    
    const roleId = parseInt(select.value);
    
    try {
        await updateUserRole(userId, roleId);
        showToast('✅ Роль изменена на ' + select.options[select.selectedIndex].text, 'success');
        
        if (currentUser && currentUser.userId === userId) {
            currentUser.roleId = roleId;
            localStorage.setItem('user', JSON.stringify(currentUser));
            renderNav();
        }
        await renderUsers();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

window.renderUsers = renderUsers;
window.changeUserRole = changeUserRole;
