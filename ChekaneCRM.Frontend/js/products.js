// Страница товаров
console.log('products.js загружен');

let editingProductId = null;

async function renderProducts() {
    const products = await loadProducts();
    const app = document.getElementById('app');
    const canManage = currentUser && (currentUser.roleId === 1);
    
    app.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>🍞 Каталог товаров</h2>
            ${canManage ? `
                <button onclick="showAddProductForm()" style="background: linear-gradient(135deg, #00b894, #009432);">
                    ➕ Добавить товар
                </button>
            ` : ''}
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
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3>${escapeHtml(p.name)}</h3>
                ${canManage ? `
                    <div style="display: flex; gap: 0.3rem;">
                        <button onclick="editProduct(${p.id})" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">✏️</button>
                        <button onclick="deleteProduct(${p.id})" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; background: #ff4444;">🗑️</button>
                    </div>
                ` : ''}
            </div>
            <div class="price">${p.price} ₽</div>
            <div>${escapeHtml(p.category || 'Без категории')}</div>
            <div>${p.isAvailable ? '✅ В наличии' : '❌ Нет в наличии'}</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${p.isAvailable ? `<button onclick="addToCart({id:${p.id}, name:'${escapeHtml(p.name)}', price:${p.price}})">🛒 В корзину</button>` : ''}
                ${canManage ? `<button onclick="toggleProductAvailability(${p.id})">🔄 ${p.isAvailable ? 'Нет в наличии' : 'Включить'}</button>` : ''}
            </div>
        </div>
    `).join('');
}


// Показать форму добавления товара
function showAddProductForm() {
    editingProductId = null;
    document.getElementById('app').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>➕ Добавление товара</h2>
            <button onclick="renderProducts()" class="btn">◀ Назад к товарам</button>
        </div>
        <div class="auth-page" style="max-width: 600px;">
            <form id="productForm">
                <input type="text" id="productName" placeholder="Название товара" required>
                <input type="number" id="productPrice" placeholder="Цена (₽)" required>
                <input type="text" id="productCategory" placeholder="Категория (например: Хлеб, Выпечка, Торты)">
                <textarea id="productDescription" rows="3" placeholder="Описание товара"></textarea>
                <div style="margin: 1rem 0;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="productIsAvailable" checked>
                        <span>Товар в наличии</span>
                    </label>
                </div>
                <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432);">
                    💾 Сохранить товар
                </button>
            </form>
        </div>
    `;
    
    const form = document.getElementById('productForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await createProduct();
    };
}

// Показать форму редактирования товара
async function editProduct(productId) {
    editingProductId = productId;
    const products = await loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Товар не найден', 'error');
        return;
    }
    
    document.getElementById('app').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>✏️ Редактирование товара</h2>
            <button onclick="renderProducts()" class="btn">◀ Назад к товарам</button>
        </div>
        <div class="auth-page" style="max-width: 600px;">
            <form id="productForm">
                <input type="text" id="productName" placeholder="Название товара" value="${escapeHtml(product.name)}" required>
                <input type="number" id="productPrice" placeholder="Цена (₽)" value="${product.price}" required>
                <input type="text" id="productCategory" placeholder="Категория" value="${escapeHtml(product.category || '')}">
                <textarea id="productDescription" rows="3" placeholder="Описание товара">${escapeHtml(product.description || '')}</textarea>
                <div style="margin: 1rem 0;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="productIsAvailable" ${product.isAvailable ? 'checked' : ''}>
                        <span>Товар в наличии</span>
                    </label>
                </div>
                <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432);">
                    💾 Обновить товар
                </button>
                <button type="button" onclick="deleteProduct(${productId})" style="background: #ff4444; margin-top: 0.5rem;">
                    🗑️ Удалить товар
                </button>
            </form>
        </div>
    `;
    
    const form = document.getElementById('productForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await updateProduct(productId);
    };
}

// Создание товара
async function createProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        isAvailable: document.getElementById('productIsAvailable').checked
    };
    
    if (!productData.name || !productData.price) {
        showToast('Заполните название и цену', 'warning');
        return;
    }
    
    try {
        await apiRequest('/products', 'POST', productData);
        showToast('✅ Товар успешно добавлен!', 'success');
        renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

// Обновление товара
async function updateProduct(productId) {
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        isAvailable: document.getElementById('productIsAvailable').checked
    };
    
    if (!productData.name || !productData.price) {
        showToast('Заполните название и цену', 'warning');
        return;
    }
    
    try {
        await apiRequest(`/products/${productId}`, 'PUT', productData);
        showToast('✅ Товар успешно обновлён!', 'success');
        renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

// Удаление товара
async function deleteProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }
    
    try {
        await apiRequest(`/products/${productId}`, 'DELETE');
        showToast('✅ Товар удалён!', 'success');
        if (editingProductId) {
            renderProducts();
        } else {
            renderProducts();
        }
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

async function toggleProductAvailability(id) {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2)) {
        showToast('⛔ Нет прав для этого действия', 'warning');
        return;
    }
    try {
        await apiRequest(`/products/${id}/toggle`, 'PATCH', {});
        await renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}
