// Страница заказов
console.log('orders.js загружен');

let ordersData = [];
let currentFilterDate = '';

async function renderOrders() {
    console.log('renderOrders вызвана');
    
    if (!currentUser) { 
        changePage('home'); 
        return;
    }
    
    const isAdminOrCashier = currentUser && (currentUser.roleId === 1 || currentUser.roleId === 2);
    const isAdmin = currentUser.roleId === 1;
    const isCashier = currentUser.roleId === 2;
    
    const orders = await loadOrders();
    ordersData = orders;
    
    const app = document.getElementById('app');
    const statusText = { 
        'New': '🆕 Новый', 
        'Cooking': '👨‍🍳 Готовится', 
        'Ready': '✅ Готов', 
        'Delivered': '🚚 Доставлен' 
    };
    
    let title = '📦 Мои заказы';
    if (isAdminOrCashier) {
        title = '📦 История всех продаж';
    }
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
            <h2>${title}</h2>
            ${isAdminOrCashier ? `
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                    <input type="date" id="dateFilter" style="padding: 0.5rem; background: #1a1a1a; border: 1px solid #d9b8ff; border-radius: 8px; color: white;">
                    <button onclick="filterOrdersByDate()" style="background: linear-gradient(135deg, #d9b8ff, #ff6b9d);">🔍 Фильтровать</button>
                    <button onclick="clearDateFilter()" style="background: #666;">❌ Сбросить</button>
                    <button onclick="exportOrdersToCSV()" class="btn-export">📊 Экспорт в CSV</button>
                </div>
            ` : ''}
        </div>
    `;
    
    if (orders.length === 0) {
        html += `
            <div class="loading" style="text-align: center; padding: 3rem;">
                <p>😕 Нет заказов</p>
                ${!isAdminOrCashier ? '<button onclick="changePage(\'products\')" class="btn" style="margin-top: 1rem;">Перейти к покупкам</button>' : ''}
            </div>
        `;
        app.innerHTML = html;
        return;
    }
    
    if (isAdminOrCashier) {
        html += `
            <div style="overflow-x: auto;">
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th>№ заказа</th>
                            <th>Клиент</th>
                            <th>Дата и время</th>
                            <th>Товары</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        ${renderOrdersTable(orders, isAdmin, isCashier, statusText)}
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 2rem; padding: 1rem; background: #1a1a1a; border-radius: 15px; text-align: right;">
                <strong>💰 Общая выручка: <span id="totalRevenue">${calculateTotalRevenue(orders)}</span> ₽</strong>
            </div>
        `;
    } else {
        orders.forEach(order => {
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div><strong>Заказ №${order.id}</strong></div>
                        <div>📅 ${formatDateTime(order.createdAt)}</div>
                        <div>💰 ${order.totalPrice} ₽</div>
                        <div><span class="role-badge">${statusText[order.status] || order.status}</span></div>
                    </div>
                    <div><strong>Товары:</strong> ${order.orderProducts?.map(op => `${op.product?.name || 'Товар'} x${op.quantity}`).join(', ') || '—'}</div>
                </div>
            `;
        });
    }
    
    app.innerHTML = html;
}

function renderOrdersTable(orders, isAdmin, isCashier, statusText) {
    if (!orders.length) {
        return '<tr><td colspan="6" style="text-align: center;">Нет заказов</td></tr>';
    }
    
    return orders.map(order => `
        <tr>
            <td><strong>#${order.id}</strong></td>
            <td>${escapeHtml(order.client?.name || 'Клиент')} ${escapeHtml(order.client?.surname || '')}</td>
            <td>${formatDateTime(order.createdAt)}</td>
            <td>
                <div class="order-products-list">
                    ${order.orderProducts?.map(op => `
                        <div class="order-product-item">
                            ${escapeHtml(op.product?.name || 'Товар')} × ${op.quantity} = ${(op.product?.price || 0) * op.quantity} ₽
                        </div>
                    `).join('') || '—'}
                </div>
            </td>
            <td><strong>${order.totalPrice} ₽</strong></td>
            <td>
                ${isAdmin || isCashier ? 
                    `<select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="New" ${order.status === 'New' ? 'selected' : ''}>🆕 Новый</option>
                        <option value="Cooking" ${order.status === 'Cooking' ? 'selected' : ''}>👨‍🍳 Готовится</option>
                        <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>✅ Готов</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>🚚 Доставлен</option>
                    </select>` : 
                    `<span class="role-badge">${statusText[order.status] || order.status}</span>`
                }
            </td>
        </tr>
    `).join('');
}

