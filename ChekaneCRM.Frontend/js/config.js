// конфигурация
const API_URL = 'http://localhost:5000/api';

// глобальные переменные
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentPage = 'home';

// роли
const roleNames = { 1: 'Админ', 2: 'Продавец', 3: 'Пекарь', 4: 'Клиент' };
const roleBadges = { 1: '👑 Админ', 2: '💼 Продавец', 3: '👨‍🍳 Пекарь', 4: '👤 Клиент' };
