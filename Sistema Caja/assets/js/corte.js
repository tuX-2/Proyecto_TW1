document.addEventListener('DOMContentLoaded', function () {
    // Funcionalidad para los selectores de fecha
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    // Actualizar datos cuando cambian las fechas
    startDate.addEventListener('change', updateDateRange);
    endDate.addEventListener('change', updateDateRange);

    function updateDateRange() {
        // Aquí iría el código para filtrar los movimientos según las fechas seleccionadas
        console.log(`Filtrar desde: ${startDate.value} hasta: ${endDate.value}`);
        // En una implementación real, esto haría una llamada a la API o actualizaría los datos
    }

    // Funcionalidad para el botón de imprimir
    const printBtn = document.querySelector('.print-btn');
    printBtn.addEventListener('click', function () {
        alert('Generando reporte de corte para imprimir...');
        // En una implementación real, esto abriría un diálogo de impresión
        // window.print();
    });

    // Funcionalidad para la paginación
    const paginationButtons = document.querySelectorAll('.pagination button');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remover clase activa de todos los botones
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase activa al botón clickeado
            this.classList.add('active');

            // Aquí iría la lógica para cambiar de página
            // En una implementación real, esto cargaría los datos de la página seleccionada
        });
    });
});