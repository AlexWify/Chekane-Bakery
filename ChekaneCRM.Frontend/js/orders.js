// Страница заказов
async function renderOrders() {
    if (!currentUser) { changePage('home'); return; }
    
    const orders = await loadOrders();
    const app = document.getElementById('app');
    const canChangeStatus = currentUser && (currentUser.roleId === 1 || currentUser.roleId === 3);
    const statusText = { New: '🆕 Новый', Cooking: '👨‍🍳 Готовится', Ready: '✅ Готов', Delivered: '🚚 Доставлен' };
    
    app.innerHTML = `<h2>📦 ${currentUser.roleId === 1 ? 'Все заказы' : 'Мои заказы'}</h2>`;
    
    if (orders.length === 0) {
        app.innerHTML += '<div class="loading">Нет заказов</div>';
        return;
    }
    
    orders.forEach(order => {
        app.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div><strong>Заказ №${order.id}</strong></div>
                    <div>📅 ${new Date(order.createdAt).toLocaleDateString()}</div>
                    <div>💰 ${order.totalPrice} ₽</div>
                    <div>${canChangeStatus ? 
                        `<select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                            <option value="New" ${order.status === 'New' ? 'selected' : ''}>🆕 Новый</option>
                            <option value="Cooking" ${order.status === 'Cooking' ? 'selected' : ''}>👨‍🍳 Готовится</option>
                            <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>✅ Готов</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>🚚 Доставлен</option>
                        </select>` : 
                        `<span class="role-badge">${statusText[order.status]}</span>`
                    }</div>
                </div>
                <div><strong>Товары:</strong> ${order.orderProducts?.map(op => `${op.product?.name} x${op.quantity}`).join(', ') || '—'}</div>
            </div>
        `;
    });
}

async function updateOrderStatus(orderId, status) {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 3)) {
        showToast('⛔ Нет прав для этого действия', 'warning');
        return;
    }
    try {
        await apiRequest(`/orders/${orderId}/status`, 'PATCH', { status });
        showToast('✅ Статус заказа обновлён!', 'success');
        await renderOrders();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}
