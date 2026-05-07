// Страница сотрудников
async function renderStaff() {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2)) {
        changePage('home');
        return;
    }
    
    const staff = await loadStaff();
    const app = document.getElementById('app');
    const staffRoleNames = { 1: '👑 Администратор', 2: '💼 Продавец', 3: '👨‍🍳 Пекарь' };
    
    app.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <button class="btn" onclick="changePage('admin')">◀ Назад</button>
            ${currentUser.roleId === 1 ? '<button class="btn" onclick="renderUsers()">👥 Пользователи</button>' : ''}
            <button class="btn" onclick="renderStaff()">👨‍🍳 Сотрудники</button>
        </div>
        <h2>👨‍🍳 Наши сотрудники</h2>
        <div style="overflow-x: auto;">
            <table class="users-table">
                <thead><tr><th>ID</th><th>Имя</th><th>Фамилия</th><th>Email</th><th>Телефон</th><th>Должность</th></tr></thead>
                <tbody>
                    ${staff.map(s => `
                        <tr>
                            <td>${s.id}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.surname)}</td>
                            <td>${escapeHtml(s.email)}</td><td>${escapeHtml(s.phone)}</td>
                            <td><span class="role-badge">${staffRoleNames[s.roleId]}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
