// Страница товаров
async function renderProducts() {
    const products = await loadProducts();
    const app = document.getElementById('app');
    const canToggle = currentUser && (currentUser.roleId === 1 || currentUser.roleId === 2);
    
    app.innerHTML = `<h2>🍞 Каталог товаров</h2><div class="product-grid" id="productGrid"></div>`;
    const grid = document.getElementById('productGrid');
    
    if (!products.length) {
        grid.innerHTML = '<div class="loading">Нет товаров</div>';
        return;
    }
    
    grid.innerHTML = products.map(p => `
        <div class="product-card ${!p.isAvailable ? 'unavailable' : ''}">
            <h3>${escapeHtml(p.name)}</h3>
            <div class="price">${p.price} ₽</div>
            <div>${escapeHtml(p.category || 'Без категории')}</div>
            <div>${p.isAvailable ? '✅ В наличии' : '❌ Нет в наличии'}</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${p.isAvailable ? `<button onclick="addToCart({id:${p.id}, name:'${escapeHtml(p.name)}', price:${p.price}})">🛒 В корзину</button>` : ''}
                ${canToggle ? `<button onclick="toggleProductAvailability(${p.id})">🔄 ${p.isAvailable ? 'Нет в наличии' : 'Включить'}</button>` : ''}
            </div>
        </div>
    `).join('');
}

async function toggleProductAvailability(id) {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2)) {
        showToast('⛔ Нет прав для этого действия', 'warning');
        return;
    }
    try {
        await apiRequest(`/products/${id}/toggle`, 'PATCH');
        await renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}
