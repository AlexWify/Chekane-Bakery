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
            else showToast('Заполните все поля', 'warning');
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
            <input type="text" id="phoneInput" placeholder="Телефон (11 цифр)">
            <input type="email" id="emailInput" placeholder="Email (должен содержать @gmail)">
            <input type="text" id="loginInput" placeholder="Логин">
            <input type="password" id="passwordInput" placeholder="Пароль (8+ символов, заглавные и строчные)">
            <input type="password" id="passwordConfirmInput" placeholder="Подтверждение пароля">
            <div id="validationErrors" style="color: #ff8888; font-size: 0.8rem; margin: 0.5rem 0;"></div>
            <button id="registerButton">Зарегистрироваться</button>
            <p style="text-align:center; margin-top:1rem;">Уже есть аккаунт? <a onclick="showLoginPage()" style="color:#d9b8ff; cursor:pointer;">Войти</a></p>
        </div>
    `;
    
    const registerBtn = document.getElementById('registerButton');
    if (registerBtn) {
        registerBtn.onclick = () => {
            validateAndRegister();
        };
    }
}

function validatePhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
        return { valid: false, message: 'Телефон должен содержать ровно 11 цифр' };
    }
    return { valid: true, message: '' };
}

function validateEmail(email) {
    const emailLower = email.toLowerCase();
    if (!emailLower.includes('@gmail')) {
        return { valid: false, message: 'Email должен быть на Gmail (содержать @gmail)' };
    }
    return { valid: true, message: '' };
}

function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'Пароль должен содержать минимум 8 символов' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Пароль должен содержать хотя бы одну заглавную букву' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Пароль должен содержать хотя бы одну строчную букву' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
    }
    return { valid: true, message: '' };
}

async function validateAndRegister() {
    const name = document.getElementById('nameInput').value.trim();
    const surname = document.getElementById('surnameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const login = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const passwordConfirm = document.getElementById('passwordConfirmInput').value;
    
    const errorsDiv = document.getElementById('validationErrors');
    errorsDiv.innerHTML = '';
    
    const phoneClean = phone.replace(/\D/g, '');
    
    const phoneValidation = validatePhone(phoneClean);
    if (!phoneValidation.valid) {
        errorsDiv.innerHTML = '<div>❌ ' + phoneValidation.message + '</div>';
        return;
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        errorsDiv.innerHTML = '<div>❌ ' + emailValidation.message + '</div>';
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        errorsDiv.innerHTML = '<div>❌ ' + passwordValidation.message + '</div>';
        return;
    }
    
    if (password !== passwordConfirm) {
        errorsDiv.innerHTML = '<div>❌ Пароли не совпадают</div>';
        return;
    }
    
    if (!name || !surname || !phone || !email || !login) {
        errorsDiv.innerHTML = '<div>❌ Заполните все поля</div>';
        return;
    }
    
    const userData = {
        name: name,
        surname: surname,
        phone: phoneClean,
        email: email,
        login: login,
        password: password
    };
    
    try {
        await registerUser(userData);
        showToast('✅ Регистрация успешна! Теперь войдите.', 'success');
        showLoginPage();
    } catch (error) {
        errorsDiv.innerHTML = '<div>❌ ' + error.message + '</div>';
    }
}

window.showLoginPage = showLoginPage;
window.showRegisterPage = showRegisterPage;
window.validateAndRegister = validateAndRegister;
