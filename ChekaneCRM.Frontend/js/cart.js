// Корзина
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast(`✅ ${product.name} добавлен в корзину!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showToast('🗑️ Товар удалён из корзины', 'info');
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        } else {
            item.quantity = quantity;
        }
    }
    updateCartUI();
}

async function checkout() {
    if (!currentUser) {
        showToast('⚠️ Для оформления заказа необходимо войти в профиль', 'warning');
        showLoginPage();
        return;
    }
    
    if (cart.length === 0) {
        showToast('⚠️ Корзина пуста', 'warning');
        return;
    }
    
    const orderData = {
        clientId: currentUser.userId,
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        orderProducts: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };
    
    try {
        await createOrder(orderData);
        cart = [];
        updateCartUI();
        showToast('✅ Заказ успешно оформлен!', 'success');
        changePage('orders');
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

// Рендер корзины
async function renderCart() {
    const app = document.getElementById('app');
    
    if (cart.length === 0) {
        app.innerHTML = `
            <h2>🛒 Корзина</h2>
            <div class="empty-cart">
                <p>Корзина пуста</p>
                <button onclick="changePage('products')" class="btn">Перейти к товарам →</button>
            </div>
        `;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    app.innerHTML = `
        <h2>🛒 Моя корзина</h2>
        <div style="overflow-x: auto;">
            <table class="cart-table">
                <thead>
                    <tr><th>Товар</th><th>Цена</th><th>Количество</th><th>Сумма</th><th></th></tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td>${escapeHtml(item.name)}</td>
                            <td>${item.price} ₽</td>
                            <td>
                                <input type="number" value="${item.quantity}" min="1" 
                                       onchange="updateQuantity(${item.id}, this.value)" 
                                       style="width: 70px; padding: 5px;">
                            </td>
                            <td>${item.price * item.quantity} ₽</td>
                            <td><button onclick="removeFromCart(${item.id})" style="background:#ff4444;">🗑️</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="cart-total">
            <strong>Итого: ${total} ₽</strong>
            <button onclick="checkout()" style="margin-left: 1rem;">✅ Оформить заказ</button>
        </div>
    `;
}
