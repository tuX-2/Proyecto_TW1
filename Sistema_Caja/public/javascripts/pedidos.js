document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeBtn = document.getElementById('closeBtn');
    const searchSubmitBtn = document.getElementById('searchSubmitBtn');

    // Abrir modal de búsqueda
    searchBtn.addEventListener('click', function () {
        searchModal.style.display = 'flex';
    });

    // Cerrar modal de búsqueda
    closeBtn.addEventListener('click', function () {
        searchModal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function (event) {
        if (event.target == searchModal) {
            searchModal.style.display = 'none';
        }
    });

    // Simular búsqueda
    searchSubmitBtn.addEventListener('click', function () {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const clientName = document.getElementById('clientName').value;
        const orderType = document.getElementById('orderType').value;

        // Aquí iría la lógica real de búsqueda
        alert(`Búsqueda realizada con los siguientes parámetros:\nDesde: ${dateFrom}\nHasta: ${dateTo}\nCliente: ${clientName}\nTipo de pedido: ${orderType}`);

        searchModal.style.display = 'none';
    });
});