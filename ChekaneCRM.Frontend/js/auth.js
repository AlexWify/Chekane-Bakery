// Авторизация
async function login(login, password) {
    try {
        const user = await loginUser(login, password);
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        renderNav();
        showToast(`✅ Добро пожаловать, ${user.name}!`, 'success');
        changePage('home');
    } catch (error) {
        showToast('❌ Ошибка входа: ' + error.message, 'error');
    }
}

async function register(userData) {
    try {
        await registerUser(userData);
        showToast('✅ Регистрация успешна! Теперь войдите.', 'success');
        showLoginPage();
    } catch (error) {
        showToast('❌ Ошибка регистрации: ' + error.message, 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    renderNav();
    showToast('🔓 Вы вышли из системы', 'info');
    changePage('home');
}
