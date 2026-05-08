editingProductId = null;

renderProducts = async function() {
    const products = await loadProducts();
    const app = document.getElementById('app');
    const canManage = currentUser && (currentUser.roleId === 1 || currentUser.roleId === 3);
    
    app.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>🍞 Каталог товаров</h2>
            ${canManage ? `<button onclick="showAddProductForm()" style="background: linear-gradient(135deg, #00b894, #009432);">➕ Добавить товар</button>` : ''}
        </div>
        <div class="product-grid" id="productGrid"></div>
    `;
    
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
                ${canManage ? `<button onclick="toggleProductAvailability(${p.id})">🔄 ${p.isAvailable ? 'Нет в наличии' : 'Включить'}</button>` : ''}
                ${canManage ? `<button onclick="editProduct(${p.id})">✏️ Ред.</button>` : ''}
                ${canManage ? `<button onclick="deleteProduct(${p.id})">🗑️ Удалить</button>` : ''}
            </div>
        </div>
    `).join('');
};

showAddProductForm = function() {
    editingProductId = null;
    document.getElementById('app').innerHTML = `
        <h2>➕ Добавление товара</h2>
        <div class="auth-page">
            <input type="text" id="productName" placeholder="Название" required>
            <input type="number" id="productPrice" placeholder="Цена" required>
            <input type="text" id="productCategory" placeholder="Категория">
            <button onclick="createProduct()">Сохранить</button>
            <button onclick="renderProducts()">Назад</button>
        </div>
    `;
};

editProduct = async function(id) {
    const products = await loadProducts();
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingProductId = id;
    document.getElementById('app').innerHTML = `
        <h2>✏️ Редактирование товара</h2>
        <div class="auth-page">
            <input type="text" id="productName" value="${p.name}" required>
            <input type="number" id="productPrice" value="${p.price}" required>
            <input type="text" id="productCategory" value="${p.category || ''}">
            <button onclick="updateProduct(${id})">Обновить</button>
            <button onclick="renderProducts()">Назад</button>
        </div>
    `;
};

createProduct = async function() {
    const data = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        isAvailable: true
    };
    try {
        await apiRequest('/products', 'POST', data);
        showToast('✅ Товар добавлен', 'success');
        renderProducts();
    } catch(e) { showToast('❌ Ошибка', 'error'); }
};

updateProduct = async function(id) {
    const data = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        isAvailable: true
    };
    try {
        await apiRequest(`/products/${id}`, 'PUT', data);
        showToast('✅ Товар обновлён', 'success');
        renderProducts();
    } catch(e) { showToast('❌ Ошибка', 'error'); }
};

deleteProduct = async function(id) {
    if (!confirm('Удалить товар?')) return;
    try {
        await apiRequest(`/products/${id}`, 'DELETE');
        showToast('✅ Товар удалён', 'success');
        renderProducts();
    } catch(e) { showToast('❌ Ошибка', 'error'); }
};

toggleProductAvailability = async function(id) {
    try {
        await apiRequest(`/products/${id}/toggle`, 'PATCH', {});
        renderProducts();
    } catch(e) { showToast('❌ Ошибка', 'error'); }
};
