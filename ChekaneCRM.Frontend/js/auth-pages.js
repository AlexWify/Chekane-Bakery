// Страницы авторизации
function showLoginPage() {
    currentPage = 'login';
    renderNav();
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <h2>🔐 Вход в систему</h2>
            <input type="text" id="loginInput" placeholder="Логин">
            <input type="password" id="passwordInput" placeholder="Пароль">
            <button id="loginButton">Войти</button>
            <p style="text-align:center; margin-top:1rem;">Нет аккаунта? <a onclick="showRegisterPage()" style="color:#d9b8ff; cursor:pointer;">Зарегистрироваться</a></p>
            <hr><p style="text-align:center; font-size:0.8rem;">Тестовый админ: admin / 123</p>
        </div>
    `;
    
    const loginBtn = document.getElementById('loginButton');
    if (loginBtn) {
        loginBtn.onclick = () => {
            const loginVal = document.getElementById('loginInput').value;
            const passwordVal = document.getElementById('passwordInput').value;
            if (loginVal && passwordVal) login(loginVal, passwordVal);
            else alert('Заполните все поля');
        };
    }
}

function showRegisterPage() {
    currentPage = 'register';
    renderNav();
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <h2>📝 Регистрация</h2>
            <input type="text" id="nameInput" placeholder="Имя">
            <input type="text" id="surnameInput" placeholder="Фамилия">
            <input type="text" id="phoneInput" placeholder="Телефон">
            <input type="email" id="emailInput" placeholder="Email">
            <input type="text" id="loginInput" placeholder="Логин">
            <input type="password" id="passwordInput" placeholder="Пароль">
            <button id="registerButton">Зарегистрироваться</button>
            <p style="text-align:center; margin-top:1rem;">Уже есть аккаунт? <a onclick="showLoginPage()" style="color:#d9b8ff; cursor:pointer;">Войти</a></p>
        </div>
    `;
    
    const registerBtn = document.getElementById('registerButton');
    if (registerBtn) {
        registerBtn.onclick = () => {
            const userData = {
                name: document.getElementById('nameInput').value,
                surname: document.getElementById('surnameInput').value,
                phone: document.getElementById('phoneInput').value,
                email: document.getElementById('emailInput').value,
                login: document.getElementById('loginInput').value,
                password: document.getElementById('passwordInput').value
            };
            if (userData.name && userData.surname && userData.phone && userData.email && userData.login && userData.password) {
                register(userData);
            } else alert('Заполните все поля');
        };
    }
}
