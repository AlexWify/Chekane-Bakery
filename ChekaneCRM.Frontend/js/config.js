// Конфигурация
const API_URL = 'http://localhost:5000/api';

// Глобальные переменные
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentPage = 'home';

// Роли
const roleNames = { 1: 'Админ', 2: 'Продавец', 3: 'Пекарь', 4: 'Клиент' };
const roleBadges = { 1: '👑 Админ', 2: '💼 Продавец', 3: '👨‍🍳 Пекарь', 4: '👤 Клиент' };

console.log('Config loaded, API_URL:', API_URL);