function filterOrdersByDate() {
    const dateInput = document.getElementById('dateFilter');
    const filterDate = dateInput.value;
    
    if (!filterDate) {
        showToast('Выберите дату для фильтрации', 'warning');
        return;
    }
    
    currentFilterDate = filterDate;
    
    const filteredOrders = ordersData.filter(order => {
        const orderDate = order.createdAt.split('T')[0];
        return orderDate === filterDate;
    });
    
    const statusText = { 
        'New': '🆕 Новый', 
        'Cooking': '👨‍🍳 Готовится', 
        'Ready': '✅ Готов', 
        'Delivered': '🚚 Доставлен' 
    };
    
    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody) {
        const isAdmin = currentUser?.roleId === 1;
        const isCashier = currentUser?.roleId === 2;
        tableBody.innerHTML = renderOrdersTable(filteredOrders, isAdmin, isCashier, statusText);
        document.getElementById('totalRevenue').innerText = calculateTotalRevenue(filteredOrders);
        
        if (filteredOrders.length === 0) {
            showToast('Заказов за выбранную дату не найдено', 'info');
        } else {
            showToast(`Найдено ${filteredOrders.length} заказов`, 'success');
        }
    }
}

function clearDateFilter() {
    const dateInput = document.getElementById('dateFilter');
    if (dateInput) {
        dateInput.value = '';
    }
    currentFilterDate = '';
    
    const statusText = { 
        'New': '🆕 Новый', 
        'Cooking': '👨‍🍳 Готовится', 
        'Ready': '✅ Готов', 
        'Delivered': '🚚 Доставлен' 
    };
    
    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody) {
        const isAdmin = currentUser?.roleId === 1;
        const isCashier = currentUser?.roleId === 2;
        tableBody.innerHTML = renderOrdersTable(ordersData, isAdmin, isCashier, statusText);
        document.getElementById('totalRevenue').innerText = calculateTotalRevenue(ordersData);
        showToast('Фильтр сброшен', 'info');
    }
}

function calculateTotalRevenue(orders) {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
}

function formatDateTime(dateString) {
    if (!dateString) return 'Дата не указана';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Неверная дата';
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

async function updateOrderStatus(orderId, status) {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2 && currentUser.roleId !== 3)) {
        showToast('⛔ Нет прав для этого действия', 'warning');
        return;
    }
    try {
        await apiRequest(`/orders/${orderId}/status`, 'PATCH', status);
        showToast('✅ Статус заказа обновлён!', 'success');
        await renderOrders();
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ? Это действие необратимо!')) {
        return;
    }
    
    try {
        await apiRequest(`/orders/${orderId}`, 'DELETE');
        showToast('✅ Заказ удалён!', 'success');
        await renderOrders();
    } catch (error) {
        showToast('❌ Ошибка: ' + error.message, 'error');
    }
}

function exportOrdersToCSV() {
    if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2)) {
        showToast('Нет прав для экспорта', 'warning');
        return;
    }
    
    let ordersToExport = ordersData;
    if (currentFilterDate) {
        ordersToExport = ordersData.filter(order => order.createdAt.split('T')[0] === currentFilterDate);
    }
    
    if (ordersToExport.length === 0) {
        showToast('Нет данных для экспорта', 'warning');
        return;
    }
    
    const headers = ['№ заказа', 'Клиент', 'Дата и время', 'Товары', 'Сумма', 'Статус'];
    const rows = ordersToExport.map(order => [
        order.id,
        `${order.client?.name || ''} ${order.client?.surname || ''}`.trim(),
        formatDateTime(order.createdAt),
        order.orderProducts?.map(op => `${op.product?.name || 'Товар'} x${op.quantity}`).join(', '),
        order.totalPrice,
        order.status
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `orders_${currentFilterDate || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('📊 Отчёт выгружен в CSV', 'success');
}

// Глобальные функции
window.renderOrders = renderOrders;
window.updateOrderStatus = updateOrderStatus;
window.filterOrdersByDate = filterOrdersByDate;
window.clearDateFilter = clearDateFilter;
window.deleteOrder = deleteOrder;
window.exportOrdersToCSV = exportOrdersToCSV;
