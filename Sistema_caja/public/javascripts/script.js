// Sistema de Caja - Cafetería
class CafeteriaSystem {
    constructor() {
        this.orders = {
            incoming: [],
            accepted: [],
            kitchen: []
        };

        this.notifications = [];
        this.currentOrderId = 1;
        this.selectedPaymentMethod = null;
        this.currentOrderForPayment = null;

        this.productos = [
            { nombre: "Café Latte", agotado: false },
            { nombre: "Croissant", agotado: false },
            { nombre: "Huevos Rancheros", agotado: false },
            { nombre: "Café Americano", agotado: false },
            // Agrega todos los productos aquí
        ];

        // Agregar estas propiedades
        this.transacciones = this.cargarTransacciones();
        this.numeroMovimiento = this.obtenerSiguienteNumeroMovimiento();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTime();
        this.generateSampleOrders();
        this.renderAllOrders();

        // Actualizar tiempo cada segundo
        setInterval(() => this.updateTime(), 1000);

        // Generar nuevos pedidos aleatorios cada 30 segundos (para demo)
        setInterval(() => this.generateRandomOrder(), 30000);
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('home-btn').addEventListener('click', () => {
            this.setActiveNav('home-btn');
            this.addNotification('info', 'Navegación', 'Vista principal activada');
        });

        document.getElementById('products-btn').addEventListener('click', () => {
            this.setActiveNav('products-btn');
            this.addNotification('info', 'Navegación', 'Módulo de productos (próximamente)');
        });

        document.getElementById('reports-btn').addEventListener('click', () => {
            this.setActiveNav('reports-btn');
            this.addNotification('info', 'Navegación', 'Corte de caja (próximamente)');
        });

        document.getElementById('notifications-btn').addEventListener('click', () => {
            this.showNotificationsModal();
        });

        // Modal event listeners
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closePaymentModal();
        });

        document.getElementById('close-notifications').addEventListener('click', () => {
            this.closeNotificationsModal();
        });

        document.getElementById('cancel-payment').addEventListener('click', () => {
            this.closePaymentModal();
        });

        document.getElementById('confirm-payment').addEventListener('click', () => {
            this.confirmPayment();
        });

        // Payment method selection
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.target.closest('.payment-btn'));
            });
        });

        // Close modals when clicking outside
        document.getElementById('payment-modal').addEventListener('click', (e) => {
            if (e.target.id === 'payment-modal') {
                this.closePaymentModal();
            }
        });

        document.getElementById('notifications-modal').addEventListener('click', (e) => {
            if (e.target.id === 'notifications-modal') {
                this.closeNotificationsModal();
            }
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }

    setActiveNav(activeId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }

    generateSampleOrders() {
        const sampleItems = [
            { name: 'Café Americano', price: 25 },
            { name: 'Café Latte', price: 35 },
            { name: 'Cappuccino', price: 40 },
            { name: 'Jugo de Naranja', price: 30 },
            { name: 'Sandwich de Jamón', price: 65 },
            { name: 'Torta de Jamón', price: 85 },
            { name: 'Huevos Rancheros', price: 95 },
            { name: 'Hot Cakes', price: 75 },
            { name: 'Muffin de Chocolate', price: 45 },
            { name: 'Croissant', price: 35 }
        ];

        const customers = [
            'Cliente001', 'Usuario789', 'Maria123', 'Juan456', 'Ana789',
            'Carlos321', 'Sofia654', 'Pedro987', 'Laura246', 'Diego135'
        ];

        // Generar 3 pedidos entrantes
        for (let i = 0; i < 3; i++) {
            const numItems = Math.floor(Math.random() * 3) + 1;
            const orderItems = [];
            let total = 0;

            for (let j = 0; j < numItems; j++) {
                const item = sampleItems[Math.floor(Math.random() * sampleItems.length)];
                const quantity = Math.floor(Math.random() * 2) + 1;
                orderItems.push({
                    name: `${item.name} x${quantity}`,
                    price: item.price * quantity
                });
                total += item.price * quantity;
            }

            this.orders.incoming.push({
                id: this.currentOrderId++,
                customer: customers[Math.floor(Math.random() * customers.length)],
                items: orderItems,
                total: total,
                time: this.generateRandomTime(),
                status: 'incoming'
            });
        }

        // Generar 2 pedidos aceptados
        for (let i = 0; i < 2; i++) {
            const numItems = Math.floor(Math.random() * 2) + 1;
            const orderItems = [];
            let total = 0;

            for (let j = 0; j < numItems; j++) {
                const item = sampleItems[Math.floor(Math.random() * sampleItems.length)];
                orderItems.push({
                    name: item.name,
                    price: item.price
                });
                total += item.price;
            }

            this.orders.accepted.push({
                id: this.currentOrderId++,
                customer: customers[Math.floor(Math.random() * customers.length)],
                items: orderItems,
                total: total,
                time: this.generateRandomTime(),
                status: 'accepted',
                paymentMethod: null
            });
        }

        // Generar 1 pedido en cocina
        this.orders.kitchen.push({
            id: this.currentOrderId++,
            customer: 'Cliente456',
            items: [
                { name: 'Huevos Rancheros', price: 95 },
                { name: 'Café Americano', price: 25 }
            ],
            total: 120,
            time: '08:15',
            status: 'paid',
            paymentMethod: 'efectivo',
            kitchenStatus: 'cooking'
        });
    }

    generateRandomTime() {
        const now = new Date();
        const randomMinutes = Math.floor(Math.random() * 60);
        const time = new Date(now.getTime() - randomMinutes * 60000);
        return time.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    generateRandomOrder() {
        const sampleItems = [
            { name: 'Café Americano', price: 25 },
            { name: 'Café Latte', price: 35 },
            { name: 'Cappuccino', price: 40 },
            { name: 'Jugo de Naranja', price: 30 },
            { name: 'Sandwich de Jamón', price: 65 }
        ];

        const customers = ['NuevoCliente', 'ClienteApp', 'Delivery123'];

        const numItems = Math.floor(Math.random() * 2) + 1;
        const orderItems = [];
        let total = 0;

        for (let i = 0; i < numItems; i++) {
            const item = sampleItems[Math.floor(Math.random() * sampleItems.length)];
            orderItems.push({
                name: item.name,
                price: item.price
            });
            total += item.price;
        }

        const newOrder = {
            id: this.currentOrderId++,
            customer: customers[Math.floor(Math.random() * customers.length)],
            items: orderItems,
            total: total,
            time: this.generateRandomTime(),
            status: 'incoming'
        };

        this.orders.incoming.push(newOrder);
        this.renderAllOrders();
        this.addNotification('info', 'Nuevo Pedido', `Pedido #${newOrder.id} recibido`);
    }

    renderAllOrders() {
        this.renderIncomingOrders();
        this.renderAcceptedOrders();
        this.renderKitchenOrders();
        this.updateCounters();
        this.updateScrollIndicators();
    }

    updateScrollIndicators() {
        // Verificar si cada columna necesita scroll
        const containers = [
            { element: document.getElementById('incoming-orders'), column: document.querySelector('.column:nth-child(1)') },
            { element: document.getElementById('accepted-orders'), column: document.querySelector('.column:nth-child(2)') },
            { element: document.getElementById('kitchen-orders'), column: document.querySelector('.column:nth-child(3)') }
        ];

        containers.forEach(({ element, column }) => {
            if (element && column) {
                if (element.scrollHeight > element.clientHeight) {
                    column.classList.add('has-scroll');
                } else {
                    column.classList.remove('has-scroll');
                }
            }
        });
    }

    renderIncomingOrders() {
        const container = document.getElementById('incoming-orders');
        container.innerHTML = '';

        this.orders.incoming.forEach(order => {
            const orderCard = this.createOrderCard(order, 'incoming');
            container.appendChild(orderCard);
        });

        // Scroll suave al agregar nuevos elementos
        if (container.children.length > 0) {
            container.scrollTop = container.scrollHeight;
        }
    }

    renderAcceptedOrders() {
        const container = document.getElementById('accepted-orders');
        container.innerHTML = '';

        this.orders.accepted.forEach(order => {
            const orderCard = this.createOrderCard(order, 'accepted');
            container.appendChild(orderCard);
        });
    }

    renderKitchenOrders() {
        const container = document.getElementById('kitchen-orders');
        container.innerHTML = '';

        this.orders.kitchen.forEach(order => {
            const orderCard = this.createOrderCard(order, 'kitchen');
            container.appendChild(orderCard);
        });
    }

    createOrderCard(order, type) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.setAttribute('data-order-id', order.id);

        let statusBadge = '';
        if (order.status === 'paid') {
            statusBadge = '<div class="status-badge status-paid">Pagado</div>';
        } else if (order.kitchenStatus === 'ready') {
            statusBadge = '<div class="status-badge status-ready">Listo</div>';
        } else if (order.status === 'delivered') {
            statusBadge = '<div class="status-badge status-delivered">Entregado</div>';
        }

        let paymentSection = '';
        if (type === 'accepted') {
            paymentSection = `
                <div class="payment-section">
                    <label class="payment-label">Método de pago:</label>
                    <div class="payment-methods-inline">
                        <button class="payment-btn-small ${order.paymentMethod === 'efectivo' ? 'selected' : ''}" 
                                onclick="cafeteriaSystem.selectInlinePayment(${order.id}, 'efectivo')">
                            <i class="fas fa-money-bill-wave"></i> Efectivo
                        </button>
                        <button class="payment-btn-small ${order.paymentMethod === 'tarjeta' ? 'selected' : ''}" 
                                onclick="cafeteriaSystem.selectInlinePayment(${order.id}, 'tarjeta')">
                            <i class="fas fa-credit-card"></i> Tarjeta
                        </button>
                        <button class="payment-btn-small ${order.paymentMethod === 'transferencia' ? 'selected' : ''}" 
                                onclick="cafeteriaSystem.selectInlinePayment(${order.id}, 'transferencia')">
                            <i class="fas fa-mobile-alt"></i> Transfer
                        </button>
                    </div>
                </div>
            `;
        }

        let actions = '';
        if (type === 'incoming') {
            actions = `
                <div class="order-actions">
                    <button class="btn btn-success" onclick="cafeteriaSystem.acceptOrder(${order.id})">
                        <i class="fas fa-check"></i> Aceptar
                    </button>
                    <button class="btn btn-danger" onclick="cafeteriaSystem.rejectOrder(${order.id})">
                        <i class="fas fa-times"></i> Rechazar
                    </button>
                </div>
            `;
        } else if (type === 'accepted') {
            const disabled = !order.paymentMethod ? 'disabled' : '';
            actions = `
                <div class="order-actions">
                    <button class="btn btn-primary ${disabled}" onclick="cafeteriaSystem.markAsPaid(${order.id})" ${disabled}>
                        <i class="fas fa-dollar-sign"></i> Marcar Pagado
                    </button>
                </div>
            `;
        } else if (type === 'kitchen') {
            if (order.kitchenStatus === 'cooking') {
                actions = `
                    <div class="order-actions">
                        <button class="btn btn-warning" onclick="cafeteriaSystem.markAsReady(${order.id})">
                            <i class="fas fa-clock"></i> Marcar Listo
                        </button>
                    </div>
                `;
            } else if (order.kitchenStatus === 'ready') {
                actions = `
                    <div class="order-actions">
                        <button class="btn btn-success" onclick="cafeteriaSystem.markAsDelivered(${order.id})">
                            <i class="fas fa-check-circle"></i> Entregado
                        </button>
                    </div>
                `;
            }
        }

        card.innerHTML = `
            ${statusBadge}
            <div class="order-header">
                <div class="order-number">Pedido #${order.id}</div>
                <div class="order-time">${order.time}</div>
            </div>
            <div class="order-customer">
                <i class="fas fa-user"></i> ${order.customer}
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: ${order.total}
            </div>
            ${paymentSection}
            ${actions}
        `;

        return card;
    }

    updateCounters() {
        document.getElementById('incoming-count').textContent = this.orders.incoming.length;
        document.getElementById('accepted-count').textContent = this.orders.accepted.length;
        document.getElementById('kitchen-count').textContent = this.orders.kitchen.length;
    }

    acceptOrder(orderId) {
        const orderIndex = this.orders.incoming.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            const order = this.orders.incoming.splice(orderIndex, 1)[0];
            order.status = 'accepted';
            order.paymentMethod = null;
            this.orders.accepted.push(order);
            this.renderAllOrders();
            this.addNotification('success', 'Pedido Aceptado', `Pedido #${orderId} ha sido aceptado`);
        }
    }

    rejectOrder(orderId) {
        const orderIndex = this.orders.incoming.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            this.orders.incoming.splice(orderIndex, 1);
            this.renderAllOrders();
            this.addNotification('warning', 'Pedido Rechazado', `Pedido #${orderId} ha sido rechazado`);
        }
    }

    selectInlinePayment(orderId, method) {
        const order = this.orders.accepted.find(order => order.id === orderId);
        if (order) {
            order.paymentMethod = method;
            this.renderAcceptedOrders();
        }
    }

    markAsPaid(orderId) {
        const orderIndex = this.orders.accepted.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            const order = this.orders.accepted.splice(orderIndex, 1)[0];
            order.status = 'paid';
            order.kitchenStatus = 'cooking';
            this.orders.kitchen.push(order);
            this.renderAllOrders();
            this.addNotification('success', 'Pago Confirmado', `Pedido #${orderId} enviado a cocina`);
        }
    }

    markAsReady(orderId) {
        const order = this.orders.kitchen.find(order => order.id === orderId);
        if (order) {
            order.kitchenStatus = 'ready';
            this.renderKitchenOrders();
            this.addNotification('info', 'Pedido Listo', `Pedido #${orderId} está listo para entregar`);
        }
    }

    markAsDelivered(orderId) {
        const orderIndex = this.orders.kitchen.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            const order = this.orders.kitchen.splice(orderIndex, 1)[0];
            order.status = 'delivered';
            this.renderAllOrders();
            this.addNotification('success', 'Pedido Entregado', `Pedido #${orderId} ha sido entregado`);

            // Remover pedido después de 3 segundos (simulación)
            setTimeout(() => {
                this.renderAllOrders();
            }, 3000);
        }
    }

    showPaymentModal(orderId) {
        const order = this.orders.accepted.find(order => order.id === orderId);
        if (!order) return;

        this.currentOrderForPayment = order;

        // Actualizar resumen del pedido
        const orderSummary = document.getElementById('order-summary');
        orderSummary.innerHTML = `
            <h4>Pedido #${order.id} - ${order.customer}</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name}</span>
                        <span>${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: ${order.total}</div>
        `;

        // Reset payment selection
        this.selectedPaymentMethod = null;
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('confirm-payment').disabled = true;

        // Mostrar modal
        document.getElementById('payment-modal').classList.add('active');
    }

    closePaymentModal() {
        document.getElementById('payment-modal').classList.remove('active');
        this.currentOrderForPayment = null;
        this.selectedPaymentMethod = null;
    }

    selectPaymentMethod(button) {
        // Reset previous selection
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Select current
        button.classList.add('selected');
        this.selectedPaymentMethod = button.dataset.method;

        // Enable confirm button
        document.getElementById('confirm-payment').disabled = false;
    }

    confirmPayment() {
        if (!this.currentOrderForPayment || !this.selectedPaymentMethod) return;

        const orderId = this.currentOrderForPayment.id;
        this.currentOrderForPayment.paymentMethod = this.selectedPaymentMethod;

        this.markAsPaid(orderId);
        this.closePaymentModal();
    }

    showNotificationsModal() {
        document.getElementById('notifications-modal').classList.add('active');
        this.configurarBuscadorAgotados();
    }

    closeNotificationsModal() {
        document.getElementById('notifications-modal').classList.remove('active');
    }

    configurarBuscadorAgotados() {
        const input = document.getElementById('buscar-producto');
        input.value = '';
        this.renderResultados('');

        input.addEventListener('input', (e) => {
            this.renderResultados(e.target.value);
        });
    }

    renderResultados(filtro) {
        const contenedor = document.getElementById('resultados-productos');
        const productosFiltrados = this.productos.filter(p =>
            p.nombre.toLowerCase().includes(filtro.toLowerCase())
        );

        contenedor.innerHTML = '';

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = `<div class="producto-item">No se encontraron productos.</div>`;
            return;
        }

        productosFiltrados.forEach(producto => {
            const div = document.createElement('div');
            div.className = 'producto-item';

            const nombreSpan = document.createElement('span');
            nombreSpan.textContent = producto.nombre;

            const btn = document.createElement('button');
            btn.className = producto.agotado ? 'agotado' : 'marcar';
            btn.textContent = producto.agotado ? 'Disponible' : 'Marcar Agotado';
            btn.dataset.nombre = producto.nombre;
            btn.addEventListener('click', () => {
                this.marcarAgotado(producto.nombre);
            });

            div.appendChild(nombreSpan);
            div.appendChild(btn);
            contenedor.appendChild(div);
        });
    }


    marcarAgotado(nombreProducto) {
        const producto = this.productos.find(p => p.nombre === nombreProducto);
        if (!producto) return;

        producto.agotado = !producto.agotado;
        this.renderResultados(document.getElementById('buscar-producto').value);

        if (producto.agotado) {
            console.log(`🔔 Producto agotado: ${producto.nombre}`);
            this.mostrarAvisoPedidosConProducto(nombreProducto);
        }
    }

    mostrarAvisoPedidosConProducto(nombreProducto) {
        const pedidos = [
            ...this.orders.incoming,
            ...this.orders.accepted,
            ...this.orders.kitchen
        ];

        const afectados = pedidos.filter(pedido =>
            pedido.items.some(item => item.name.toLowerCase().includes(nombreProducto.toLowerCase()))
        );

        if (afectados.length > 0) {
            const mensaje = `⚠️ El producto "${nombreProducto}" está presente en los siguientes pedidos:\n\n` +
                afectados.map(p => `• Pedido #${p.id} - ${p.customer}`).join('\n') +
                `\n\n¿Deseas notificar manualmente a estos clientes?`;

            if (confirm(mensaje)) {
                this.addNotification('warning', 'Producto agotado', `"${nombreProducto}" está en pedidos activos`);
            }
        }
    }




    // Método para cargar transacciones guardadas
    cargarTransacciones() {
        const transacciones = localStorage.getItem('cafeteria_transacciones');
        return transacciones ? JSON.parse(transacciones) : [];
    }

    // Método para guardar transacciones
    guardarTransacciones() {
        localStorage.setItem('cafeteria_transacciones', JSON.stringify(this.transacciones));
    }

    // Método para obtener el siguiente número de movimiento
    obtenerSiguienteNumeroMovimiento() {
        const ultimoNumero = localStorage.getItem('cafeteria_ultimo_movimiento');
        return ultimoNumero ? parseInt(ultimoNumero) + 1 : 1;
    }

    // Método para guardar el número de movimiento
    guardarNumeroMovimiento() {
        localStorage.setItem('cafeteria_ultimo_movimiento', this.numeroMovimiento.toString());
    }

    // Método para registrar una transacción
    registrarTransaccion(pedido) {
        const ahora = new Date();
        
        const transaccion = {
            numeroMovimiento: this.numeroMovimiento,
            fecha: ahora.toLocaleDateString('es-MX'),
            hora: ahora.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            numeroPedido: pedido.id,
            cliente: pedido.customer,
            items: pedido.items,
            metodoPago: pedido.paymentMethod,
            total: pedido.total,
            timestamp: ahora.getTime()
        };
        
        this.transacciones.push(transaccion);
        this.numeroMovimiento++;
        
        this.guardarTransacciones();
        this.guardarNumeroMovimiento();
        
        // Actualizar totales del día
        this.actualizarTotalesDelDia();
        
        console.log('💰 Transacción registrada:', transaccion);
    }

    // Método para actualizar totales del día
    actualizarTotalesDelDia() {
        const hoy = new Date().toLocaleDateString('es-MX');
        const transaccionesHoy = this.transacciones.filter(t => t.fecha === hoy);
        
        const totales = {
            totalVentas: transaccionesHoy.reduce((sum, t) => sum + t.total, 0),
            totalPedidos: transaccionesHoy.length,
            promedioPorPedido: transaccionesHoy.length > 0 ? 
                (transaccionesHoy.reduce((sum, t) => sum + t.total, 0) / transaccionesHoy.length) : 0,
            fecha: hoy,
            timestamp: Date.now()
        };
        
        localStorage.setItem('cafeteria_totales_dia', JSON.stringify(totales));
    }

    // MODIFICAR tu método markAsPaid existente:
    markAsPaid(orderId) {
        const orderIndex = this.orders.accepted.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            const order = this.orders.accepted.splice(orderIndex, 1)[0];
            order.status = 'paid';
            order.kitchenStatus = 'cooking';
            
            // *** AGREGAR ESTA LÍNEA ***
            this.registrarTransaccion(order);
            
            this.orders.kitchen.push(order);
            this.renderAllOrders();
            this.addNotification('success', 'Pago Confirmado', `Pedido #${orderId} enviado a cocina - Transacción registrada`);
        }
    }

    // Método para limpiar datos del día (opcional)
    limpiarDatosDelDia() {
        if (confirm('¿Estás seguro de que quieres limpiar todas las transacciones del día?')) {
            this.transacciones = [];
            this.numeroMovimiento = 1;
            localStorage.removeItem('cafeteria_transacciones');
            localStorage.removeItem('cafeteria_totales_dia');
            localStorage.removeItem('cafeteria_ultimo_movimiento');
            
            this.addNotification('info', 'Datos Limpiados', 'Todas las transacciones han sido eliminadas');
        }
    }

    // Método para exportar datos (opcional)
    exportarTransacciones() {
        const hoy = new Date().toLocaleDateString('es-MX');
        const transaccionesHoy = this.transacciones.filter(t => t.fecha === hoy);
        
        const dataStr = JSON.stringify(transaccionesHoy, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `transacciones_${hoy.replace(/\//g, '-')}.json`;
        link.click();
        
        this.addNotification('success', 'Exportación', 'Transacciones exportadas correctamente');
    }

}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cafeteriaSystem = new CafeteriaSystem();
});



// Export for global access
window.CafeteriaSystem = CafeteriaSystem;

