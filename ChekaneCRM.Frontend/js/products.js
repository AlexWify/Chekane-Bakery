console.log('products.js загружен');

let editingProductId = null;
let allProducts = [];

function getProductImage(category) {
    const categoryLower = (category || '').toLowerCase();
    if (categoryLower.includes('хлеб') || categoryLower.includes('bread')) return '/images/bread.jpg';
    if (categoryLower.includes('торт') || categoryLower.includes('cake')) return '/images/cake.jpg';
    if (categoryLower.includes('выпечка') || categoryLower.includes('pastry') || categoryLower.includes('булочки')) return '/images/pastry.jpg';
    if (categoryLower.includes('печенье') || categoryLower.includes('cookie')) return '/images/gir.png';
    return '/images/default.jpg';
}

async function renderProducts(searchTerm = '') {
    const products = await loadProducts();
    allProducts = products;
    
    let filteredProducts = products;
    if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(term) ||
            (p.category && p.category.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
    }
    
    
    const app = document.getElementById('app');
    const canManage = currentUser && (currentUser.roleId === 1 || currentUser.roleId === 3);
    
    app.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
            <h2>🍞 Каталог товаров</h2>
            ${canManage ? `<button onclick="showAddProductForm()" style="background: linear-gradient(135deg, #00b894, #009432);">➕ Добавить товар</button>` : ''}
        </div>
        
        <div style="margin-bottom: 2rem; position: relative;">
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="searchInput" placeholder="🔍 Поиск товаров..." style="flex: 1; padding: 0.8rem; background: #1a1a1a; border: 2px solid #d9b8ff; border-radius: 30px; color: white;">
                <button onclick="searchProducts()" style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d); padding: 0.8rem 1.5rem; border-radius: 30px;">🔍 Найти</button>
                <button onclick="clearSearch()" style="background: #666; padding: 0.8rem 1.5rem; border-radius: 30px;">❌ Очистить</button>
            </div>
            <div id="searchSuggestions" style="position: absolute; top: 100%; left: 0; right: 0; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 15px; max-height: 300px; overflow-y: auto; z-index: 1000; display: none;"></div>
        </div>
        
        <div id="searchResultInfo" style="margin-bottom: 1rem; color: #888;"></div>
        <div class="product-grid" id="productGrid"></div>
    `;
    
    const grid = document.getElementById('productGrid');
    const resultInfo = document.getElementById('searchResultInfo');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="loading" style="text-align: center; padding: 3rem;">😕 Ничего не найдено</div>';
        resultInfo.innerHTML = 'Найдено: 0 товаров';
        return;
    }
    
    resultInfo.innerHTML = `Найдено: ${filteredProducts.length} товаров${searchTerm ? ` по запросу "${searchTerm}"` : ''}`;
    
    grid.innerHTML = filteredProducts.map(p => {
        const imagePath = getProductImage(p.category);
        return `
            <div class="product-card ${!p.isAvailable ? 'unavailable' : ''}">
                <div style="position: relative;">
                    <img src="${imagePath}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 15px; margin-bottom: 0.8rem; cursor: pointer;" onclick="openProductDetails(${p.id})">
                    ${canManage ? `
                        <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.3rem;">
                            <button onclick="event.stopPropagation(); editProduct(${p.id})" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; background: rgba(0,0,0,0.7);">✏️</button>
                            <button onclick="event.stopPropagation(); deleteProduct(${p.id})" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; background: rgba(255,68,68,0.9);">🗑️</button>
                        </div>
                    ` : ''}
                </div>
                <h3 style="cursor: pointer; color: #d9b8ff;" onclick="openProductDetails(${p.id})">${escapeHtml(p.name)}</h3>
                <div class="price">${p.price} ₽</div>
                <div style="color: #d9b8ff;">📁 ${escapeHtml(p.category || 'Без категории')}</div>
                <div style="color: #d9b8ff;">${p.isAvailable ? '✅ В наличии' : '❌ Нет в наличии'}</div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    <button onclick="openProductDetails(${p.id})">🔍 Подробнее</button>
                    ${p.isAvailable ? `<button onclick="addToCart({id:${p.id}, name:'${escapeHtml(p.name)}', price:${p.price}})">🛒 В корзину</button>` : ''}
                    ${canManage ? `<button onclick="editProduct(${p.id})">✏️ Ред.</button>` : ''}
                    ${canManage ? `<button onclick="deleteProduct(${p.id})">🗑️ Удалить</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = searchTerm;
        searchInput.addEventListener('input', showSuggestions);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchProducts(); });
    }
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    renderProducts(searchInput ? searchInput.value : '');
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    renderProducts('');
}

function showSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    const term = searchInput.value.toLowerCase().trim();
    
    if (!suggestionsDiv || term === '') {
        if (suggestionsDiv) suggestionsDiv.style.display = 'none';
        return;
    }
    
    const suggestions = allProducts.filter(p => 
        p.name.toLowerCase().includes(term) ||
        (p.category && p.category.toLowerCase().includes(term))
    ).slice(0, 8);
    
    if (suggestions.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    suggestionsDiv.innerHTML = suggestions.map(p => `
        <div onclick="selectSuggestion('${escapeHtml(p.name)}')" 
             style="padding: 0.8rem; cursor: pointer; border-bottom: 1px solid #333;"
             onmouseover="this.style.background='#2a2a2a'"
             onmouseout="this.style.background='#1a1a1a'">
            🔍 ${escapeHtml(p.name)} <span style="color: #888;">(${escapeHtml(p.category || 'Без категории')})</span>
        </div>
    `).join('');
    suggestionsDiv.style.display = 'block';
}

function selectSuggestion(productName) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = productName;
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (suggestionsDiv) suggestionsDiv.style.display = 'none';
    searchProducts();
}

// Скрываем подсказки при клике вне
document.addEventListener('click', function(e) {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    const searchInput = document.getElementById('searchInput');
    if (suggestionsDiv && searchInput && !searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
    }
});

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
                    <h1 style="font-size: 2rem;">${escapeHtml(product.name)}</h1>
                    <div class="price" style="font-size: 2rem;">${product.price} ₽</div>
                    <div style="margin: 1rem 0;">
                        <span class="badge" style="color: #d9b8ff;">📁 ${escapeHtml(product.category || 'Без категории')}</span>
                        <span class="badge ${product.isAvailable ? 'badge-success' : 'badge-danger'}">${product.isAvailable ? '✅ В наличии' : '❌ Нет в наличии'}</span>
                    </div>
                    <div style="margin: 1rem 0;">
                        <h3>📝 Описание</h3>
                        <p>${escapeHtml(product.description || 'Описание отсутствует')}</p>
                    </div>
                    <div style="margin: 1rem 0;">
                        <h3 style="color: #d9b8ff;">🥗 Пищевая ценность (на 100г)</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center;"><span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff;">${product.proteins || 0}</span><br><span style="font-size: 0.7rem; color: #d9b8ff;">Белки (г)</span></div>
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center;"><span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff;">${product.fats || 0}</span><br><span style="font-size: 0.7rem; color: #d9b8ff;">Жиры (г)</span></div>
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center;"><span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff;">${product.carbohydrates || 0}</span><br><span style="font-size: 0.7rem; color: #d9b8ff;">Углеводы (г)</span></div>
                            <div style="background: #1a1a1a; border-radius: 15px; padding: 0.8rem 1.2rem; text-align: center;"><span style="font-size: 1.5rem; font-weight: bold; color: #d9b8ff;">${product.calories || 0}</span><br><span style="font-size: 0.7rem; color: #d9b8ff;">Ккал</span></div>
                        </div>
                    </div>
                    <div style="margin: 1rem 0;">
                        <h3>🥄 Состав</h3>
                        <p>${escapeHtml(product.ingredients || 'Состав не указан')}</p>
                    </div>
                    <div style="margin-top: 2rem;">
                        ${product.isAvailable ? `<button onclick="addToCart({id:${product.id}, name:'${escapeHtml(product.name)}', price:${product.price}})" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem 1.5rem; border-radius: 30px; margin-right: 1rem;">🛒 Добавить в корзину</button>` : ''}
                        ${canManage ? `<button onclick="editProduct(${product.id})" style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d); padding: 0.8rem 1.5rem; border-radius: 30px;">✏️ Редактировать</button>` : ''}
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
                <datalist id="categories"><option value="Хлеб"><option value="Торт"><option value="Выпечка"><option value="Печенье"></datalist>
                <textarea id="productDescription" rows="3" placeholder="Описание товара" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;"></textarea>
                
                <h3>🥗 Пищевая ценность (на 100г)</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="number" id="productProteins" placeholder="Белки (г)" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productFats" placeholder="Жиры (г)" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCarbohydrates" placeholder="Углеводы (г)" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCalories" placeholder="Ккал" step="1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                </div>
                
                <h3>🥄 Состав</h3>
                <textarea id="productIngredients" rows="3" placeholder="Состав продукта" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;"></textarea>
                
                <div style="margin: 1rem 0;">
                    <label><input type="checkbox" id="productIsAvailable" checked> Товар в наличии</label>
                </div>
                <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem; border-radius: 30px; width:100%;">💾 Сохранить товар</button>
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
                <datalist id="categories"><option value="Хлеб"><option value="Торт"><option value="Выпечка"><option value="Печенье"></datalist>
                <textarea id="productDescription" rows="3" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">${escapeHtml(product.description || '')}</textarea>
                
                <h3>🥗 Пищевая ценность (на 100г)</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="number" id="productProteins" value="${product.proteins || 0}" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productFats" value="${product.fats || 0}" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCarbohydrates" value="${product.carbohydrates || 0}" step="0.1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                    <input type="number" id="productCalories" value="${product.calories || 0}" step="1" style="flex:1; padding:0.8rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">
                </div>
                
                <h3>🥄 Состав</h3>
                <textarea id="productIngredients" rows="3" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#1a1a1a; border:1px solid #d9b8ff; border-radius:12px; color:white;">${escapeHtml(product.ingredients || '')}</textarea>
                
                <div style="margin: 1rem 0;">
                    <label><input type="checkbox" id="productIsAvailable" ${product.isAvailable ? 'checked' : ''}> Товар в наличии</label>
                </div>
                <button type="submit" style="background: linear-gradient(135deg, #00b894, #009432); padding: 0.8rem; border-radius: 30px; width:100%;">💾 Обновить товар</button>
                <button type="button" onclick="deleteProduct(${productId})" style="background: #ff4444; padding: 0.8rem; border-radius: 30px; width:100%; margin-top: 0.5rem;">🗑️ Удалить товар</button>
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
        showToast('✅ Товар добавлен!', 'success');
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
    
    try {
        await apiRequest(`/products/${productId}`, 'PUT', productData);
        showToast('✅ Товар обновлён!', 'success');
        renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Удалить товар?')) return;
    try {
        await apiRequest(`/products/${productId}`, 'DELETE');
        showToast('✅ Товар удалён!', 'success');
        renderProducts();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

async function toggleProductAvailability(id) {
    try {
        await apiRequest(`/products/${id}/toggle`, 'PATCH', {});
        renderProducts();
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
window.searchProducts = searchProducts;
window.clearSearch = clearSearch;
window.selectSuggestion = selectSuggestion;
