document.addEventListener('DOMContentLoaded', function () {
    // Funcionalidad para botones de editar
    const editButtons = document.querySelectorAll('.action-btn:nth-child(1)');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            alert('Editar producto');
        });
    });

    // Funcionalidad para botones de eliminar
    const deleteButtons = document.querySelectorAll('.action-btn:nth-child(2)');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (confirm('¿Estás seguro que deseas eliminar este producto?')) {
                // Lógica para eliminar producto
                this.closest('.product-card').remove();
            }
        });
    });

    // Funcionalidad para botones de añadir
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.closest('.category');
            const productsGrid = category.querySelector('.products-grid');
            alert('Agregar nuevo producto a la categoría: ' + category.querySelector('.category-title').textContent);
        });
    });
});