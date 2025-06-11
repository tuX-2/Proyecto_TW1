const currentTimeElement = document.getElementById('current-time');

// Función para actualizar la hora
function actualizarHora() {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeElement.textContent = hora;
}

// Función para cargar y mostrar datos reales
function cargarDatosCorte() {
    // Cargar transacciones del día
    const transacciones = cargarTransacciones();
    const totales = cargarTotalesDelDia();
    
    // Actualizar estadísticas
    actualizarEstadisticas(totales);
    
    // Actualizar tabla de movimientos
    actualizarTablaMovimientos(transacciones);
    
    // Actualizar fecha actual
    actualizarFecha();
    
    console.log('📊 Datos del corte cargados:', { transacciones, totales });
}

// Función para cargar transacciones
function cargarTransacciones() {
    const transacciones = localStorage.getItem('cafeteria_transacciones');
    return transacciones ? JSON.parse(transacciones) : [];
}

// Función para cargar totales del día
function cargarTotalesDelDia() {
    const totales = localStorage.getItem('cafeteria_totales_dia');
    return totales ? JSON.parse(totales) : {
        totalVentas: 0,
        totalPedidos: 0,
        promedioPorPedido: 0
    };
}

// Función para actualizar las estadísticas
function actualizarEstadisticas(totales) {
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
        statValues[0].textContent = `$${totales.totalVentas.toFixed(2)}`;
        statValues[1].textContent = totales.totalPedidos.toString();
        statValues[2].textContent = `$${totales.promedioPorPedido.toFixed(2)}`;
    }
}

// Función para actualizar la tabla de movimientos
function actualizarTablaMovimientos(transacciones) {
    const tbody = document.querySelector('.movements-table tbody');
    
    if (transacciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-transactions">
                    No hay transacciones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    // Filtrar transacciones del día actual
    const hoy = new Date().toLocaleDateString('es-MX');
    const transaccionesHoy = transacciones.filter(t => t.fecha === hoy);
    
    if (transaccionesHoy.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-transactions">
                    No hay transacciones del día de hoy
                </td>
            </tr>
        `;
        return;
    }
    
    // Mostrar las transacciones más recientes primero
    const transaccionesOrdenadas = transaccionesHoy.sort((a, b) => b.timestamp - a.timestamp);
    
    tbody.innerHTML = transaccionesOrdenadas.map(transaccion => `
        <tr>
            <td>${transaccion.numeroMovimiento}</td>
            <td>${transaccion.fecha} ${transaccion.hora}</td>
            <td>#${transaccion.numeroPedido}</td>
            <td>
                <span class="payment-method ${transaccion.metodoPago}">
                    ${getPaymentMethodIcon(transaccion.metodoPago)} ${formatPaymentMethod(transaccion.metodoPago)}
                </span>
            </td>
            <td class="amount">$${transaccion.total.toFixed(2)}</td>
        </tr>
    `).join('');
}

// Función para obtener el icono del método de pago
function getPaymentMethodIcon(metodo) {
    switch (metodo) {
        case 'efectivo': return '<i class="fas fa-money-bill-wave"></i>';
        case 'tarjeta': return '<i class="fas fa-credit-card"></i>';
        case 'transferencia': return '<i class="fas fa-mobile-alt"></i>';
        default: return '<i class="fas fa-question"></i>';
    }
}

// Función para formatear el nombre del método de pago
function formatPaymentMethod(metodo) {
    switch (metodo) {
        case 'efectivo': return 'Efectivo';
        case 'tarjeta': return 'Tarjeta';
        case 'transferencia': return 'Transferencia';
        default: return 'Desconocido';
    }
}

// Función para actualizar la fecha actual
function actualizarFecha() {
    const fechaElement = document.querySelector('.corte-date');
    if (fechaElement) {
        const hoy = new Date();
        const fecha = hoy.toLocaleDateString('es-MX');
        fechaElement.textContent = fecha;
    }
}

// Función para finalizar corte
function finalizarCorte() {
    const transacciones = cargarTransacciones();
    const totales = cargarTotalesDelDia();
    
    if (totales.totalPedidos === 0) {
        alert('No hay transacciones para finalizar el corte de caja.');
        return;
    }
    
    const resumen = `
RESUMEN DEL CORTE DE CAJA
========================
Fecha: ${new Date().toLocaleDateString('es-MX')}
Hora: ${new Date().toLocaleTimeString('es-MX')}

Total de Ventas: $${totales.totalVentas.toFixed(2)}
Total de Pedidos: ${totales.totalPedidos}
Promedio por Pedido: $${totales.promedioPorPedido.toFixed(2)}

¿Desea finalizar el corte de caja?
    `;
    
    if (confirm(resumen)) {
        // Guardar el corte finalizado
        const corteFinalizado = {
            fecha: new Date().toLocaleDateString('es-MX'),
            hora: new Date().toLocaleTimeString('es-MX'),
            totales: totales,
            transacciones: transacciones.filter(t => t.fecha === new Date().toLocaleDateString('es-MX')),
            timestamp: Date.now()
        };
        
        // Guardar histórico de cortes
        const historialCortes = JSON.parse(localStorage.getItem('cafeteria_historial_cortes') || '[]');
        historialCortes.push(corteFinalizado);
        localStorage.setItem('cafeteria_historial_cortes', JSON.stringify(historialCortes));
        
        alert('✅ Corte de caja finalizado correctamente\n\nLos datos han sido guardados en el historial.');
        
        // Opcional: Limpiar datos del día actual
        if (confirm('¿Desea limpiar los datos del día actual para empezar un nuevo turno?')) {
            localStorage.removeItem('cafeteria_transacciones');
            localStorage.removeItem('cafeteria_totales_dia');
            localStorage.setItem('cafeteria_ultimo_movimiento', '0');
            
            // Recargar la página para mostrar datos limpios
            window.location.reload();
        }
    }
}

// Función para recargar datos en tiempo real
function recargarDatos() {
    cargarDatosCorte();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar hora cada segundo
    setInterval(actualizarHora, 1000);
    actualizarHora();
    
    // Cargar datos iniciales
    cargarDatosCorte();
    
    // Recargar datos cada 30 segundos para mantener actualizado
    setInterval(recargarDatos, 30000);
    
    // Event listener para el botón finalizar
    document.querySelector('.finalize-btn').addEventListener('click', finalizarCorte);
});

// Función adicional para exportar corte
function exportarCorte() {
    const totales = cargarTotalesDelDia();
    const transacciones = cargarTransacciones();
    const hoy = new Date().toLocaleDateString('es-MX');
    
    const corteData = {
        fecha: hoy,
        hora: new Date().toLocaleTimeString('es-MX'),
        totales: totales,
        transacciones: transacciones.filter(t => t.fecha === hoy)
    };
    
    const dataStr = JSON.stringify(corteData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `corte_caja_${hoy.replace(/\//g, '-')}.json`;
    link.click();
}