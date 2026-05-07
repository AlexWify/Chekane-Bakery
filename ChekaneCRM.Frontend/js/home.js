// Главная страница
async function renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="hero">
            <h1>🥐 Пекарня "Чеканэ"</h1>
            <p style="font-size: 1.2rem;">Домашняя выпечка с любовью</p>
            <button onclick="changePage('products')" style="margin-top: 2rem; padding: 0.8rem 2rem;">Смотреть каталог →</button>
        </div>
        <div class="feature-grid">
            <div class="feature-card"><h3>🍞 Свежая выпечка</h3><p>Каждый день с 6 утра</p></div>
            <div class="feature-card"><h3>🎂 Торты на заказ</h3><p>Индивидуальный дизайн</p></div>
            <div class="feature-card"><h3>🚚 Доставка</h3><p>Бесплатно от 1500 ₽</p></div>
        </div>
    `;
}
