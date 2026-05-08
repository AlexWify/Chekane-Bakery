// products.js
console.log('products.js загружен');

let editingProductId = null;

function getProductImage(category) {
    const categoryLower = (category || '').toLowerCase();
    
    if (categoryLower.includes('хлеб') || categoryLower.includes('bread')) {
        return '/images/bread.jpg';
    }
    if (categoryLower.includes('торт') || categoryLower.includes('cake')) {
        return '/images/cake.jpg';
    }
    if (categoryLower.includes('выпечк') || categoryLower.includes('pastry') || categoryLower.includes('булочк')) {
        return '/images/pastry.jpg';
    }
    if (categoryLower.includes('печенье') || categoryLower.includes('cookie')) {
        return '/images/cookies.jpg';
    }
    return '/images/default.jpg';
}

async function renderProducts() {
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
    
    grid.innerHTML = products.map(p => {
        const imagePath = getProductImage(p.category);
        return `
            <div class="product-card ${!p.isAvailable ? 'unavailable' : ''}">
                <div style="position: relative;">
                    <img src="${imagePath}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 15px; margin-bottom: 0.8rem;">
                    ${canManage ? `
                        <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.3rem;">
                            <button onclick="editProduct(${p.id})" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; background: rgba(0,0,0,0.7);">✏️</button>
                            <button onclick="deleteProduct(${p.id})" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; background: rgba(255,68,68,0.9);">🗑️</button>
                        </div>
                    ` : ''}
                </div>
                <h3>${escapeHtml(p.name)}</h3>
                <div class="price">${p.price} ₽</div>
                <div>📁 ${escapeHtml(p.category || 'Без категории')}</div>
                <div>${p.isAvailable ? '✅ В наличии' : '❌ Нет в наличии'}</div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    <button onclick="openProductDetails(${p.id})" style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d);">🔍 Подробнее</button>
                    ${p.isAvailable ? `<button onclick="addToCart({id:${p.id}, name:'${escapeHtml(p.name)}', price:${p.price}})" style="background: linear-gradient(135deg, #00b894, #009432);">🛒 В корзину</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function openProductDetails(productId) {
    const products = await loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Товар не найден', 'error');
        return;
    }
    
    const app = document.getElementById('app');
    const canManage = currentUser && (currentUser.roleId === 1 || currentUser.roleId === 3);
    
    app.innerHTML = `
        <button onclick="renderProducts()" class="btn" style="margin-bottom: 1rem;">← Назад к товарам</button>
        <div style="background: linear-gradient(135deg, #ffe4f0, #ffd6e8); border-radius: 30px; padding: 2rem; color: #4a006a;">
            <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
                <div style="flex: 1; min-width: 300px;">
                    <img src="${getProductImage(product.category)}" alt="${escapeHtml(product.name)}" style="width: 100%; border-radius: 20px;">
                </div>
                <div style="flex: 2;">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem;">${escapeHtml(product.name)}</h1>
                    <div style="font-size: 2rem; font-weight: bold; color: #ff3388;">${product.price} ₽</div>
                    
                    <div style="margin: 1rem 0;">
                        <h3>📝 Описание</h3>
                        <p>${escapeHtml(product.description || 'Описание отсутствует')}</p>
                    </div>
                    
                    <div style="margin: 1rem 0;">
                        <h3>🥗 Пищевая ценность (на 100г)</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center; min-width: 80px;">
                                <span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff; display: block;">${product.proteins || 0}</span>
                                <span style="font-size: 0.7rem; color: #888;">Белки (г)</span>
                            </div>
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center; min-width: 80px;">
                                <span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff; display: block;">${product.fats || 0}</span>
                                <span style="font-size: 0.7rem; color: #888;">Жиры (г)</span>
                            </div>
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center; min-width: 80px;">
                                <span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff; display: block;">${product.carbohydrates || 0}</span>
                                <span style="font-size: 0.7rem; color: #888;">Углеводы (г)</span>
                            </div>
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center; min-width: 80px;">
                                <span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff; display: block;">${product.calories || 0}</span>
                                <span style="font-size: 0.7rem; color: #888;">Ккал</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin: 1rem 0;">
                        <h3>🥄 Состав</h3>
                        <p>${escapeHtml(product.ingredients || 'Состав не указан')}</p>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        ${product.isAvailable ? `<button onclick="addToCart({id:${product.id}, name:'${escapeHtml(product.name)}', price:${product.price}})" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem 1.5rem; border-radius: 30px; border: none; color: white; font-weight: bold; margin-right: 1rem;">🛒 Добавить в корзину</button>` : ''}
                        ${canManage ? `<button onclick="editProduct(${product.id})" style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d); padding: 0.8rem 1.5rem; border-radius: 30px; border: none; font-weight: bold;">✏️ Редактировать</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showAddProductForm() {
    editingProductId = null;
    document.getElementById('app').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>➕ Добавление товара</h2>
            <button onclick="renderProducts()" class="btn">◀ Назад к товарам</button>
        </div>
        <div style="max-width: 700px; margin: 0 auto; background: #0a0a0a; padding: 2rem; border-radius: 25px; border: 2px solid #d9b8ff;">
            <form id="productForm">
                <h3>Основная информация</h3>
                <input type="text" id="productName" placeholder="Название товара" required style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                <input type="number" id="productPrice" placeholder="Цена (₽)" required style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                <input type="text" id="productCategory" placeholder="Категория" list="categories" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                <datalist id="categories">
                    <option value="Хлеб"><option value="Торт"><option value="Выпечка"><option value="Печенье">
                </datalist>
                <textarea id="productDescription" rows="3" placeholder="Описание товара" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;"></textarea>
                
                <h3>🥗 Пищевая ценность (на 100г)</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="number" id="productProteins" placeholder="Белки (г)" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productFats" placeholder="Жиры (г)" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCarbohydrates" placeholder="Углеводы (г)" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCalories" placeholder="Ккал" step="1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                </div>
                
                <h3>🥄 Состав</h3>
                <textarea id="productIngredients" rows="3" placeholder="Состав продукта (через запятую)" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;"></textarea>
                
                <div style="margin: 1rem 0;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="productIsAvailable" checked>
                        <span>Товар в наличии</span>
                    </label>
                </div>
                <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem; border-radius: 30px; border: none; color: white; font-weight: bold; width: 100%;">💾 Сохранить товар</button>
            </form>
        </div>
    `;
    
    const form = document.getElementById('productForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await createProduct();
    };
}

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
        <div style="max-width: 700px; margin: 0 auto; background: #0a0a0a; padding: 2rem; border-radius: 25px; border: 2px solid #d9b8ff;">
            <form id="productForm">
                <h3>Основная информация</h3>
                <input type="text" id="productName" value="${escapeHtml(product.name)}" required style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                <input type="number" id="productPrice" value="${product.price}" required style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                <input type="text" id="productCategory" value="${escapeHtml(product.category || '')}" list="categories" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                <datalist id="categories">
                    <option value="Хлеб"><option value="Торт"><option value="Выпечка"><option value="Печенье">
                </datalist>
                <textarea id="productDescription" rows="3" placeholder="Описание товара" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">${escapeHtml(product.description || '')}</textarea>
                
                <h3>🥗 Пищевая ценность (на 100г)</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="number" id="productProteins" placeholder="Белки (г)" step="0.1" value="${product.proteins || 0}" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productFats" placeholder="Жиры (г)" step="0.1" value="${product.fats || 0}" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCarbohydrates" placeholder="Углеводы (г)" step="0.1" value="${product.carbohydrates || 0}" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCalories" placeholder="Ккал" step="1" value="${product.calories || 0}" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                </div>
                
                <h3>🥄 Состав</h3>
                <textarea id="productIngredients" rows="3" placeholder="Состав продукта" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">${escapeHtml(product.ingredients || '')}</textarea>
                
                <div style="margin: 1rem 0;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="productIsAvailable" ${product.isAvailable ? 'checked' : ''}>
                        <span>Товар в наличии</span>
                    </label>
                </div>
                <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem; border-radius: 30px; border: none; color: white; font-weight: bold; width: 100%;">💾 Обновить товар</button>
                <button type="button" onclick="deleteProduct(${productId})" style="background: #ff4444; padding: 0.8rem; border-radius: 30px; border: none; color: white; font-weight: bold; width: 100%; margin-top: 0.5rem;">🗑️ Удалить товар</button>
            </form>
        </div>
    `;
    
    const form = document.getElementById('productForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await updateProduct(productId);
    };
}

async function createProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        proteins: parseFloat(document.getElementById('productProteins').value) || 0,
        fats: parseFloat(document.getElementById('productFats').value) || 0,
        carbohydrates: parseFloat(document.getElementById('productCarbohydrates').value) || 0,
        calories: parseInt(document.getElementById('productCalories').value) || 0,
        ingredients: document.getElementById('productIngredients').value,
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

async function updateProduct(productId) {
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        proteins: parseFloat(document.getElementById('productProteins').value) || 0,
        fats: parseFloat(document.getElementById('productFats').value) || 0,
        carbohydrates: parseFloat(document.getElementById('productCarbohydrates').value) || 0,
        calories: parseInt(document.getElementById('productCalories').value) || 0,
        ingredients: document.getElementById('productIngredients').value,
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

async function deleteProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }
    
    try {
        await apiRequest(`/products/${productId}`, 'DELETE');
        showToast('✅ Товар удалён!', 'success');
        renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

async function toggleProductAvailability(id) {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2 && currentUser.roleId !== 3)) {
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

// Глобальные функции
window.showAddProductForm = showAddProductForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleProductAvailability = toggleProductAvailability;
window.openProductDetails = openProductDetails;
window.renderProducts = renderProducts;
