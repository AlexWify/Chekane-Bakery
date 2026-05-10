// Конфигурация
//const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentPage = 'home';

// Роли
const roleNames = { 
    1: '👑 Админ', 
    2: '💼 Продавец', 
    3: '👨‍🍳 Пекарь', 
    4: '👤 Клиент' 
};

const roleBadges = { 
    1: '👑 Админ', 
    2: '💼 Продавец', 
    3: '👨‍🍳 Пекарь', 
    4: '👤 Клиент' 
};
