// вход по телефону
function showLoginPage() {
    currentPage = 'login';
    renderNav();
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <h2>🔐 Вход в систему</h2>
            <input type="tel" id="phoneInput" placeholder="Номер телефона (11 цифр)" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <input type="password" id="passwordInput" placeholder="Пароль" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <div id="loginErrors" style="color: #ff8888; font-size: 0.8rem; margin: 0.5rem 0;"></div>
            <button id="loginButton" style="width:100%; padding:0.8rem; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); border:none; border-radius:30px; font-weight:bold; cursor:pointer;">Войти</button>
            <p style="text-align:center; margin-top:1rem;">Нет аккаунта? <a onclick="showRegisterPage()" style="color:#d9b8ff; cursor:pointer;">Зарегистрироваться</a></p>
        </div>
    `;
    
    const loginBtn = document.getElementById('loginButton');
    if (loginBtn) {
        loginBtn.onclick = async () => {
            let phone = document.getElementById('phoneInput').value.trim();
            const password = document.getElementById('passwordInput').value;
            const errorsDiv = document.getElementById('loginErrors');
            errorsDiv.innerHTML = '';

            const phoneClean = phone.replace(/\D/g, '');

            if (phoneClean.length === 0) {
                errorsDiv.innerHTML = '❌ Введите номер телефона';
                return;
            }

            if (phoneClean.length !== 11) {
                errorsDiv.innerHTML = '❌ Номер телефона должен содержать 11 цифр';
                return;
            }

            if (!password) {
                errorsDiv.innerHTML = '❌ Введите пароль';
                return;
            }

            try {
                // ПРЯМОЙ ЗАПРОС, без посредников
                const response = await fetch('http://localhost:5000/api/auth/login-by-phone', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phoneClean, password: password })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Ошибка входа');
                }
                
                const userData = await response.json();
                console.log('Данные пользователя от сервера:', userData);
                
                // Сохраняем пользователя
                currentUser = {
                    userId: userData.userId,
                    id: userData.userId,
                    name: userData.name,
                    surname: userData.surname || '',
                    email: userData.email || '',
                    phone: userData.phone || phoneClean,
                    login: userData.login || '',
                    roleId: userData.roleId
                };
                
                console.log('currentUser сохранён:', currentUser);
                console.log('currentUser.userId:', currentUser.userId);
                
                localStorage.setItem('user', JSON.stringify(currentUser));
                renderNav();
                showToast(`✅ Добро пожаловать, ${currentUser.name}!`, 'success');
                
                // Переход на страницу товаров
                setTimeout(() => {
                    if (typeof changePage === 'function') {
                        changePage('products');
                    } else {
                        window.location.reload();
                    }
                }, 100);
                
            } catch (error) {
                console.error('Ошибка входа:', error);
                errorsDiv.innerHTML = '❌ ' + error.message;
            }
        };
    }
}

function showRegisterPage() {
    currentPage = 'register';
    renderNav();
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <h2>📝 Регистрация</h2>
            <input type="text" id="nameInput" placeholder="Имя" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <input type="text" id="surnameInput" placeholder="Фамилия" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <input type="tel" id="phoneInput" placeholder="Телефон (11 цифр, например: 79123456789)" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <input type="email" id="emailInput" placeholder="Email (должен содержать @gmail)" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <input type="password" id="passwordInput" placeholder="Пароль (8+ символов, заглавные и строчные)" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <input type="password" id="passwordConfirmInput" placeholder="Подтверждение пароля" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
            <div id="validationErrors" style="color: #ff8888; font-size: 0.8rem; margin: 0.5rem 0;"></div>
            <button id="registerButton" style="width:100%; padding:0.8rem; background: linear-gradient(135deg, #d9b8ff, #ff6b9d); border:none; border-radius:30px; font-weight:bold; cursor:pointer;">Зарегистрироваться</button>
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
    
    if (!name || !surname || !phone || !email) {
        errorsDiv.innerHTML = '<div>❌ Заполните все обязательные поля</div>';
        return;
    }
    
    const userData = {
        name: name,
        surname: surname,
        phone: phoneClean,
        email: email,
        login: phoneClean,
        password: password
    };
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка регистрации');
        }
        
        showToast('✅ Регистрация успешна! Теперь войдите.', 'success');
        showLoginPage();
    } catch (error) {
        errorsDiv.innerHTML = '<div>❌ ' + error.message + '</div>';
    }
}

window.showLoginPage = showLoginPage;
window.showRegisterPage = showRegisterPage;
