//главная стр
console.log('profile.js загружен');

async function renderProfile() {
    if (!currentUser) {
        changePage('home');
        showToast('Сначала войдите в систему', 'warning');
        return;
    }
    
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h2>👤 Мой профиль</h2>
            <div class="auth-page" style="margin-top: 1rem;">
                <form id="profileForm">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Имя:</label>
                        <input type="text" id="profileName" placeholder="Имя" value="${escapeHtml(currentUser.name)}" required 
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Фамилия:</label>
                        <input type="text" id="profileSurname" placeholder="Фамилия" value="${escapeHtml(currentUser.surname || '')}" required
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Email:</label>
                        <input type="email" id="profileEmail" placeholder="Email" value="${escapeHtml(currentUser.email)}" required
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Логин:</label>
                        <input type="text" id="profileLogin" placeholder="Логин" value="${escapeHtml(currentUser.login)}" required
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Телефон:</label>
                        <input type="tel" id="profilePhone" placeholder="Телефон" value="${escapeHtml(currentUser.phone || '')}"
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Новый пароль (оставьте пустым):</label>
                        <input type="password" id="profilePassword" placeholder="Новый пароль"
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #d9b8ff;">Подтверждение пароля:</label>
                        <input type="password" id="profilePasswordConfirm" placeholder="Подтверждение пароля"
                               style="width: 100%; padding: 0.8rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 12px; color: white;">
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem; justify-content: space-between;">
                        <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem 2rem; border-radius: 30px; border: none; color: white; font-weight: bold; cursor: pointer;">
                            💾 Сохранить изменения
                        </button>
                        <button type="button" onclick="deleteMyAccount()" style="background: #ff4444; padding: 0.8rem 2rem; border-radius: 30px; border: none; color: white; font-weight: bold; cursor: pointer;">
                            🗑️ Удалить аккаунт
                        </button>
                    </div>
                </form>
                <hr style="margin: 1rem 0; border-color: #d9b8ff;">
                <p style="font-size: 0.8rem; color: #888; text-align: center;">
                    🔐 Ваша роль: <strong style="color: #d9b8ff;">${roleBadges[currentUser.roleId]}</strong>
                </p>
            </div>
        </div>
    `;
    
    const form = document.getElementById('profileForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateProfile();
        };
    }
}

async function updateProfile() {
    const name = document.getElementById('profileName').value.trim();
    const surname = document.getElementById('profileSurname').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const login = document.getElementById('profileLogin').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const newPassword = document.getElementById('profilePassword').value;
    const passwordConfirm = document.getElementById('profilePasswordConfirm').value;
    
    if (!name || !surname || !email || !login) {
        showToast('Заполните все обязательные поля', 'warning');
        return;
    }
    
    if (newPassword && newPassword !== passwordConfirm) {
        showToast('Пароли не совпадают', 'warning');
        return;
    }
    
    const updateData = { 
        name: name,
        surname: surname,
        email: email,
        login: login,
        phone: phone
    };
    
    if (newPassword) {
        updateData.password = newPassword;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/${currentUser.userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) throw new Error('Ошибка обновления');
        
        showToast('✅ Профиль успешно обновлён!', 'success');
        
        currentUser.name = name;
        currentUser.surname = surname;
        currentUser.email = email;
        currentUser.login = login;
        currentUser.phone = phone;
        localStorage.setItem('user', JSON.stringify(currentUser));
        renderNav();
        
        if (newPassword) {
            setTimeout(() => {
                showToast('Пароль изменён. Пожалуйста, войдите заново.', 'info');
                logout();
            }, 1500);
        }
        
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

async function deleteMyAccount() {
    if (!confirm('⚠️ ВНИМАНИЕ! Вы уверены, что хотите удалить свой аккаунт?\n\nЭто действие НЕОБРАТИМО!')) {
        return;
    }
    
    const loginConfirm = prompt('Для подтверждения введите ваш логин:');
    if (loginConfirm !== currentUser.login) {
        showToast('❌ Логин не совпадает. Удаление отменено.', 'error');
        return;
    }
    
    const passwordConfirm = prompt('Введите ваш пароль для подтверждения:');
    const passwordTrimmed = passwordConfirm ? passwordConfirm.trim() : '';
    
    try {
        const response = await fetch(`${API_URL}/users/delete-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: currentUser.userId, 
                password: passwordTrimmed 
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Ошибка удаления');
        }
        
        showToast('✅ Аккаунт удалён. До свидания!', 'success');
        localStorage.clear();
        
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка удаления аккаунта:', error);
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

window.renderProfile = renderProfile;
window.updateProfile = updateProfile;
window.deleteMyAccount = deleteMyAccount;
