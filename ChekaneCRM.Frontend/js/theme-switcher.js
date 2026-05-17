
const THEMES = {
    'neon-pink': {
        name: '🌸 Неоновый закат',
        primary: '#FF36AB',
        secondary: '#011936',
        accent: '#d9b8ff',
        background: '#0a0a0a',
        cardBg: '#1a1a2a',
        text: '#eeeeee',
        textMuted: '#aaaaaa'
    },
    'neon-blue': {
        name: '❄️ Ледяная малина',
        primary: '#94DEFF',
        secondary: '#FF277F',
        accent: '#94DEFF',
        background: '#0a1520',
        cardBg: '#1a2a3a',
        text: '#eeeeee',
        textMuted: '#bbccdd'
    },
    'neon-green': {
        name: '🍀 Мятная свежесть',
        primary: '#00ffcc',
        secondary: '#0a2a2a',
        accent: '#00ffcc',
        background: '#0a1a1a',
        cardBg: '#1a2a2a',
        text: '#eeeeee',
        textMuted: '#aaffdd'
    },
    'dark-red': {
        name: '🔥 Красный дракон',
        primary: '#FF3B3B',
        secondary: '#1A1A1A',
        accent: '#FF3B3B',
        background: '#0a0a0a',
        cardBg: '#1a1a1a',
        text: '#eeeeee',
        textMuted: '#ffaaaa'
    },
    'default': {
        name: '💜 Розовое сияние',
        primary: '#d9b8ff',
        secondary: '#ff6b9d',
        accent: '#d9b8ff',
        background: '#0a0a0a',
        cardBg: '#1a1a2a',
        text: '#eeeeee',
        textMuted: '#cccccc'
    }
};

let currentTheme = 'default';

// Применение темы
function applyTheme(themeId) {
    const theme = THEMES[themeId];
    if (!theme) return;
    
    currentTheme = themeId;
    
    // Сохраняем в localStorage
    localStorage.setItem('spotalk_theme', themeId);
    
    // Применяем CSS переменные
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-bg', theme.background);
    root.style.setProperty('--theme-card-bg', theme.cardBg);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-muted', theme.textMuted);
    
    // Также обновляем body фон
    document.body.style.background = theme.background;
    
    // Перерисовываем текущую страницу для применения новых стилей
    if (typeof currentPage !== 'undefined' && currentPage) {
        changePage(currentPage);
    }
    
    console.log(`🎨 Тема изменена на: ${theme.name}`);
}

// Загрузка сохранённой темы
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('spotalk_theme');
    if (savedTheme && THEMES[savedTheme]) {
        applyTheme(savedTheme);
    } else {
        applyTheme('default');
    }
}

// Показать панель выбора темы (можно вызвать из профиля)
function showThemeSelector() {
    const modalHtml = `
        <div id="themeModal" class="theme-modal">
            <div class="theme-modal-content">
                <div class="theme-modal-header">
                    <h3>🎨 Выбери цветовую тему</h3>
                    <button onclick="closeThemeModal()" class="theme-modal-close">✕</button>
                </div>
                <div class="theme-grid">
                    ${Object.entries(THEMES).map(([id, theme]) => `
                        <div class="theme-option ${currentTheme === id ? 'selected' : ''}" 
                             data-theme="${id}"
                             onclick="selectTheme('${id}')">
                            <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary})">
                                <div class="theme-preview-demo">
                                    <span style="background: ${theme.primary}"></span>
                                    <span style="background: ${theme.secondary}"></span>
                                </div>
                            </div>
                            <div class="theme-name">${theme.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно
    const existingModal = document.getElementById('themeModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Добавляем стили для модального окна
    if (!document.getElementById('themeModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'themeModalStyles';
        styles.textContent = `
            .theme-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .theme-modal-content {
                background: #1a1a2a;
                border-radius: 30px;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                border: 2px solid var(--theme-primary, #d9b8ff);
                box-shadow: 0 0 30px rgba(217,184,255,0.3);
            }
            .theme-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                color: var(--theme-primary, #d9b8ff);
            }
            .theme-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #ff6b9d;
            }
            .theme-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 1rem;
            }
            .theme-option {
                background: #0a0a0a;
                border-radius: 20px;
                padding: 1rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .theme-option:hover {
                transform: translateY(-3px);
            }
            .theme-option.selected {
                border-color: var(--theme-primary, #d9b8ff);
                box-shadow: 0 0 15px var(--theme-primary, #d9b8ff);
            }
            .theme-preview {
                height: 70px;
                border-radius: 15px;
                margin-bottom: 0.8rem;
            }
            .theme-preview-demo {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                padding-top: 1rem;
            }
            .theme-preview-demo span {
                width: 30px;
                height: 30px;
                border-radius: 8px;
            }
            .theme-name {
                font-size: 0.8rem;
                color: #eee;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeThemeModal() {
    const modal = document.getElementById('themeModal');
    if (modal) modal.remove();
}

function selectTheme(themeId) {
    applyTheme(themeId);
    closeThemeModal();
    showToast(`🎨 Тема "${THEMES[themeId].name}" применена!`, 'success');
}

// Глобальные функции
window.applyTheme = applyTheme;
window.loadSavedTheme = loadSavedTheme;
window.showThemeSelector = showThemeSelector;
window.closeThemeModal = closeThemeModal;
window.selectTheme = selectTheme;
window.THEMES = THEMES;