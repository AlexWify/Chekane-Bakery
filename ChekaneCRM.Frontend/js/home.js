// Главная страница
async function renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="hero">
            <div class="hero-left">
                <h1 class="bakery-name">Пекарня<br>ЧЕКАНЭ</h1>
                <div class="hero-text">
                    <p class="hero-line">Домашняя</p>
                    <p class="hero-line neon-handwritten">выпечка</p>
                    <p class="hero-line">с любовью</p>
                </div>
            </div>
            <div class="hero-right">
                <div class="hero-products">
                    <div class="product-item">
                        <img src="/images/k.png" alt="Хлеб" class="product-img flying">
                    </div>
                    <div class="product-item">
                        <img src="/images/p.jpg" alt="Выпечка" class="product-img flying">
                    </div>
                    <div class="product-item">
                        <img src="/images/cat.jpg" alt="Торт" class="product-img flying">
                    </div>
                </div>
                <p class="hero-slogan">
                    Вся наша продукция<br>
                    в одном каталоге
                </p>
                <button onclick="changePage('products')" class="hero-btn">В каталог →</button>
            </div>
        </div>
        <div class="feature-grid">
            <div class="feature-card"><h3>🍞 Свежая выпечка</h3><p>Каждый день с 6 утра</p></div>
            <div class="feature-card"><h3>🎂 Торты на заказ</h3><p>Индивидуальный дизайн</p></div>
            <div class="feature-card"><h3>🚚 Доставка</h3><p>Бесплатно от 1500 ₽</p></div>
        </div>
    `;
}
