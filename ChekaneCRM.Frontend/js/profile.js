// Страница профиля пользователя
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
                    <input type="text" id="profileName" placeholder="Имя" value="${escapeHtml(currentUser.name)}" required>
                    <input type="text" id="profileSurname" placeholder="Фамилия" value="${escapeHtml(currentUser.surname || '')}" required>
                    <input type="email" id="profileEmail" placeholder="Email" value="${escapeHtml(currentUser.email)}" required>
                    <input type="text" id="profileLogin" placeholder="Логин" value="${escapeHtml(currentUser.login)}" required>
                    <input type="password" id="profilePassword" placeholder="Новый пароль (оставьте пустым, если не хотите менять)">
                    <input type="password" id="profilePasswordConfirm" placeholder="Подтверждение нового пароля">
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432);">
                            💾 Сохранить изменения
                        </button>
                        <button type="button" onclick="deleteMyAccount()" style="background: #ff4444;">
                            🗑️ Удалить аккаунт
                        </button>
                    </div>
                </form>
                <hr style="margin: 1rem 0; border-color: #d9b8ff;">
                <p style="font-size: 0.8rem; color: #888; text-align: center;">🔐 После изменения данных потребуется повторный вход</p>
            </div>
        </div>
    `;
    
    const form = document.getElementById('profileForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await updateProfile();
    };
}

// Обновление профиля
async function updateProfile() {
    const name = document.getElementById('profileName').value;
    const surname = document.getElementById('profileSurname').value;
    const email = document.getElementById('profileEmail').value;
    const login = document.getElementById('profileLogin').value;
    const newPassword = document.getElementById('profilePassword').value;
    const passwordConfirm = document.getElementById('profilePasswordConfirm').value;
    
    if (!name || !surname || !email || !login) {
        showToast('Заполните все поля', 'warning');
        return;
    }
    
    if (newPassword && newPassword !== passwordConfirm) {
        showToast('Пароли не совпадают', 'warning');
        return;
    }
    
    const updateData = { name, surname, email, login };
    if (newPassword) updateData.password = newPassword;
    
    try {
        await apiRequest(`/users/${currentUser.userId}`, 'PUT', updateData);
        showToast('✅ Профиль успешно обновлён!', 'success');
        
        // Обновляем данные текущего пользователя
        currentUser.name = name;
        currentUser.surname = surname;
        currentUser.email = email;
        currentUser.login = login;
        localStorage.setItem('user', JSON.stringify(currentUser));
        renderNav();
        
        setTimeout(() => {
            showToast('Пожалуйста, войдите заново', 'info');
            logout();
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

// Удаление своего аккаунта
async function deleteMyAccount() {
    if (!confirm('⚠️ Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо! Все ваши заказы будут потеряны.')) {
        return;
    }
    
    const loginConfirm = prompt('Введите ваш логин для подтверждения:');
    if (loginConfirm !== currentUser.login) {
        showToast('❌ Логин не совпадает. Удаление отменено.', 'error');
        return;
    }
    
    try {
        await apiRequest(`/users/${currentUser.userId}`, 'DELETE');
        showToast('✅ Аккаунт удалён. До свидания!', 'success');
        localStorage.clear();
        setTimeout(() => {
            location.reload();
        }, 2000);
    } catch (error) {
        console.error('Ошибка удаления аккаунта:', error);
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

// Глобальные функции
window.renderProfile = renderProfile;
window.updateProfile = updateProfile;
window.deleteMyAccount = deleteMyAccount;